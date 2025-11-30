import { type NextRequest, NextResponse } from "next/server"
import { generateProof, evaluateConditions } from "@/lib/proof-logic"
import { validateLoanApplication } from "@/lib/validation"
import type { LoanApplicationInput } from "@/lib/types"

async function sha256(data: string): Promise<string> {
  const encoder = new TextEncoder()
  const dataBuffer = encoder.encode(data)
  const hashBuffer = await globalThis.crypto.subtle.digest("SHA-256", dataBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}

function generateUUID(): string {
  return globalThis.crypto.randomUUID()
}

export async function POST(request: NextRequest) {
  console.log("[v0] Proof generation route hit")

  try {
    const body = await request.json()
    console.log("[v0] Proof generation request received:", { fullName: body.data?.fullName, cidProvided: !!body.cid })

    const { data, cid } = body as { data: LoanApplicationInput; cid: string }

    if (!data || !cid) {
      console.log("[v0] Missing required fields: data or cid")
      return NextResponse.json({ error: "Missing data or CID" }, { status: 400 })
    }

    // Validate input
    const validationErrors = validateLoanApplication(data)
    if (validationErrors.length > 0) {
      console.log("[v0] Validation errors:", validationErrors)
      return NextResponse.json({ error: "Validation failed", errors: validationErrors }, { status: 400 })
    }

    try {
      const dataString = JSON.stringify({
        fullName: data.fullName,
        email: data.email,
        monthlyIncome: Number(data.monthlyIncome),
        existingDebt: Number(data.existingDebt),
        requestedAmount: Number(data.requestedAmount),
        tenureMonths: Number(data.tenureMonths),
        purpose: data.purpose,
        hasRedFlags: Boolean(data.hasRedFlags),
      })

      const dataHash = await sha256(dataString)
      console.log("[v0] Data hash generated successfully")

      const proofId = generateUUID()

      // Evaluate conditions to include in proof hash
      const evaluation = evaluateConditions(data)
      const conditionsString = JSON.stringify(evaluation)
      const proofHash = await sha256(`${dataHash}:${proofId}:${conditionsString}`)

      console.log("[v0] Proof hash generated successfully")

      // Generate the final proof with correct parameters
      const proof = generateProof(data, cid, dataHash, proofId, proofHash)
      console.log("[v0] Proof generated successfully - valid:", proof.valid)

      return NextResponse.json(proof)
    } catch (innerError) {
      console.error("[v0] Error during proof generation:", innerError)
      const errorMessage = innerError instanceof Error ? innerError.message : "Error during proof generation"
      return NextResponse.json({ error: errorMessage }, { status: 500 })
    }
  } catch (error) {
    console.error("[v0] Request parsing error:", error)
    const errorMessage = error instanceof Error ? error.message : "Failed to parse request"
    return NextResponse.json({ error: errorMessage }, { status: 400 })
  }
}
