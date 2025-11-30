"use client"

import type { DisbursementResult } from "@/lib/types"
import { truncateHash } from "@/lib/realistic-ids"
import { cn } from "@/lib/utils"

interface TransactionDetailsProps {
  result: DisbursementResult
  className?: string
}

export function TransactionDetails({ result, className }: TransactionDetailsProps) {
  const explorerUrl = `https://preprod.cardanoscan.io/transaction/${result.txHash}`

  return (
    <div className={cn("bg-slate-900 border border-emerald-700/50 rounded-lg overflow-hidden", className)}>
      <div className="px-4 py-3 bg-emerald-900/30 border-b border-emerald-700/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <h3 className="text-sm font-semibold text-emerald-300">Transaction Confirmed</h3>
        </div>
        <span className="text-xs text-emerald-400 font-mono">{result.metadata.confirmations} confirmations</span>
      </div>

      <div className="p-4 space-y-4">
        {/* Transaction Hash */}
        <div className="space-y-1">
          <label className="text-xs text-slate-500 uppercase tracking-wide">Transaction Hash</label>
          <a
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block font-mono text-xs bg-slate-950 px-3 py-2 rounded border border-slate-800 text-cyan-400 hover:text-cyan-300 break-all transition-colors"
          >
            {result.txHash}
          </a>
        </div>

        {/* Amount */}
        <div className="bg-slate-950 p-4 rounded border border-slate-800 text-center">
          <div className="text-3xl font-bold text-emerald-400">₳ {result.amount.toFixed(2)}</div>
          <div className="text-xs text-slate-500 mt-1">Disbursed to wallet</div>
        </div>

        {/* Blockchain Details Grid */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-slate-950 p-3 rounded border border-slate-800">
            <div className="text-xs text-slate-500 mb-1">Block</div>
            <div className="text-sm font-mono text-slate-300">{result.metadata.blockHeight.toLocaleString()}</div>
          </div>
          <div className="bg-slate-950 p-3 rounded border border-slate-800">
            <div className="text-xs text-slate-500 mb-1">Slot</div>
            <div className="text-sm font-mono text-slate-300">{result.metadata.slotNumber.toLocaleString()}</div>
          </div>
          <div className="bg-slate-950 p-3 rounded border border-slate-800">
            <div className="text-xs text-slate-500 mb-1">Epoch</div>
            <div className="text-sm font-mono text-slate-300">{result.metadata.epoch}</div>
          </div>
        </div>

        {/* Additional Details */}
        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-500">Network</span>
            <span className="text-slate-300 font-medium">{result.network}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Fees</span>
            <span className="text-slate-300 font-mono">₳ {result.metadata.fees.toFixed(6)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Plutus Script</span>
            <span className="text-slate-300 font-mono">{truncateHash(result.metadata.plutusScriptHash, 8, 6)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Datum Hash</span>
            <span className="text-slate-300 font-mono">{truncateHash(result.metadata.datumHash, 8, 6)}</span>
          </div>
        </div>

        {/* Recipient Address */}
        <div className="space-y-1">
          <label className="text-xs text-slate-500 uppercase tracking-wide">Recipient</label>
          <div className="font-mono text-xs text-slate-400 break-all">{result.toAddress}</div>
        </div>

        {/* Explorer Link */}
        <a
          href={explorerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors text-sm font-medium"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
          View on CardanoScan
        </a>
      </div>
    </div>
  )
}
