import { type NextRequest, NextResponse } from "next/server"
import { runLenderAgent } from "@/lib/agents"
import type { AuraAssessment } from "@/lib/types"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { assessment, requestedAmount, tenureMonths } = body as {
      assessment: AuraAssessment
      requestedAmount: number
      tenureMonths: number
    }

    if (!assessment || !requestedAmount || !tenureMonths) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const decision = runLenderAgent(assessment, requestedAmount, tenureMonths)

    return NextResponse.json(decision)
  } catch (error) {
    console.error("Lender agent error:", error)
    return NextResponse.json({ error: "Loan decision failed" }, { status: 500 })
  }
}
