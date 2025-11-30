import { type NextRequest, NextResponse } from "next/server"
import { runAuraAgent } from "@/lib/agents"
import type { ZKProof } from "@/lib/types"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("[v0] Aura agent request:", { proofId: body.proof?.proofId })

    const { proof, monthlyIncome, requestedAmount, tenureMonths } = body as {
      proof: ZKProof
      monthlyIncome: number
      requestedAmount: number
      tenureMonths: number
    }

    if (!proof || !monthlyIncome || !requestedAmount || !tenureMonths) {
      console.log("[v0] Aura validation failed: missing fields")
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const assessment = runAuraAgent(proof, monthlyIncome, requestedAmount, tenureMonths)
    console.log("[v0] Aura assessment generated:", {
      riskScore: assessment.riskScore,
      recommendation: assessment.recommendation,
    })

    return NextResponse.json(assessment)
  } catch (error) {
    console.error("[v0] Aura agent error:", error instanceof Error ? error.message : error)
    return NextResponse.json({ error: "Aura assessment failed" }, { status: 500 })
  }
}
