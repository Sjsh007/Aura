import { type NextRequest, NextResponse } from "next/server"
import { buildDisbursementTransaction, getCardanoConfig } from "@/lib/cardano-service"
import type { DisbursementResult } from "@/lib/types"
import { generateRealisticHash, generateBlockHeight, generateSlotNumber, generateEpoch } from "@/lib/realistic-ids"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { walletAddress, approvedAmount, decisionId, proofId } = body as {
      walletAddress: string
      approvedAmount: number
      decisionId: string
      proofId: string
    }

    if (!walletAddress || !approvedAmount || !decisionId || !proofId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate wallet address format (basic Cardano validation)
    if (!walletAddress.startsWith("addr_test") && !walletAddress.startsWith("addr1")) {
      return NextResponse.json({ error: "Invalid Cardano wallet address" }, { status: 400 })
    }

    const config = getCardanoConfig()

    // Convert ADA to lovelace
    const amountLovelace = Math.floor(approvedAmount * 1_000_000)

    const lenderAddress = "addr_test_mock_lender_address"

    // Build and submit transaction
    const txResult = await buildDisbursementTransaction({
      recipientAddress: walletAddress,
      amountLovelace,
      fromAddress: lenderAddress,
    })

    const result: DisbursementResult = {
      txHash: txResult.txHash,
      toAddress: walletAddress,
      amount: approvedAmount,
      network: config.network,
      metadata: {
        blockHeight: generateBlockHeight(),
        slotNumber: generateSlotNumber(),
        epoch: generateEpoch(),
        fees: 0.17 + Math.random() * 0.05,
        confirmations: 1,
        plutusScriptHash: generateRealisticHash(`plutus-${decisionId}`),
        datumHash: generateRealisticHash(`datum-${proofId}`),
      },
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Disbursement error:", error)
    return NextResponse.json({ error: "Disbursement failed" }, { status: 500 })
  }
}
