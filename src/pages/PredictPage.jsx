import { useState } from 'react'
import { predictSingle } from '../utils/api'
import StudentCard from '../components/StudentCard'

const DEFAULTS = {
  name: '', roll_no: '',
  attendance_pct: 72,
  avg_exam_score: 52,
  class: 5,
  age: 11,
  gender: 1,                 // 1 = Male, 0 = Female
  distance_km: 3.0,
  times_failed: 0,
  financial_stress: 2,       // 1 = low, 2 = medium, 3 = high
  num_siblings: 2,
  parents_alive_status: 2,   // 0 = none, 1 = one, 2 = both
  mother_edu_years: 4,
}

// Slider / number fields
const FIELDS = [
  { key:'attendance_pct',   label:'Attendance %',            type:'range',  min:0, max:100, step:1   },
  { key:'avg_exam_score',   label:'Average exam score',      type:'range',  min:0, max:100, step:1   },
  { key:'distance_km',      label:'Distance to school (km)', type:'number', min:0, max:50,  step:0.1 },
  { key:'class',            label:'Class',                   type:'number', min:1, max:12,  step:1   },
  { key:'age',              label:'Age',                     type:'number', min:4, max:20,  step:1   },
  { key:'times_failed',     label:'Times failed',            type:'range',  min:0, max:5,   step:1   },
  { key:'num_siblings',     label:'Number of siblings',      type:'number', min:0, max:15,  step:1   },
  { key:'mother_edu_years', label:'Mother education (years)',type:'number', min:0, max:20,  step:1   },
]

// Dropdown (select) fields
const SELECTS = [
  { key:'gender', label:'Gender', options:[
    { v:1, t:'Male' }, { v:0, t:'Female' } ] },
  { key:'financial_stress', label:'Financial stress', options:[
    { v:1, t:'Low' }, { v:2, t:'Medium' }, { v:3, t:'High' } ] },
  { key:'parents_alive_status', label:'Parents present', options:[
    { v:2, t:'Both parents' }, { v:1, t:'One parent' }, { v:0, t:'No parents' } ] },
]

export default function PredictPage() {
  const [form,    setForm]    = useState(DEFAULTS)
  const [result,  setResult]  = useState(null)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async () => {
    setLoading(true); setError(''); setResult(null)
    try {
      // ever_failed & has_siblings are derived automatically
      const payload = { ...form,
        ever_failed:  form.times_failed > 0 ? 1 : 0,
        has_siblings: form.num_siblings > 0 ? 1 : 0 }
      const res = await predictSingle(payload)
      setResult(res)
    } catch (e) {
      setError(e.response?.data?.detail || 'Prediction failed. Is the backend running?')
    } finally { setLoading(false) }
  }

  return (
    <div className="fade-up">
      <h1 className="text-xl sm:text-2xl font-display font-semibold text-white mb-2">
        Predict for One Student
      </h1>
      <p className="text-[#7c849a] mb-8">
        Enter student details. Other fields use Jharkhand rural averages automatically.
      </p>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="card space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-[#7c849a] mb-1.5">Student name</label>
              <input className="input" placeholder="e.g. Priya Kumari"
                value={form.name} onChange={e => set('name', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm text-[#7c849a] mb-1.5">Roll number</label>
              <input className="input" placeholder="e.g. 07"
                value={form.roll_no} onChange={e => set('roll_no', e.target.value)} />
            </div>
          </div>

          {FIELDS.map(({ key, label, type, min, max, step }) => (
            <div key={key}>
              <div className="flex justify-between mb-1.5">
                <label className="text-sm text-[#7c849a]">{label}</label>
                <span className="text-sm font-semibold text-white">{form[key]}</span>
              </div>
              {type === 'range' ? (
                <input type="range" min={min} max={max} step={step}
                  value={form[key]} onChange={e => set(key, +e.target.value)}
                  className="w-full accent-orange-500" />
              ) : (
                <input type="number" min={min} max={max} step={step}
                  value={form[key]} onChange={e => set(key, +e.target.value)}
                  className="input" />
              )}
            </div>
          ))}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {SELECTS.map(({ key, label, options }) => (
              <div key={key}>
                <label className="block text-sm text-[#7c849a] mb-1.5">{label}</label>
                <select className="input" value={form[key]}
                  onChange={e => set(key, +e.target.value)}>
                  {options.map(o => <option key={o.v} value={o.v}>{o.t}</option>)}
                </select>
              </div>
            ))}
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400
                            rounded-xl px-4 py-3 text-sm">{error}</div>
          )}

          <button onClick={handleSubmit} disabled={loading} className="btn-primary w-full">
            {loading ? 'Predicting...' : '🔍 Predict Dropout Risk'}
          </button>
        </div>

        <div>
          {result ? (
            <StudentCard student={result} />
          ) : (
            <div className="card h-64 flex flex-col items-center justify-center text-center">
              <div className="text-4xl mb-3">📊</div>
              <p className="text-[#7c849a]">Prediction will appear here</p>
              <p className="text-[#7c849a] text-sm mt-1">Fill the form and click Predict</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}