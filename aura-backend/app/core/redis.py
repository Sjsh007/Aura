"""
Redis client configuration for caching.
"""

from redis import asyncio as aioredis

from app.core.config import settings

redis_client = aioredis.from_url(
    settings.REDIS_URL,
    encoding="utf-8",
    decode_responses=True,
)


async def get_redis() -> aioredis.Redis:
    """Dependency to get Redis client."""
    return redis_client
