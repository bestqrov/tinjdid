export function decodeToken(token?: string) {
  if (!token) return null
  try {
    const parts = token.split('.')
    if (parts.length < 2) return null
    const payload = parts[1]
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(decodeURIComponent(escape(decoded)))
  } catch (e) {
    try {
      // fallback simple base64
      const payload = token.split('.')[1]
      return JSON.parse(Buffer.from(payload, 'base64').toString('utf8'))
    } catch (err) {
      return null
    }
  }
}
