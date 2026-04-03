export default function GlobalLoading() {
  return (
    <main style={{ paddingBottom: '120px', padding: '32px 20px 24px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}>
        
        {/* Skeleton Header */}
        <div>
          <div style={{ height: '30px', width: '150px', background: '#E5E7EB', borderRadius: '8px', marginBottom: '8px' }} />
          <div style={{ height: '14px', width: '200px', background: '#E5E7EB', borderRadius: '6px' }} />
        </div>

        {/* Skeleton Main Card */}
        <div style={{ height: '180px', borderRadius: '24px', background: '#E5E7EB' }} />
        
        {/* Skeleton Grid Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} style={{ height: '80px', borderRadius: '20px', background: '#E5E7EB' }} />
          ))}
        </div>

        {/* Skeleton List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ height: '70px', borderRadius: '16px', background: '#E5E7EB' }} />
          ))}
        </div>

      </div>
    </main>
  )
}