from typing import Any, Dict, List


class RedisKVStore:
    """
    In-memory fallback for Redis-style state management.
    This can be replaced with a real Redis client without changing callers.
    """

    def __init__(self) -> None:
        self._data: Dict[str, Any] = {}

    async def set(self, key: str, value: Any) -> None:
        self._data[key] = value

    async def get(self, key: str) -> Any:
        return self._data.get(key)

    async def keys(self) -> List[str]:
        return sorted(self._data.keys())
