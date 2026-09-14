import { useState } from 'react'
import { Routes, Route, NavLink } from 'react-router-dom'
import Dashboard   from './pages/Dashboard'
import UploadPage  from './pages/UploadPage'
import PredictPage from './pages/PredictPage'
import ModelPage   from './pages/ModelPage'

const NAV = [
  { to: '/',        label: 'Dashboard' },
  { to: '/upload',  label: 'Upload Register' },
  { to: '/predict', label: 'Single Student' },
  { to: '/model',   label: 'Model Info' },
]

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)

  const navLinkClass = ({ isActive }) =>
    `px-4 py-2 rounded-lg text-sm transition-all duration-150 font-medium ` +
    (isActive
      ? 'bg-orange-500/15 text-orange-400'
      : 'text-[#7c849a] hover:text-white hover:bg-white/5')

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-[#262c3d] bg-[#181c27]/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4 sm:gap-8">
          {/* Logo */}
          <div className="flex items-center gap-2.5 mr-auto md:mr-4">
            <span className="text-2xl">🎓</span>
            <span className="font-display font-semibold text-white text-sm leading-tight">
              Dropout<br/>
              <span className="text-orange-400">Risk AI</span>
            </span>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex gap-1 flex-1">
            {NAV.map(({ to, label }) => (
              <NavLink key={to} to={to} end={to === '/'} className={navLinkClass}>
                {label}
              </NavLink>
            ))}
          </nav>

          {/* API status — hidden on the smallest screens */}
          <div className="hidden sm:flex items-center gap-2 text-xs text-[#7c849a]">
            <span className="pulse-dot inline-block w-2 h-2 rounded-full bg-green-400" />
            API live
          </div>

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 rounded-lg
                       border border-[#262c3d] text-[#c5c9d6] hover:text-white hover:border-orange-500/50
                       transition-colors"
          >
            <span className={`block w-5 h-0.5 bg-current transition-transform duration-200 ${menuOpen ? 'translate-y-[3px] rotate-45' : ''}`} />
            <span className={`block w-5 h-0.5 bg-current my-1 transition-opacity duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-0.5 bg-current transition-transform duration-200 ${menuOpen ? '-translate-y-[5px] -rotate-45' : ''}`} />
          </button>
        </div>

        {/* Mobile dropdown menu */}
        {menuOpen && (
          <nav className="md:hidden border-t border-[#262c3d] bg-[#181c27] px-4 py-3 flex flex-col gap-1">
            {NAV.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                onClick={() => setMenuOpen(false)}
                className={navLinkClass}
              >
                {label}
              </NavLink>
            ))}
            <div className="flex items-center gap-2 text-xs text-[#7c849a] px-4 pt-2">
              <span className="pulse-dot inline-block w-2 h-2 rounded-full bg-green-400" />
              API live
            </div>
          </nav>
        )}
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-10">
        <Routes>
          <Route path="/"        element={<Dashboard />} />
          <Route path="/upload"  element={<UploadPage />} />
          <Route path="/predict" element={<PredictPage />} />
          <Route path="/model"   element={<ModelPage />} />
        </Routes>
      </main>

      <footer className="border-t border-[#262c3d] text-center text-xs text-[#7c849a] py-4 px-4">
        School Dropout Risk Predictor — Final Year Project | Jharkhand Rural Education
      </footer>
    </div>
  )
}