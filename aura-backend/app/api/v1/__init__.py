"""
API v1 router.
"""

from fastapi import APIRouter

from app.api.v1.endpoints import proof, agents, settlement, ipfs

router = APIRouter()

router.include_router(proof.router, prefix="/proof", tags=["ZK Proofs"])
router.include_router(agents.router, prefix="/agents", tags=["AI Agents"])
router.include_router(settlement.router, prefix="/settlement", tags=["Settlement"])
router.include_router(ipfs.router, prefix="/ipfs", tags=["IPFS"])
