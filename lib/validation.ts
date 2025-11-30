// Input validation using basic rules (no external library for MVP)
export interface ValidationError {
  field: string
  message: string
}

export function validateLoanApplication(input: any): ValidationError[] {
  const errors: ValidationError[] = []

  if (!input.fullName || input.fullName.trim().length < 2) {
    errors.push({ field: "fullName", message: "Full name is required" })
  }

  if (!input.email || !input.email.includes("@")) {
    errors.push({ field: "email", message: "Valid email is required" })
  }

  if (!input.monthlyIncome || input.monthlyIncome < 0) {
    errors.push({ field: "monthlyIncome", message: "Monthly income is required and must be positive" })
  }

  if (input.existingDebt === undefined || input.existingDebt < 0) {
    errors.push({ field: "existingDebt", message: "Existing debt must be non-negative" })
  }

  if (!input.requestedAmount || input.requestedAmount <= 0) {
    errors.push({ field: "requestedAmount", message: "Requested amount must be positive" })
  }

  if (!input.tenureMonths || input.tenureMonths < 6 || input.tenureMonths > 60) {
    errors.push({ field: "tenureMonths", message: "Tenure must be between 6 and 60 months" })
  }

  if (!input.purpose || input.purpose.trim().length < 3) {
    errors.push({ field: "purpose", message: "Purpose is required" })
  }

  return errors
}
