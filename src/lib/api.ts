const LOOPBACK_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);

function stripTrailingSlash(value: string) {
  return value.replace(/\/+$/, "");
}

function resolveFallbackBaseUrl() {
  if (typeof window === "undefined") {
    return "http://localhost:8000";
  }

  return `${window.location.protocol}//${window.location.hostname}:8000`;
}

export function getApiBaseUrl() {
  const configured = stripTrailingSlash(import.meta.env.VITE_API_BASE_URL?.trim() ?? "");

  if (!configured) {
    return resolveFallbackBaseUrl();
  }

  if (typeof window === "undefined") {
    return configured;
  }

  try {
    const parsed = new URL(configured);
    if (LOOPBACK_HOSTS.has(parsed.hostname) && !LOOPBACK_HOSTS.has(window.location.hostname)) {
      parsed.hostname = window.location.hostname;
    }
    return stripTrailingSlash(parsed.toString());
  } catch {
    return configured;
  }
}

export function apiUrl(path: string) {
  return `${getApiBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`;
}
