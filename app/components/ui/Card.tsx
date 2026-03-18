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
      style={{
        background: '#FFFFFF',
        borderRadius: '14px',
        padding: '12px',
        border: '1px solid #E2D9C8',
        transition: 'transform 0.15s',
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
      className={className}
    >
      {children}
    </div>
  )
}

export function SurfCard({ children, className = '', onClick, style }: CardProps) {
  return (
    <div
      onClick={onClick}
      style={{
        background: '#F5F0E8',
        borderRadius: '14px',
        padding: '12px',
        border: '1px solid #E2D9C8',
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
      className={className}
    >
      {children}
    </div>
  )
}
