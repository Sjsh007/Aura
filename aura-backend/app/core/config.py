"""
Application configuration using Pydantic settings.
"""

from functools import lru_cache
from typing import List

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # Application
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = Field(default="development")
    DEBUG: bool = Field(default=False)
    LOG_LEVEL: str = Field(default="INFO")
    
    # Database
    DATABASE_URL: str = Field(default="postgresql+asyncpg://aura:aura_secret@localhost:5432/aura_db")
    DB_POOL_SIZE: int = Field(default=20)
    DB_MAX_OVERFLOW: int = Field(default=10)
    
    # Redis
    REDIS_URL: str = Field(default="redis://localhost:6379/0")
    CACHE_TTL: int = Field(default=3600)
    
    # IPFS
    IPFS_API_URL: str = Field(default="http://localhost:5001")
    IPFS_GATEWAY_URL: str = Field(default="https://ipfs.io/ipfs")
    
    # Cardano
    CARDANO_NETWORK: str = Field(default="preprod")
    BLOCKFROST_PROJECT_ID: str = Field(default="")
    LENDER_PRIVATE_KEY: str = Field(default="")
    LENDER_MNEMONIC: str = Field(default="")
    
    # Security
    JWT_SECRET: str = Field(default="change-this-in-production")
    JWT_ALGORITHM: str = Field(default="HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(default=30)
    
    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = Field(default=60)
    
    # ZK Prover
    ZK_CIRCUIT_PATH: str = Field(default="/app/circuits/loan_eligibility.r1cs")
    ZK_PROVING_KEY_PATH: str = Field(default="/app/circuits/proving_key.bin")
    ZK_VERIFICATION_KEY_PATH: str = Field(default="/app/circuits/verification_key.json")
    
    # AI Models
    AURA_MODEL_PATH: str = Field(default="/app/ml_models/aura_risk_model.joblib")
    LENDER_MODEL_PATH: str = Field(default="/app/ml_models/lender_decision_model.joblib")
    
    # CORS
    CORS_ORIGINS: List[str] = Field(default=["http://localhost:3000", "https://aura-protocol.vercel.app"])
    
    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def parse_cors_origins(cls, v):
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(",")]
        return v
    
    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()


settings = get_settings()
