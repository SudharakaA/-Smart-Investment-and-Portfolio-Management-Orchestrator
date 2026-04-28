import { useEffect, useState } from 'react';
import { apiUrl } from '@/lib/api';

interface AgentStatus {
  agent_id: string;
  agent_name: string;
  status: 'idle' | 'running' | 'completed' | 'error';
  started_at?: string;
  completed_at?: string;
  duration_ms?: number;
  error?: string;
}

interface AgentStatusResponse {
  agents: AgentStatus[];
  timestamp: string;
}

export const useAgentStatus = (autoRefresh: boolean = true) => {
  const [agentStatus, setAgentStatus] = useState<AgentStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = async () => {
    try {
      const response = await fetch(apiUrl('/api/orchestrator/status'));
      if (!response.ok) {
        throw new Error('Failed to fetch agent status');
      }
      const data: AgentStatusResponse = await response.json();
      setAgentStatus(data.agents);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    
    if (autoRefresh) {
      const interval = setInterval(fetchStatus, 2000); // Refresh every 2 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  return { agentStatus, loading, error, refetch: fetchStatus };
};

export const useAgentStatusStream = () => {
  const [agentStatus, setAgentStatus] = useState<AgentStatus[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const eventSource = new EventSource(apiUrl('/api/orchestrator/stream'));

    eventSource.onopen = () => {
      setConnected(true);
    };

    eventSource.onmessage = (event) => {
      try {
        const data: AgentStatusResponse = JSON.parse(event.data);
        setAgentStatus(data.agents);
      } catch (err) {
        console.error('Failed to parse SSE data:', err);
      }
    };

    eventSource.onerror = () => {
      setConnected(false);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return { agentStatus, connected };
};

export const useAgentHealthCheck = () => {
  const [healthStatus, setHealthStatus] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkHealth = async () => {
    setLoading(true);
    try {
      const response = await fetch(apiUrl('/api/agents/status'));
      if (!response.ok) {
        throw new Error('Failed to check agent health');
      }
      const data = await response.json();
      setHealthStatus(data.agents);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  return { healthStatus, loading, error, recheckHealth: checkHealth };
};
