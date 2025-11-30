"""
IPFS storage service for encrypted data.
"""

import hashlib
import json
from typing import Dict, Any, Optional

import aiohttp
import structlog

from app.core.config import settings

logger = structlog.get_logger(__name__)


class IPFSService:
    """
    IPFS service for storing and retrieving encrypted loan data.
    
    All data stored is encrypted client-side before upload.
    """
    
    def __init__(self):
        self.api_url = settings.IPFS_API_URL
        self.gateway_url = settings.IPFS_GATEWAY_URL
    
    async def upload(self, data: bytes, filename: str = "encrypted_data") -> Dict[str, Any]:
        """
        Upload encrypted data to IPFS.
        
        Returns CID and metadata.
        """
        try:
            async with aiohttp.ClientSession() as session:
                # Create multipart form data
                form = aiohttp.FormData()
                form.add_field(
                    'file',
                    data,
                    filename=filename,
                    content_type='application/octet-stream'
                )
                
                async with session.post(
                    f"{self.api_url}/api/v0/add",
                    data=form
                ) as response:
                    if response.status != 200:
                        raise Exception(f"IPFS upload failed: {response.status}")
                    
                    result = await response.json()
                    
                    cid = result["Hash"]
                    size = int(result["Size"])
                    
                    logger.info("Data uploaded to IPFS", cid=cid, size=size)
                    
                    return {
                        "cid": cid,
                        "size": size,
                        "gateway_url": f"{self.gateway_url}/{cid}",
                    }
                    
        except Exception as e:
            logger.error("IPFS upload failed", error=str(e))
            raise
    
    async def retrieve(self, cid: str) -> bytes:
        """
        Retrieve data from IPFS by CID.
        
        Returns raw encrypted bytes.
        """
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    f"{self.api_url}/api/v0/cat",
                    params={"arg": cid}
                ) as response:
                    if response.status != 200:
                        raise Exception(f"IPFS retrieval failed: {response.status}")
                    
                    data = await response.read()
                    
                    logger.info("Data retrieved from IPFS", cid=cid, size=len(data))
                    
                    return data
                    
        except Exception as e:
            logger.error("IPFS retrieval failed", cid=cid, error=str(e))
            raise
    
    async def pin(self, cid: str) -> bool:
        """Pin content to ensure persistence."""
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    f"{self.api_url}/api/v0/pin/add",
                    params={"arg": cid}
                ) as response:
                    return response.status == 200
        except Exception as e:
            logger.error("IPFS pin failed", cid=cid, error=str(e))
            return False
    
    def compute_cid(self, data: bytes) -> str:
        """
        Compute CID for data without uploading.
        
        Useful for verification.
        """
        # Simple CIDv0 computation (SHA-256 + Base58)
        hash_bytes = hashlib.sha256(data).digest()
        # In production, use proper multihash encoding
        return "Qm" + hashlib.sha256(hash_bytes).hexdigest()[:44]
