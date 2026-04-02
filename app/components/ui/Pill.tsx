interface PillProps {
  label: string
  variant?: 'green' | 'accent' | 'warn' | 'err' | 'muted'
  styleOverride?: React.CSSProperties
}

const VARIANTS = {
  green: { background: '#EEF2FF', border: '#E0E7FF', text: '#6366F1' },
  accent: { background: '#F5F3FF', border: '#EDE9FE', text: '#8B5CF6' },
  muted: { background: '#F3F4F6', border: '#E5E7EB', text: '#6B7280' },
  warn: { background: '#FEF3C7', border: '#FCD34D', text: '#92400E' },
  err: { background: '#FEE2E2', border: '#FECACA', text: '#DC2626' },
}

export function Pill({ label, variant = 'muted', styleOverride = {} }: PillProps) {
  const v = VARIANTS[variant as keyof typeof VARIANTS] || VARIANTS.muted
  return (
    <span style={{
      display: 'inline-block',
      padding: '3px 10px',
      borderRadius: '20px',
      fontSize: '10px',
      fontWeight: 700,
      background: v.background,
      border: `1px solid ${v.border}`,
      color: v.text,
      fontFamily: 'Nunito, sans-serif',
      ...styleOverride
    }}>
      {label}
    </span>
  )
}
