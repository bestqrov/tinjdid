import axios from 'axios'

const baseURL = (() => {
  let url = '/api'
  if (typeof window !== 'undefined') {
    url = process.env.NEXT_PUBLIC_API_URL || '/api'
    console.log(`[Axios] Client BaseURL: ${url}`)
  } else {
    // In production Docker, the app is on port 3000
    url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'
    console.log(`[Axios] SSR BaseURL: ${url}`)
  }
  return url
})()

const instance = axios.create({ baseURL, withCredentials: true })

instance.interceptors.request.use((config) => {
  // attach token from localStorage (simple approach); improve with secure storage
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null
  if (token && config.headers) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
})

instance.interceptors.response.use(
  (res) => res,
  (err) => {
    const originalRequest = err.config
    const status = err?.response?.status
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      return instance.post('auth/refresh', {}, { withCredentials: true }).then((r) => {
        const token = r.data.access
        if (token) {
          try { localStorage.setItem('access_token', token) } catch (e) { }
          originalRequest.headers['Authorization'] = `Bearer ${token}`
        }
        return axios(originalRequest)
      }).catch((e) => {
        return Promise.reject(e)
      })
    }
    const message = err?.response?.data?.message || err?.response?.data || err.message || 'Erreur réseau'
    return Promise.reject(new Error(message))
  }
)

export default instance
