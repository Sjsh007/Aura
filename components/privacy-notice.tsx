"use client"

export function PrivacyNotice() {
  return (
    <div className="bg-gradient-to-r from-cyan-500/10 via-violet-500/10 to-pink-500/10 border border-white/10 rounded-xl p-4 space-y-3">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>
        <h4 className="font-semibold text-white">Your Privacy Matters</h4>
      </div>
      <div className="text-sm text-zinc-400 space-y-2 pl-10">
        <p>
          <span className="text-cyan-400 font-medium">Client-Side Encryption:</span> Your KYC data is encrypted in your
          browser before being sent anywhere.
        </p>
        <p>
          <span className="text-violet-400 font-medium">Zero-Knowledge Proof:</span> Your financial information is never
          stored unencrypted on our servers.
        </p>
        <p>
          <span className="text-pink-400 font-medium">IPFS Storage:</span> Encrypted data is stored on decentralized
          IPFS, accessible only with your private keys.
        </p>
        <p>
          <span className="text-emerald-400 font-medium">What We Never See:</span> Raw personal data, bank details, or
          sensitive financial information.
        </p>
      </div>
    </div>
  )
}
