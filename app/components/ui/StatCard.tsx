import { ReactNode } from 'react'

interface StatCardProps {
  label: string
  value: string | number
  subValue?: string
  icon: ReactNode
  iconBg?: string
}

export function StatCard({ label, value, subValue, icon, iconBg = '#EEF2FF' }: StatCardProps) {
  return (
    <div style={{
      background: '#FFFFFF',
      borderRadius: '16px',
      padding: '16px',
      border: '1px solid #F3F4F6',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      flex: 1,
      minWidth: '140px'
    }}>
      <div style={{ 
        width: '36px', 
        height: '36px', 
        borderRadius: '10px', 
        background: iconBg, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: '#6366F1'
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: '20px', fontWeight: 700, color: '#111827', fontFamily: 'Space Grotesk, monospace', lineHeight: 1 }}>
          {value}
        </div>
        <div style={{ fontSize: '11px', color: '#4B5563', marginTop: '2px', fontWeight: 500 }}>
          {label}
        </div>
        {subValue && (
          <div style={{ fontSize: '9px', color: '#9CA3AF', marginTop: '4px' }}>
            {subValue}
          </div>
        )}
      </div>
    </div>
  )
}
