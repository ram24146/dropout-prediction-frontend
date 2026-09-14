import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { checkHealth, getFeatureImportance } from '../utils/api'

const BAR_COLORS = ['#ef4444','#f97316','#f59e0b','#84cc16','#22c55e','#14b8a6','#60a5fa','#a78bfa']

export default function Dashboard() {
  const [health,  setHealth]  = useState(null)
  const [fi,      setFi]      = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.allSettled([checkHealth(), getFeatureImportance()])
      .then(([h, f]) => {
        if (h.status === 'fulfilled') setHealth(h.value)
        if (f.status === 'fulfilled') {
          const data = Object.entries(f.value)
            .map(([k, v]) => ({ name: k, value: +(v * 100).toFixed(1) }))
            .sort((a, b) => b.value - a.value)
          setFi(data)
        }
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="fade-up">
      <h1 className="text-2xl sm:text-3xl font-display font-semibold text-white mb-1">
        Dropout Risk Dashboard
      </h1>
      <p className="text-[#7c849a] mb-10">
        AI-powered early warning system for rural school students — Jharkhand
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {[
          { icon:'🤖', label:'Model',  value: health?.model_loaded ? 'Ready' : 'Not trained', ok: health?.model_loaded },
          { icon:'⚡', label:'API',    value: health ? 'Online' : 'Offline',                  ok: !!health },
          { icon:'🌐', label:'OCR',    value: 'Hindi + English',                               ok: true },
          { icon:'🎯', label:'Method', value: 'Random Forest',                                 ok: true },
        ].map(({ icon, label, value, ok }) => (
          <div key={label} className="card">
            <p className="text-[#7c849a] text-xs uppercase tracking-wider mb-2">{icon} {label}</p>
            <p className={`font-semibold ${ok ? 'text-green-400' : 'text-red-400'}`}>{value}</p>
          </div>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        <Link to="/upload" className="card group hover:border-orange-500/40 transition-colors cursor-pointer">
          <div className="text-3xl mb-3">📷</div>
          <h3 className="font-display font-semibold text-white text-lg mb-1 group-hover:text-orange-400 transition-colors">
            Upload Register Photo
          </h3>
          <p className="text-[#7c849a] text-sm">
            Photograph the attendance register. OCR reads names, roll numbers,
            and attendance automatically.
          </p>
          <span className="mt-4 inline-block text-orange-400 text-sm font-medium">Start →</span>
        </Link>

        <Link to="/predict" className="card group hover:border-orange-500/40 transition-colors cursor-pointer">
          <div className="text-3xl mb-3">🎓</div>
          <h3 className="font-display font-semibold text-white text-lg mb-1 group-hover:text-orange-400 transition-colors">
            Single Student Check
          </h3>
          <p className="text-[#7c849a] text-sm">
            Enter one student's details manually and get an instant risk
            prediction with recommended actions.
          </p>
          <span className="mt-4 inline-block text-orange-400 text-sm font-medium">Predict →</span>
        </Link>
      </div>

      <div className="card">
        <h2 className="font-display font-semibold text-white text-lg mb-1">
          What drives dropout risk?
        </h2>
        <p className="text-[#7c849a] text-sm mb-6">Feature importance from trained Random Forest model</p>
        {loading ? (
          <p className="text-[#7c849a] text-sm">Loading chart...</p>
        ) : fi.length > 0 ? (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={fi} layout="vertical" margin={{ left: 20, right: 40 }}>
              <XAxis type="number" tick={{ fill:'#7c849a', fontSize:12 }}
                     tickFormatter={v => `${v}%`} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" width={110}
                     tick={{ fill:'#c5c9d6', fontSize:12 }} axisLine={false} tickLine={false} />
              <Tooltip
                cursor={{ fill:'rgba(255,255,255,0.04)' }}
                contentStyle={{ background:'#181c27', border:'1px solid #262c3d',
                                borderRadius:12, color:'#e8eaf0', fontSize:13 }}
                formatter={v => [`${v}%`, 'Importance']}
              />
              <Bar dataKey="value" radius={[0,6,6,0]} maxBarSize={22}>
                {fi.map((_, i) => <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-[#7c849a] text-sm">Chart data not available.</p>
        )}
      </div>
    </div>
  )
}