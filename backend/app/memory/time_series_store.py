from collections import defaultdict, deque
from typing import Any, Deque, Dict, List


class TimeSeriesMemoryStore:
    """
    Rolling time-series store for recent market state snapshots.
    """

    def __init__(self, window_size: int = 200) -> None:
        self.window_size = window_size
        self._series: Dict[str, Deque[Any]] = defaultdict(lambda: deque(maxlen=self.window_size))

    async def append(self, key: str, value: Any) -> None:
        self._series[key].append(value)

    async def latest(self, key: str, n: int = 10) -> List[Any]:
        return list(self._series[key])[-n:]
