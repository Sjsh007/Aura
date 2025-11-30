// Client-side encryption service for sensitive KYC data
// Uses Web Crypto API for browser-based encryption

export interface EncryptionResult {
  nonce: string
  ciphertext: string
}

export interface DecryptionInput {
  nonce: string
  ciphertext: string
}

// Generate encryption key from password
async function deriveKey(password: string, salt: string): Promise<CryptoKey> {
  const encoder = new TextEncoder()
  const baseKey = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveKey"])

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: encoder.encode(salt),
      iterations: 100000,
      hash: "SHA-256",
    },
    baseKey,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"],
  )
}

export async function encryptData(plaintext: string, password?: string): Promise<EncryptionResult> {
  const encoder = new TextEncoder()
  const nonce = crypto.getRandomValues(new Uint8Array(12))

  // Generate a random key if no password provided
  let key: CryptoKey
  if (password) {
    const salt = crypto.getRandomValues(new Uint8Array(16))
    key = await deriveKey(password, String.fromCharCode(...salt))
  } else {
    key = await crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"])
  }

  const ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv: nonce }, key, encoder.encode(plaintext))

  return {
    nonce: Array.from(nonce)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join(""),
    ciphertext: Array.from(new Uint8Array(ciphertext))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join(""),
  }
}

export async function decryptData(encrypted: DecryptionInput, password: string): Promise<string> {
  const decoder = new TextDecoder()
  const nonce = new Uint8Array(encrypted.nonce.match(/.{1,2}/g)!.map((byte) => Number.parseInt(byte, 16)))
  const ciphertext = new Uint8Array(encrypted.ciphertext.match(/.{1,2}/g)!.map((byte) => Number.parseInt(byte, 16)))

  // Derive key from password
  const encoder = new TextEncoder()
  const salt = "static_salt_for_demo" // In production, store and retrieve actual salt
  const baseKey = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveKey"])

  const key = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: encoder.encode(salt),
      iterations: 100000,
      hash: "SHA-256",
    },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["decrypt"],
  )

  const plaintext = await crypto.subtle.decrypt({ name: "AES-GCM", iv: nonce }, key, ciphertext)

  return decoder.decode(plaintext)
}
