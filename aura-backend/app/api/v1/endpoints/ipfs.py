"""
IPFS storage endpoints.
"""

from fastapi import APIRouter, HTTPException, UploadFile, File

from app.services.ipfs import IPFSService

router = APIRouter()
ipfs_service = IPFSService()


@router.post("/upload")
async def upload_encrypted_data(file: UploadFile = File(...)):
    """
    Upload encrypted data to IPFS.
    """
    try:
        data = await file.read()
        result = await ipfs_service.upload(data, file.filename)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/retrieve/{cid}")
async def retrieve_data(cid: str):
    """
    Retrieve data from IPFS by CID.
    """
    try:
        data = await ipfs_service.retrieve(cid)
        return {"cid": cid, "size": len(data)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
