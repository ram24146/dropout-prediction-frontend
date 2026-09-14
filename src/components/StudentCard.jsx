import RiskBadge from './RiskBadge'

const BAR_COLOR = { HIGH: '#ef4444', MEDIUM: '#f59e0b', LOW: '#22c55e' }

export default function StudentCard({ student, index = 0 }) {
  const { name, roll_no, attendance_pct, dropout_prob, risk_level, actions } = student
  const color = BAR_COLOR[risk_level] || '#22c55e'

  return (
    <div className="card hover:border-orange-500/30 transition-colors duration-200">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <p className="font-semibold text-white text-lg leading-tight">{name}</p>
          {roll_no && <p className="text-[#7c849a] text-sm mt-0.5">Roll no. {roll_no}</p>}
        </div>
        <RiskBadge level={risk_level} />
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-xs text-[#7c849a] mb-1.5">
          <span>Dropout probability</span>
          <span style={{ color }} className="font-semibold">{dropout_prob}%</span>
        </div>
        <div className="h-2 bg-[#0f1117] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${dropout_prob}%`, background: color }}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-[#0f1117] rounded-xl p-3 text-center">
          <p className="text-[#7c849a] text-xs mb-0.5">Attendance</p>
          <p className="text-white font-semibold text-sm">{attendance_pct}%</p>
        </div>
        <div className="bg-[#0f1117] rounded-xl p-3 text-center">
          <p className="text-[#7c849a] text-xs mb-0.5">Risk score</p>
          <p className="text-white font-semibold text-sm">{dropout_prob}%</p>
        </div>
        <div className="bg-[#0f1117] rounded-xl p-3 text-center">
          <p className="text-[#7c849a] text-xs mb-0.5">Level</p>
          <p className="text-white font-semibold text-sm">{risk_level}</p>
        </div>
      </div>

      {actions?.length > 0 && (
        <div className="border-t border-[#262c3d] pt-3 mt-2">
          <p className="text-xs text-[#7c849a] font-medium mb-2 uppercase tracking-wider">
            Recommended actions
          </p>
          <ul className="space-y-1">
            {actions.map((a, i) => (
              <li key={i} className="text-sm text-[#c5c9d6] flex gap-2">
                <span className="text-orange-400 mt-0.5 shrink-0">→</span>
                {a}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}