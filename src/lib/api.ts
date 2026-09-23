const configuredApiUrl = import.meta.env.VITE_API_URL as string | undefined

function apiUrl(): string {
  const value = configuredApiUrl?.trim().replace(/\/+$/, '')
  if (!value) {
    throw new Error('VITE_API_URL no está configurada.')
  }
  return value
}

export class ApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

function errorMessage(body: unknown, fallback: string): string {
  if (
    body &&
    typeof body === 'object' &&
    'message' in body &&
    typeof body.message === 'string'
  ) {
    return body.message
  }
  return fallback
}

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers)
  if (init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const response = await fetch(`${apiUrl()}${path}`, { ...init, headers })
  const contentType = response.headers.get('content-type') ?? ''
  const body: unknown = contentType.includes('application/json')
    ? await response.json()
    : null

  if (!response.ok) {
    throw new ApiError(response.status, errorMessage(body, `Error HTTP ${response.status}.`))
  }

  return body as T
}
