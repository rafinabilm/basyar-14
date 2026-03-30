import { ReactNode } from 'react'

interface EmptyStateProps {
  icon: ReactNode
  title: string
  description: string
  action?: ReactNode
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '64px 32px', gap: '16px' }}>
      <div style={{ 
        width: '80px', 
        height: '80px', 
        borderRadius: '50%', 
        background: '#EEF2FF', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: '#6366F1'
      }}>
        {icon}
      </div>
      <div style={{ textAlign: 'center' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#111827' }}>{title}</h3>
        <p style={{ fontSize: '14px', color: '#6B7280', marginTop: '6px', lineHeight: 1.5, maxWidth: '240px' }}>{description}</p>
      </div>
      {action && <div style={{ marginTop: '12px' }}>{action}</div>}
    </div>
  )
}

