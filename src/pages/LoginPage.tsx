import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'

function capitalize(s: string): string {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : ''
}

export function LoginPage() {
  const { login } = useAuth()
  const { doctors } = useData()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (!email || !password) {
      setError('Por favor, ingresa tu correo y contraseña.')
      return
    }

    const normalized = email.trim().toLowerCase()
    const localPart = normalized.split('@')[0]

    // Admin access
    if (localPart === 'admin') {
      login({ email: normalized, role: 'admin', displayName: 'Administrador' })
      navigate('/admin/doctors')
      return
    }

    // Doctor access — match an existing record in Supabase by email
    const doctor = doctors.find((d) => d.email.toLowerCase() === normalized)
    if (doctor) {
      login({
        email: normalized,
        role: 'doctor',
        doctorId: doctor.id,
        displayName: `Dr. ${doctor.firstName} ${doctor.lastName}`.trim(),
      })
    } else {
      // El correo no corresponde a ningún médico registrado: sesión sin perfil editable.
      const parts = localPart.split('.')
      const displayName = `Dr. ${capitalize(parts[0] ?? 'Médico')} ${capitalize(parts[1] ?? '')}`.trim()
      login({ email: normalized, role: 'doctor', displayName })
    }
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 to-blue-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-blue-950 rounded-xl mx-auto mb-4 flex items-center justify-center">
            <span className="text-white text-lg font-bold">NH</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">NeuroHand Portal</h1>
          <p className="text-slate-500 text-sm mt-1">
            Portal de seguimiento de rehabilitación
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Correo electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="medico@hospital.es"
              className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-medium py-2.5 px-4 rounded-lg transition-colors mt-2"
          >
            Iniciar sesión
          </button>
        </form>

        {/* Demo credentials hint */}
        <div className="mt-6 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-xs text-slate-500 space-y-0.5">
          <p className="font-medium text-slate-600">Accesos de demostración:</p>
          <p>Médico: <span className="font-mono">javier.garcia@hospital.es</span></p>
          <p>Administrador: <span className="font-mono">admin@hospital.es</span></p>
          <p className="text-slate-400">(cualquier contraseña)</p>
        </div>
      </div>
    </div>
  )
}
