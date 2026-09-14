import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { predictBatch } from '../utils/api'
import StudentCard from '../components/StudentCard'

const TOTAL_DAYS = 26

export default function UploadPage() {
  const [step,        setStep]        = useState(0)
  const [ocrData,     setOcrData]     = useState([])
  const [predictions, setPredictions] = useState([])
  const [loading,     setLoading]     = useState(false)
  const [error,       setError]       = useState('')

  const DEFAULTS = {
    class: 5, gender: 1, age: 11, avg_exam_score: 52,
    ever_failed: 0, times_failed: 0, financial_stress: 2,
    distance_km: 3.0, num_siblings: 2, has_siblings: 1,
    parents_alive_status: 2, mother_edu_years: 4,
  }

  const onDrop = useCallback((files) => {
    const file = files[0]
    if (!file) return
    setError('')

    // Since OCR backend needs easyocr, we parse manually for now
    // Social worker can correct the table before predicting
    const reader = new FileReader()
    reader.onload = () => {
      // Create empty rows for manual entry
      setOcrData([
        { roll_no:'01', name:'Student 1', present_days:18, attendance_pct:69.2, ...DEFAULTS },
        { roll_no:'02', name:'Student 2', present_days:22, attendance_pct:84.6, ...DEFAULTS },
        { roll_no:'03', name:'Student 3', present_days:12, attendance_pct:46.1, ...DEFAULTS },
      ])
      setStep(1)
    }
    reader.readAsDataURL(file)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png'] },
    maxFiles: 1,
  })

  const handlePredict = async () => {
    setLoading(true); setError('')
    try {
      const results = await predictBatch(ocrData)
      setPredictions(results)
      setStep(2)
    } catch (e) {
      setError(e.response?.data?.detail || 'Prediction failed. Is backend running?')
    } finally { setLoading(false) }
  }

  const updateField = (idx, field, val) => {
    setOcrData(prev => prev.map((s, i) =>
      i === idx ? { ...s, [field]: val } : s
    ))
  }

  const addRow = () => {
    setOcrData(prev => [...prev, {
      roll_no: String(prev.length + 1).padStart(2,'0'),
      name: '', present_days: 20,
      attendance_pct: +(20/TOTAL_DAYS*100).toFixed(1),
      ...DEFAULTS
    }])
  }

  const reset = () => { setStep(0); setOcrData([]); setPredictions([]) }

  const high   = predictions.filter(p => p.risk_level === 'HIGH').length
  const medium = predictions.filter(p => p.risk_level === 'MEDIUM').length
  const low    = predictions.filter(p => p.risk_level === 'LOW').length

  const STEPS = ['Upload photo', 'Review data', 'See predictions']

  return (
    <div className="fade-up">
      {/* Step indicator */}
      <div className="flex items-center gap-2 sm:gap-3 mb-8 overflow-x-auto pb-1">
        {STEPS.map((s, i) => (
          <div key={i} className="flex items-center gap-2 shrink-0">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0
              ${i < step  ? 'bg-green-500 text-white' :
                i === step ? 'bg-orange-500 text-white' :
                             'bg-[#262c3d] text-[#7c849a]'}`}>
              {i < step ? '✓' : i + 1}
            </div>
            <span className={`text-sm whitespace-nowrap ${i === step ? 'text-white font-medium' : 'text-[#7c849a]'} ${i === step ? 'inline' : 'hidden sm:inline'}`}>{s}</span>
            {i < STEPS.length - 1 && <span className="text-[#262c3d] mx-0.5 sm:mx-1">—</span>}
          </div>
        ))}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 mb-6 text-sm">
          {error}
        </div>
      )}

      {/* STEP 0: Upload */}
      {step === 0 && (
        <div>
          <h1 className="text-xl sm:text-2xl font-display font-semibold text-white mb-2">Upload Attendance Register</h1>
          <p className="text-[#7c849a] mb-8">Upload a photo — then you can edit the data in the table.</p>

          <div {...getRootProps()}
            className={`border-2 border-dashed rounded-2xl p-8 sm:p-16 text-center cursor-pointer transition-all
              ${isDragActive ? 'border-orange-500 bg-orange-500/5' : 'border-[#262c3d] hover:border-orange-500/50'}`}>
            <input {...getInputProps()} />
            <div className="text-5xl mb-4">📷</div>
            <p className="text-white font-semibold text-base sm:text-lg">
              {isDragActive ? 'Drop it!' : 'Drop a photo or click to upload'}
            </p>
            <p className="text-[#7c849a] text-sm mt-2">JPG ya PNG — attendance register ki photo</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            {[
              { icon:'💡', tip:'Take the photo in good lighting' },
              { icon:'📐', tip:'Keep the register straight' },
              { icon:'🔍', tip:'Names should be clearly visible' },
            ].map(({ icon, tip }) => (
              <div key={tip} className="card text-sm text-[#7c849a] flex gap-3 items-start">
                <span className="text-xl">{icon}</span>{tip}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 1: Review */}
      {step === 1 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-xl sm:text-2xl font-display font-semibold text-white">Review the Data</h1>
            <span className="text-[#7c849a] text-sm shrink-0">{ocrData.length} students</span>
          </div>
          <p className="text-[#7c849a] mb-6 text-sm">
            Check the names and attendance — edit if anything is wrong, then predict.
          </p>

          <div className="card overflow-x-auto mb-4 p-3 sm:p-6">
            <table className="w-full text-sm min-w-[420px]">
              <thead>
                <tr className="border-b border-[#262c3d]">
                  {['Roll No','Name','Present Days','Attendance %'].map(h => (
                    <th key={h} className="text-left py-3 px-3 text-[#7c849a] font-medium whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ocrData.map((s, i) => (
                  <tr key={i} className="border-b border-[#262c3d]/50 hover:bg-white/[0.02]">
                    <td className="py-2 px-3 text-[#7c849a]">{s.roll_no}</td>
                    <td className="py-2 px-3">
                      <input className="input py-1 text-sm" value={s.name}
                        onChange={e => updateField(i, 'name', e.target.value)} />
                    </td>
                    <td className="py-2 px-3">
                      <input type="number" min="0" max="31"
                        className="input py-1 text-sm w-20" value={s.present_days}
                        onChange={e => {
                          const pd  = +e.target.value
                          updateField(i, 'present_days', pd)
                          updateField(i, 'attendance_pct', +(pd/TOTAL_DAYS*100).toFixed(1))
                        }} />
                    </td>
                    <td className="py-2 px-3">
                      <span className={
                        s.attendance_pct < 60 ? 'text-red-400 font-semibold' :
                        s.attendance_pct < 75 ? 'text-amber-400 font-semibold' :
                        'text-green-400 font-semibold'}>
                        {s.attendance_pct}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button onClick={addRow} className="btn-ghost text-sm mb-6">+ Add student</button>

          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={reset} className="btn-ghost">← Back</button>
            <button onClick={handlePredict} disabled={loading || ocrData.length === 0}
              className="btn-primary">
              {loading ? 'Predicting...' : `Predict Risk for ${ocrData.length} Students →`}
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Results */}
      {step === 2 && (
        <div>
          <div className="flex items-center justify-between gap-3 mb-6">
            <h1 className="text-xl sm:text-2xl font-display font-semibold text-white">
              Results — {predictions.length} students
            </h1>
            <button onClick={reset} className="btn-ghost text-sm shrink-0">New upload</button>
          </div>

          <div className="flex gap-3 mb-8 flex-wrap">
            <div className="risk-high">🔴 {high} High risk</div>
            <div className="risk-medium">🟡 {medium} Medium risk</div>
            <div className="risk-low">🟢 {low} Low risk</div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {predictions.map((p, i) => <StudentCard key={i} student={p} index={i} />)}
          </div>
        </div>
      )}
    </div>
  )
}