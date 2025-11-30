"use client"

import React, { type ReactNode } from "react"

// Mock wallet context for hackathon MVP
// In production, integrate @meshsdk/react or lucid-cardano
export interface WalletContextType {
  walletAddress: string | null
  isConnected: boolean
  connectWallet: (walletType: "nami" | "eternl") => Promise<void>
  disconnectWallet: () => void
}

const WalletContext = React.createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: ReactNode }) {
  const [walletAddress, setWalletAddress] = React.useState<string | null>(null)
  const [isConnected, setIsConnected] = React.useState(false)

  const connectWallet = async (walletType: "nami" | "eternl") => {
    try {
      // Mock connection - in production, use actual wallet SDK
      const mockAddress = `addr_test_${Math.random().toString(36).substr(2, 20)}`
      setWalletAddress(mockAddress)
      setIsConnected(true)
      // Store in localStorage for persistence
      localStorage.setItem("walletAddress", mockAddress)
      localStorage.setItem("walletType", walletType)
    } catch (error) {
      console.error("Failed to connect wallet:", error)
    }
  }

  const disconnectWallet = () => {
    setWalletAddress(null)
    setIsConnected(false)
    localStorage.removeItem("walletAddress")
    localStorage.removeItem("walletType")
  }

  React.useEffect(() => {
    // Restore wallet connection from localStorage
    const savedAddress = localStorage.getItem("walletAddress")
    if (savedAddress) {
      setWalletAddress(savedAddress)
      setIsConnected(true)
    }
  }, [])

  return (
    <WalletContext.Provider value={{ walletAddress, isConnected, connectWallet, disconnectWallet }}>
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet(): WalletContextType {
  const context = React.useContext(WalletContext)
  if (!context) {
    throw new Error("useWallet must be used within WalletProvider")
  }
  return context
}
