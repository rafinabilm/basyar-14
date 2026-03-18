interface PillProps {
  label: string
  variant?: 'green' | 'accent' | 'warn' | 'err' | 'muted'
  className?: string
}

const STYLES = {
  green:  { background: '#EAF7EE', color: '#1E7B3A' },
  accent: { background: '#EAF6EE', color: '#2E7D52' },
  warn:   { background: '#FFFBEB', color: '#B8860B' },
  err:    { background: '#FEE2E2', color: '#C0392B' },
  muted:  { background: '#F5F0E8', color: '#5A6E5E' },
}

export function Pill({ label, variant = 'accent', className = '' }: PillProps) {
  return (
    <span
      className={className}
      style={{
        display: 'inline-block',
        fontSize: '9px',
        fontWeight: 700,
        padding: '2px 8px',
        borderRadius: '20px',
        fontFamily: 'Nunito, sans-serif',
        ...STYLES[variant],
      }}
    >
      {label}
    </span>
  )
}
