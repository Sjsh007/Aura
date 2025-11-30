import { type NextRequest, NextResponse } from "next/server"
import { uploadToIPFS } from "@/lib/ipfs-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { data } = body as { data: string }

    console.log("[v0] IPFS upload request received, data size:", data?.length)

    if (!data) {
      console.log("[v0] IPFS upload failed: missing data")
      return NextResponse.json({ error: "Missing data" }, { status: 400 })
    }

    // For MVP, we're mocking the upload
    // In production, integrate with web3.storage or similar
    const result = await uploadToIPFS(data)
    console.log("[v0] IPFS upload mocked, CID:", result.cid)

    return NextResponse.json({
      cid: result.cid,
      size: result.size,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[v0] IPFS upload error:", error instanceof Error ? error.message : error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
