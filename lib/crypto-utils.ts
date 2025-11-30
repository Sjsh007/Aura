import crypto from "crypto"

// Server-side only: Generate deterministic hash of data
export function hashData(data: string): string {
  return crypto.createHash("sha256").update(data).digest("hex")
}

// Server-side only: Generate UUID for proof/decision IDs
export function generateUUID(): string {
  return crypto.randomUUID()
}

// Server-side only: Client-side encryption utility for sensitive data
export async function encryptDataAES(data: string, password?: string): Promise<{ nonce: string; ciphertext: string }> {
  const nonce = crypto.randomBytes(16).toString("hex")
  const key = password ? crypto.scryptSync(password, "salt", 32) : crypto.randomBytes(32)

  const cipher = crypto.createCipheriv("aes-256-gcm", key, Buffer.from(nonce, "hex"))
  let encrypted = cipher.update(data, "utf8", "hex")
  encrypted += cipher.final("hex")

  return {
    nonce,
    ciphertext: encrypted,
  }
}
