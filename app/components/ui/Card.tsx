import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  style?: React.CSSProperties
}

export function Card({ children, className = '', onClick, style }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`animate-in ${className}`}
      style={{
        background: '#FFFFFF',
        borderRadius: '16px',
        padding: '16px',
        border: '1px solid #F3F4F6',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: onClick ? 'pointer' : 'default',
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

export function SurfCard({ children, className = '', onClick, style }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`animate-in ${className}`}
      style={{
        background: '#F9FAFB',
        borderRadius: '16px',
        padding: '16px',
        border: '1px solid #F3F4F6',
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

