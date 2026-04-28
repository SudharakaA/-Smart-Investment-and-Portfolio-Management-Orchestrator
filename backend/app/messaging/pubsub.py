from collections import defaultdict
from typing import Any, DefaultDict, List


class InMemoryPubSub:
    """
    Event-driven communication abstraction for loose coupling between agents.
    """

    def __init__(self) -> None:
        self._topics: DefaultDict[str, List[Any]] = defaultdict(list)

    async def publish(self, topic: str, event: Any) -> None:
        self._topics[topic].append(event)

    async def read_topic(self, topic: str, limit: int = 100) -> List[Any]:
        events = self._topics.get(topic, [])
        return events[-limit:]
