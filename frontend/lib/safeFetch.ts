export async function safeFetchJson(input: RequestInfo, init?: RequestInit, fallback: any = null) {
  const res = await fetch(input, init)
  const ct = (res.headers.get('content-type') || '').toLowerCase()
  if (!res.ok) {
    if (ct.includes('application/json')) {
      const err = await res.json()
      throw err
    }
    const text = await res.text()
    throw new Error(text || 'Request failed')
  }
  if (ct.includes('application/json')) return res.json()
  return fallback
}

export default safeFetchJson
