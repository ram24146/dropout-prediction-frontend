export default function ModelPage() {
  const FEATURES = [
    { name:'Attendance %',           why:'Low attendance is the strongest early warning sign.' },
    { name:'Distance to school (km)',why:'Long distances are a major dropout barrier in rural areas.' },
    { name:'Average exam score',     why:'Poor academic performance leads to disengagement.' },
    { name:'Monthly family income',  why:'Economic pressure forces children to work instead of study.' },
    { name:'Family size',            why:'Larger families face more resource constraints.' },
    { name:'Previous failures',      why:'Past failures increase dropout risk significantly.' },
    { name:'Both parents present',   why:'Single-parent homes add instability and financial stress.' },
    { name:'Elder sibling dropout',  why:'Family dropout patterns strongly predict future dropouts.' },
  ]

  return (
    <div className="fade-up max-w-3xl">
      <h1 className="text-xl sm:text-2xl font-display font-semibold text-white mb-2">About the Model</h1>
      <p className="text-[#7c849a] mb-10">How the AI works, what data it uses, and its limitations.</p>

      <div className="space-y-6">
        <div className="card">
          <h2 className="font-display font-semibold text-white mb-3">Algorithm: Random Forest</h2>
          <p className="text-[#c5c9d6] text-sm leading-relaxed">
            A Random Forest builds hundreds of decision trees on different random subsets of
            training data, then combines their votes. It is ideal for this project because:
          </p>
          <ul className="mt-3 space-y-2">
            {[
              'Works well with small datasets (100–2000 students)',
              'Handles missing values without crashing',
              'Gives interpretable feature importance scores',
              'Resistant to overfitting with balanced class weights',
              'No need for feature scaling or normalisation',
            ].map(t => (
              <li key={t} className="flex gap-2 text-sm text-[#c5c9d6]">
                <span className="text-orange-400 shrink-0">✓</span>{t}
              </li>
            ))}
          </ul>
        </div>

        <div className="card">
          <h2 className="font-display font-semibold text-white mb-4">Features & why they matter</h2>
          <div className="space-y-3">
            {FEATURES.map(({ name, why }) => (
              <div key={name} className="flex flex-col sm:flex-row sm:gap-4 gap-1 p-3 bg-[#0f1117] rounded-xl">
                <div className="w-full sm:w-44 sm:shrink-0 text-sm font-medium text-orange-300">{name}</div>
                <div className="text-sm text-[#7c849a]">{why}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="font-display font-semibold text-white mb-3">Risk thresholds</h2>
          <div className="space-y-2 text-sm">
            <div className="flex flex-col sm:flex-row sm:gap-4 gap-2 sm:items-center p-3 bg-red-500/10 rounded-xl border border-red-500/20">
              <span className="risk-high w-28 text-center shrink-0">🔴 HIGH</span>
              <span className="text-[#c5c9d6]">Probability ≥ 65% — Immediate home visit recommended</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:gap-4 gap-2 sm:items-center p-3 bg-amber-500/10 rounded-xl border border-amber-500/20">
              <span className="risk-medium w-28 text-center shrink-0">🟡 MEDIUM</span>
              <span className="text-[#c5c9d6]">Probability 35–64% — Monthly monitoring, remedial class</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:gap-4 gap-2 sm:items-center p-3 bg-green-500/10 rounded-xl border border-green-500/20">
              <span className="risk-low w-28 text-center shrink-0">🟢 LOW</span>
              <span className="text-[#c5c9d6]">Probability &lt; 35% — Regular check-in is sufficient</span>
            </div>
          </div>
        </div>

        <div className="card border-amber-500/30">
          <h2 className="font-display font-semibold text-amber-400 mb-2">⚠️ Important disclaimer</h2>
          <p className="text-[#c5c9d6] text-sm leading-relaxed">
            This tool is a <strong className="text-white">decision support system</strong>, not a
            replacement for human judgment. Always involve the teacher, family, and
            social worker before taking any action.
          </p>
        </div>
      </div>
    </div>
  )
}