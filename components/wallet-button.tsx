"use client"

import React from "react"
import { useWallet } from "./wallet-provider"

export function WalletButton() {
  const { walletAddress, isConnected, connectWallet, disconnectWallet } = useWallet()
  const [open, setOpen] = React.useState(false)

  if (isConnected && walletAddress) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/30 rounded-lg">
          <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-lg shadow-emerald-500/50 animate-pulse" />
          <span className="text-sm font-mono text-zinc-300">
            {walletAddress.slice(0, 10)}...{walletAddress.slice(-8)}
          </span>
        </div>
        <button
          onClick={disconnectWallet}
          className="px-3 py-2 text-sm font-medium rounded-lg bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white transition border border-white/10"
        >
          Disconnect
        </button>
      </div>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-medium rounded-lg hover:from-cyan-400 hover:to-violet-400 transition shadow-lg shadow-violet-500/25"
      >
        Connect Wallet
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-[#1a1a2e] border border-white/10 rounded-xl shadow-2xl shadow-black/50 z-50 overflow-hidden">
          <button
            onClick={() => {
              connectWallet("nami")
              setOpen(false)
            }}
            className="w-full px-4 py-4 text-left hover:bg-white/5 transition border-b border-white/10 group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                <span className="text-white font-bold text-lg">N</span>
              </div>
              <div>
                <div className="font-medium text-white group-hover:text-cyan-400 transition">Nami Wallet</div>
                <div className="text-xs text-zinc-500">Browser Extension</div>
              </div>
            </div>
          </button>
          <button
            onClick={() => {
              connectWallet("eternl")
              setOpen(false)
            }}
            className="w-full px-4 py-4 text-left hover:bg-white/5 transition group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <div>
                <div className="font-medium text-white group-hover:text-violet-400 transition">Eternl Wallet</div>
                <div className="text-xs text-zinc-500">Multi-Account Wallet</div>
              </div>
            </div>
          </button>
        </div>
      )}
    </div>
  )
}
