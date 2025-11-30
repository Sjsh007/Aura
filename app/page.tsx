import { WalletProvider } from "@/components/wallet-provider"
import { WalletButton } from "@/components/wallet-button"
import { LoanForm } from "@/components/loan-form"
import { AuraLogo, AuraLogoAnimated } from "@/components/aura-logo"
import Link from "next/link"

export default function Home() {
  return (
    <WalletProvider>
      <main className="min-h-screen bg-[#0a0a1a]">
        {/* Background gradient effects */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl" />
        </div>

        {/* Header */}
        <header className="border-b border-white/10 bg-[#0a0a1a]/80 backdrop-blur-xl sticky top-0 z-40">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AuraLogoAnimated className="w-11 h-11" />
              <div>
                <h1 className="text-xl font-bold gradient-text">Aura Protocol</h1>
                <p className="text-xs text-zinc-500">Privacy-Preserving DeFi on Cardano</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/docs" className="text-sm text-zinc-400 hover:text-cyan-400 transition">
                Docs
              </Link>
              <Link href="#" className="text-sm text-zinc-400 hover:text-violet-400 transition">
                GitHub
              </Link>
              <div className="h-4 w-px bg-white/10" />
              <WalletButton />
            </div>
          </div>
        </header>

        {/* Network Badge */}
        <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border-b border-amber-500/20">
          <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shadow-lg shadow-amber-500/50" />
            <span className="text-xs text-amber-300 font-medium">Cardano Preprod Testnet</span>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 py-12">
          <div className="space-y-10">
            {/* Hero Section */}
            <div className="space-y-6 text-center">
              <div className="flex justify-center">
                <AuraLogoAnimated className="w-20 h-20" />
              </div>
              <h2 className="text-5xl font-bold text-white">
                <span className="gradient-text">Trustless</span> Lending
              </h2>
              <p className="text-lg text-zinc-400 max-w-xl mx-auto leading-relaxed">
                Get instant loan decisions with zero-knowledge KYC verification. Your financial data never leaves your
                device.
              </p>
              <div className="flex items-center justify-center gap-4 pt-2">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/30 rounded-full">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span className="text-xs text-cyan-300 font-medium">ZK-Powered</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-violet-500/10 border border-violet-500/30 rounded-full">
                  <div className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                  <span className="text-xs text-violet-300 font-medium">AI Risk Engine</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-pink-500/10 border border-pink-500/30 rounded-full">
                  <div className="w-1.5 h-1.5 rounded-full bg-pink-400" />
                  <span className="text-xs text-pink-300 font-medium">Plutus V2</span>
                </div>
              </div>
            </div>

            {/* Architecture Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="gradient-border p-5 text-center group hover:scale-105 transition-transform">
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyan-500/30 group-hover:shadow-cyan-500/50 transition">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-white text-sm mb-1">User Layer</h3>
                  <p className="text-xs text-zinc-500">Wallet + IPFS</p>
                </div>
              </div>
              <div className="gradient-border p-5 text-center group hover:scale-105 transition-transform">
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-rose-500/30 group-hover:shadow-rose-500/50 transition">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-white text-sm mb-1">Privacy Layer</h3>
                  <p className="text-xs text-zinc-500">ZK Circuit</p>
                </div>
              </div>
              <div className="gradient-border p-5 text-center group hover:scale-105 transition-transform">
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-violet-500/30 group-hover:shadow-violet-500/50 transition">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-white text-sm mb-1">Intelligence</h3>
                  <p className="text-xs text-zinc-500">Aura + Lender</p>
                </div>
              </div>
              <div className="gradient-border p-5 text-center group hover:scale-105 transition-transform">
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/30 group-hover:shadow-emerald-500/50 transition">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-white text-sm mb-1">Settlement</h3>
                  <p className="text-xs text-zinc-500">Plutus V2</p>
                </div>
              </div>
            </div>

            {/* How It Works */}
            <div className="gradient-border overflow-hidden">
              <div className="bg-[#12121f]">
                <div className="px-6 py-4 border-b border-white/10 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-white">Protocol Flow</h3>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-600 text-white font-bold text-sm shadow-lg shadow-cyan-500/30">
                        1
                      </div>
                    </div>
                    <div className="pt-1">
                      <h4 className="font-semibold text-white mb-1">Connect Wallet</h4>
                      <p className="text-sm text-zinc-500">Authenticate with Nami or Eternl wallet</p>
                    </div>
                  </div>
                  <div className="ml-5 h-8 border-l-2 border-dashed border-violet-500/30" />
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-violet-500 to-violet-600 text-white font-bold text-sm shadow-lg shadow-violet-500/30">
                        2
                      </div>
                    </div>
                    <div className="pt-1">
                      <h4 className="font-semibold text-white mb-1">Submit Encrypted KYC</h4>
                      <p className="text-sm text-zinc-500">Data encrypted in-browser, stored on IPFS</p>
                    </div>
                  </div>
                  <div className="ml-5 h-8 border-l-2 border-dashed border-pink-500/30" />
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-pink-500 to-pink-600 text-white font-bold text-sm shadow-lg shadow-pink-500/30">
                        3
                      </div>
                    </div>
                    <div className="pt-1">
                      <h4 className="font-semibold text-white mb-1">Generate ZK Proof</h4>
                      <p className="text-sm text-zinc-500">Prove eligibility without revealing data</p>
                    </div>
                  </div>
                  <div className="ml-5 h-8 border-l-2 border-dashed border-emerald-500/30" />
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-bold text-sm shadow-lg shadow-emerald-500/30">
                        4
                      </div>
                    </div>
                    <div className="pt-1">
                      <h4 className="font-semibold text-white mb-1">Receive ADA</h4>
                      <p className="text-sm text-zinc-500">Funds sent directly via Plutus smart contract</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Loan Form Section */}
            <div className="max-w-2xl mx-auto">
              <div className="gradient-border overflow-hidden">
                <div className="bg-[#12121f]">
                  <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <AuraLogo className="w-6 h-6" />
                      <h3 className="text-lg font-bold text-white">Loan Application</h3>
                    </div>
                    <span className="text-xs text-zinc-600 font-mono px-2 py-1 bg-white/5 rounded">v1.0.0-beta</span>
                  </div>
                  <div className="p-6">
                    <LoanForm />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="relative z-10 border-t border-white/10 bg-[#0a0a1a]/80 backdrop-blur-xl mt-20 py-10">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <AuraLogo className="w-8 h-8" />
                <span className="text-sm text-zinc-400">Aura Protocol</span>
              </div>
              <div className="flex items-center gap-8 text-sm text-zinc-500">
                <Link href="#" className="hover:text-cyan-400 transition">
                  Documentation
                </Link>
                <Link href="#" className="hover:text-violet-400 transition">
                  GitHub
                </Link>
                <Link href="#" className="hover:text-pink-400 transition">
                  Discord
                </Link>
              </div>
              <div className="text-xs text-zinc-600">Built on Cardano | Hackathon MVP</div>
            </div>
          </div>
        </footer>
      </main>
    </WalletProvider>
  )
}
