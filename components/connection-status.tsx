"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface ConnectionStatusProps {
  className?: string
}

export function ConnectionStatus({ className }: ConnectionStatusProps) {
  const [status, setStatus] = useState<"connecting" | "connected" | "error">("connecting")
  const [networkInfo, setNetworkInfo] = useState({
    network: "preprod",
    slot: "0",
    block: "0",
  })

  useEffect(() => {
    const connectTimer = setTimeout(() => {
      setStatus("connected")

      // Simulate block updates
      const blockInterval = setInterval(() => {
        setNetworkInfo((prev) => ({
          ...prev,
          slot: String(Number.parseInt(prev.slot) + Math.floor(Math.random() * 3) + 1),
          block: String(Number.parseInt(prev.block) + 1),
        }))
      }, 20000) // Every 20 seconds like real Cardano

      return () => clearInterval(blockInterval)
    }, 1500)

    // Initialize with realistic values
    setNetworkInfo({
      network: "preprod",
      slot: String(78432156 + Math.floor(Math.random() * 1000)),
      block: String(2847392 + Math.floor(Math.random() * 100)),
    })

    return () => clearTimeout(connectTimer)
  }, [])

  return (
    <div className={cn("flex items-center gap-2 text-xs", className)}>
      <div className="flex items-center gap-1.5">
        <div
          className={cn(
            "w-2 h-2 rounded-full transition-colors duration-300",
            status === "connecting" && "bg-amber-500 animate-pulse",
            status === "connected" && "bg-emerald-500 shadow-sm shadow-emerald-500/50",
            status === "error" && "bg-rose-500",
          )}
        />
        <span
          className={cn(
            "font-medium transition-colors",
            status === "connecting" && "text-amber-400",
            status === "connected" && "text-emerald-400",
            status === "error" && "text-rose-400",
          )}
        >
          {status === "connecting" && "Connecting..."}
          {status === "connected" && "Connected"}
          {status === "error" && "Disconnected"}
        </span>
      </div>

      {status === "connected" && (
        <div className="flex items-center gap-3 text-zinc-500 font-mono">
          <span className="px-1.5 py-0.5 bg-violet-500/20 text-violet-400 rounded text-[10px] uppercase">
            {networkInfo.network}
          </span>
          <span className="hidden sm:inline">
            Slot: <span className="text-zinc-400">{Number.parseInt(networkInfo.slot).toLocaleString()}</span>
          </span>
          <span className="hidden sm:inline">
            Block: <span className="text-zinc-400">{Number.parseInt(networkInfo.block).toLocaleString()}</span>
          </span>
        </div>
      )}
    </div>
  )
}
