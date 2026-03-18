export async function uploadFile(file: File, folder: string = 'basyar14'): Promise<string | null> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('folder', folder)

  const res = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  })

  if (!res.ok) return null
  const data = await res.json()
  return data.url || null
}
