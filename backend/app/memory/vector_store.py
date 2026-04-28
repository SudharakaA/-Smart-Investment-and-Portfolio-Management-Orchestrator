from typing import Any, Dict, List, Tuple


class VectorMemoryStore:
    """
    Lightweight vector memory abstraction.
    Stores key + embedding-like numeric list for contextual retrieval.
    """

    def __init__(self) -> None:
        self._store: Dict[str, Tuple[List[float], Any]] = {}

    async def upsert(self, key: str, vector: List[float], payload: Any) -> None:
        self._store[key] = (vector, payload)

    async def query(self, vector: List[float], top_k: int = 3) -> List[Any]:
        if not self._store:
            return []

        # Cosine-lite similarity proxy via dot product on equal-length prefixes.
        scored: List[Tuple[float, Any]] = []
        for _, (stored_vec, payload) in self._store.items():
            length = min(len(vector), len(stored_vec))
            score = sum(vector[i] * stored_vec[i] for i in range(length))
            scored.append((score, payload))
        scored.sort(key=lambda item: item[0], reverse=True)
        return [payload for _, payload in scored[:top_k]]
