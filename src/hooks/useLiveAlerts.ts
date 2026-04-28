import { useEffect, useMemo, useState } from "react";
import { apiUrl } from "@/lib/api";

export type AlertType = "warning" | "opportunity" | "news" | "risk";

export interface LiveAlert {
  id: string;
  type: AlertType;
  title: string;
  description: string;
  time: string;
  createdAt: string;
  agent: string;
  read: boolean;
}

interface ApiAlert {
  severity: "low" | "medium" | "high";
  category: AlertType;
  title: string;
  message: string;
  agent?: string;
  createdAt?: string;
}

function relativeTime(iso: string): string {
  const t = new Date(iso).getTime();
  const now = Date.now();
  const diffMins = Math.max(1, Math.floor((now - t) / 60000));
  if (diffMins < 60) return `${diffMins}m ago`;
  const hours = Math.floor(diffMins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function toLiveAlerts(items: ApiAlert[], batchTs: string): LiveAlert[] {
  return items.map((item, idx) => {
    const createdAt = item.createdAt ?? batchTs;
    return {
      id: `${createdAt}-${idx}-${item.title}`,
      type: item.category,
      title: item.title,
      description: item.message,
      time: relativeTime(createdAt),
      createdAt,
      agent: item.agent ?? "Alert & Automation Agent",
      read: false,
    };
  });
}

export function useLiveAlerts(limit = 30) {
  const [alerts, setAlerts] = useState<LiveAlert[]>([]);
  const [connected, setConnected] = useState(false);
  useEffect(() => {
    let eventSource: EventSource | null = null;
    let poller: ReturnType<typeof setInterval> | null = null;
    let cancelled = false;

    const mergeAlerts = (incoming: LiveAlert[]) => {
      setAlerts((prev) => {
        const merged = [...incoming, ...prev];
        const dedup = Array.from(new Map(merged.map((a) => [a.id, a])).values());
        return dedup.slice(0, limit);
      });
    };

    const startPolling = () => {
      if (poller) return;
      const fetchOnce = async () => {
        try {
          const res = await fetch(apiUrl("/api/alerts/live"));
          if (!res.ok) return;
          const data = await res.json();
          mergeAlerts(toLiveAlerts(data?.alerts ?? [], data?.timestamp ?? new Date().toISOString()));
        } catch {
          // no-op fallback
        }
      };
      void fetchOnce();
      poller = setInterval(fetchOnce, 8000);
    };

    try {
      eventSource = new EventSource(apiUrl("/api/alerts/stream"));
      eventSource.onopen = () => setConnected(true);
      eventSource.onmessage = (event) => {
        if (cancelled) return;
        try {
          const payload = JSON.parse(event.data);
          mergeAlerts(toLiveAlerts(payload?.alerts ?? [], payload?.timestamp ?? new Date().toISOString()));
        } catch {
          // ignore malformed payload
        }
      };
      eventSource.onerror = () => {
        setConnected(false);
        eventSource?.close();
        eventSource = null;
        startPolling();
      };
    } catch {
      setConnected(false);
      startPolling();
    }

    const refreshTime = setInterval(() => {
      setAlerts((prev) =>
        prev.map((a) => ({
          ...a,
          time: relativeTime(a.createdAt),
        })),
      );
    }, 60000);

    return () => {
      cancelled = true;
      if (eventSource) eventSource.close();
      if (poller) clearInterval(poller);
      clearInterval(refreshTime);
    };
  }, [limit]);

  const unreadCount = useMemo(() => alerts.filter((a) => !a.read).length, [alerts]);

  const markAsRead = (id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, read: true } : a)));
  };

  const dismissAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  return { alerts, unreadCount, connected, markAsRead, dismissAlert };
}
