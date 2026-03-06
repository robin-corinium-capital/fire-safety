import { useState } from 'react'
import { Flame } from 'lucide-react'

function App() {
  const [screen, setScreen] = useState('home')

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-2">
          <Flame className="w-6 h-6 text-emerald-600" />
          <div>
            <h1 className="text-lg font-semibold leading-tight">fire safety</h1>
            <p className="text-xs text-slate-500">by stayd</p>
          </div>
        </div>
      </header>

      {/* Main content area — ready for screens */}
      <main className="flex-1 px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg border border-slate-200 p-6 text-center">
            <Flame className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Fire Safety Compliance Checker</h2>
            <p className="text-slate-500 text-sm">
              Free and open-source fire safety compliance checker for short-term holiday rentals.
            </p>
            <p className="text-slate-400 text-xs mt-4">
              Screens coming soon — scaffold ready.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 px-4 py-4">
        <div className="max-w-3xl mx-auto text-center text-xs text-slate-500 space-y-1">
          <p>fire safety &middot; by stayd</p>
          <p className="text-slate-400">
            This tool provides general guidance only and does not constitute professional fire safety advice.
            Always consult a qualified fire safety professional for your specific property.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
