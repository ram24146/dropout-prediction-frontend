export default function RiskBadge({ level }) {
  const map = {
    HIGH:   { cls: 'risk-high',   icon: '🔴', label: 'High Risk' },
    MEDIUM: { cls: 'risk-medium', icon: '🟡', label: 'Medium Risk' },
    LOW:    { cls: 'risk-low',    icon: '🟢', label: 'Low Risk' },
  }
  const { cls, icon, label } = map[level] || map.LOW
  return <span className={cls}>{icon} {label}</span>
}
 