const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5285'

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

function getToken() {
  return localStorage.getItem('token')
}

async function parseError(res) {
  const text = await res.text()
  try {
    const json = JSON.parse(text)
    if (typeof json === 'string') return json
    if (json.title) return json.title
    if (json.message) return json.message
    if (json.errors) {
      const first = Object.values(json.errors).flat()[0]
      if (first) return first
    }
    return text || res.statusText
  } catch {
    return text || res.statusText || 'Request failed'
  }
}

export async function api(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }

  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  })

  if (res.status === 204) return null

  if (!res.ok) {
    throw new ApiError(await parseError(res), res.status)
  }

  const contentType = res.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    return res.json()
  }
  return res.text()
}

export { API_URL }
