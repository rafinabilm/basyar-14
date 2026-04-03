export default function GaleriLoading() {
  return (
    <main style={{ padding: '32px 20px', paddingBottom: '120px' }}>
      {/* Header Skeleton */}
      <div style={{ height: '30px', width: '150px', background: '#E5E7EB', borderRadius: '8px', marginBottom: '24px' }} />
      
      {/* Grid Galeri Skeleton */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
        {[1, 2, 3, 4, 5, 6].map(i => (
           <div key={i} style={{ height: '160px', borderRadius: '16px', background: '#E5E7EB', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
        ))}
      </div>
    </main>
  )
}