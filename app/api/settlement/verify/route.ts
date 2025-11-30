import { type NextRequest, NextResponse } from "next/server"
import { verifyTransaction } from "@/lib/cardano-service"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const txHash = searchParams.get("txHash")

    if (!txHash) {
      return NextResponse.json({ error: "Missing txHash" }, { status: 400 })
    }

    const isValid = await verifyTransaction(txHash)

    return NextResponse.json({
      txHash,
      verified: isValid,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Verification error:", error)
    return NextResponse.json({ error: "Verification failed" }, { status: 500 })
  }
}
