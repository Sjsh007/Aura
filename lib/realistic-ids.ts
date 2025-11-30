// Utility to generate realistic-looking cryptographic identifiers
// These create authentic-looking hashes, CIDs, and transaction IDs

export function generateRealisticHash(seed?: string): string {
  // Generate a realistic 64-character hex hash (SHA-256 style)
  const chars = "0123456789abcdef"
  let hash = ""
  const seedNum = seed ? seed.split("").reduce((a, b) => a + b.charCodeAt(0), 0) : Date.now()

  for (let i = 0; i < 64; i++) {
    const idx = (seedNum * (i + 1) * 7 + i * 13) % 16
    hash += chars[idx]
  }
  return hash
}

export function generateRealisticIPFSCid(seed?: string): string {
  // Generate a realistic IPFS CID v1 (starts with bafy...)
  const base32Chars = "abcdefghijklmnopqrstuvwxyz234567"
  const seedNum = seed ? seed.split("").reduce((a, b) => a + b.charCodeAt(0), 0) : Date.now()

  let cid = "bafybei"
  for (let i = 0; i < 52; i++) {
    const idx = (seedNum * (i + 1) * 11 + i * 17) % 32
    cid += base32Chars[idx]
  }
  return cid
}

export function generateRealisticTxHash(seed?: string): string {
  // Generate a Cardano-style transaction hash (64 hex chars)
  return generateRealisticHash(seed || `tx-${Date.now()}`)
}

export function generateRealisticProofId(): string {
  // Generate a realistic proof ID (UUID v4 format)
  const hex = "0123456789abcdef"
  const template = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx"
  const seedNum = Date.now()

  return template.replace(/[xy]/g, (c, i) => {
    const r = (seedNum * (i + 1) * 3) % 16
    const v = c === "x" ? r : (r & 0x3) | 0x8
    return hex[v]
  })
}

export function generateBlockHeight(): number {
  // Generate a realistic Cardano preprod block height (around current range)
  return Math.floor(2800000 + Math.random() * 100000)
}

export function generateSlotNumber(): number {
  // Generate a realistic slot number
  return Math.floor(85000000 + Math.random() * 1000000)
}

export function generateEpoch(): number {
  // Generate realistic epoch
  return Math.floor(520 + Math.random() * 10)
}

export function formatTimestamp(date?: Date): string {
  const d = date || new Date()
  return d.toISOString().replace("T", " ").slice(0, 23) + " UTC"
}

export function truncateHash(hash: string, startLen = 8, endLen = 8): string {
  if (hash.length <= startLen + endLen + 3) return hash
  return `${hash.slice(0, startLen)}...${hash.slice(-endLen)}`
}
