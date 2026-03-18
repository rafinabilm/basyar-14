import { ReactNode } from 'react'

interface EmptyStateProps {
  icon: ReactNode
  title: string
  description: string
  action?: ReactNode
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 24px', gap: '12px' }}>
      <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#EAF6EE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {icon}
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '15px', fontWeight: 800, color: '#1C2B22' }}>{title}</div>
        <div style={{ fontSize: '11px', color: '#A0B0A4', marginTop: '4px', lineHeight: 1.6 }}>{description}</div>
      </div>
      {action && <div style={{ marginTop: '8px' }}>{action}</div>}
    </div>
  )
}
