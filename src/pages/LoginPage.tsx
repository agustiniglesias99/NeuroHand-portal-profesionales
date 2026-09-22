import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'
import { UserRole } from '../types'

function capitalize(s: string): string {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : ''
}

const FIELD =
  'w-full rounded-[9px] border border-line-300 bg-white px-[15px] py-[13px] text-[15px] text-ink outline-none transition-colors placeholder:text-ink-200 focus:border-brand-600 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-600'

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
      setError('Ingresá tu correo y contraseña para continuar.')
      return
    }

    const normalized = email.trim().toLowerCase()
    const localPart = normalized.split('@')[0]

    // Admin access
    if (localPart === 'admin') {
      login({
        email: normalized,
        role: UserRole.ACCOUNT_ADMIN,
        displayName: 'Administrador',
      })
      navigate('/admin/doctors')
      return
    }

    // Doctor access — match an existing record in Supabase by email
    const doctor = doctors.find((d) => d.email.toLowerCase() === normalized)
    if (doctor) {
      login({
        email: normalized,
        role: UserRole.THERAPIST,
        doctorId: doctor.id,
        displayName: `Dr. ${doctor.firstName} ${doctor.lastName}`.trim(),
      })
    } else {
      // El correo no corresponde a ningún médico registrado: sesión sin perfil editable.
      const parts = localPart.split('.')
      const displayName = `Dr. ${capitalize(parts[0] ?? 'Médico')} ${capitalize(parts[1] ?? '')}`.trim()
      login({ email: normalized, role: UserRole.THERAPIST, displayName })
    }
    navigate('/dashboard')
  }

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden bg-deep-800 bg-[radial-gradient(110%_90%_at_80%_10%,#05787d_0%,#00575b_36%,#00393c_70%,#002a2d_100%)] px-6 py-16 font-body">
      <div className="nh-grid-login absolute inset-0 opacity-[.14]" aria-hidden="true" />

      <div className="relative grid w-full max-w-[1080px] items-center gap-14 lg:grid-cols-[1fr_452px] lg:gap-20">
        <div className="text-white">
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="grid h-[34px] w-[34px] place-items-center rounded-[9px] bg-brand-600 text-[12px] font-semibold"
            >
              K
            </span>
            <span className="font-display text-[21px]">KINESIS</span>
          </div>

          <h1 className="mt-[34px] font-display text-[38px] font-normal leading-[1.08] tracking-[-.025em] lg:text-[52px]">
            Portal de seguimiento de rehabilitación
          </h1>
          <p className="mt-5 max-w-[400px] text-[16px] leading-[1.65] text-on-deep">
            Acceso exclusivo para profesionales. Gestioná pacientes, actividades y métricas de
            evolución.
          </p>
          <p className="mt-11 border-t border-mint-200/20 pt-6 font-meta text-[11px] tracking-[.08em] text-[#7fadad]">
            SESIÓN CIFRADA · DATOS CLÍNICOS PROTEGIDOS
          </p>
        </div>

        <div className="rounded-2xl bg-paper px-6 py-8 text-ink shadow-[0_28px_60px_rgba(0,25,27,.4)] sm:px-9 sm:py-[38px]">
          <p className="font-meta text-[10.5px] tracking-[.12em] text-brand-600">INICIAR SESIÓN</p>
          <h2 className="mt-3 font-display text-[30px] font-normal tracking-[-.02em]">
            KINESIS Portal
          </h2>

          <form onSubmit={handleSubmit} noValidate>
            <label htmlFor="email" className="mt-7 block text-[13px] font-medium text-ink-500">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="medico@hospital.es"
              className={`mt-2 ${FIELD}`}
            />

            <label htmlFor="password" className="mt-[18px] block text-[13px] font-medium text-ink-500">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={`mt-2 ${FIELD}`}
            />

            {error && (
              <p
                role="alert"
                className="mt-4 rounded-[9px] border border-danger/25 bg-danger-bg px-[15px] py-3 text-[13.5px] text-danger"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              className="mt-[26px] w-full rounded-[9px] bg-brand-600 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
            >
              Iniciar sesión
            </button>
          </form>

          <div className="mt-[22px] rounded-[10px] border border-line-200 bg-paper-tint px-[18px] py-4">
            <p className="m-0 text-[12.5px] font-semibold text-deep-800">Accesos de demostración</p>
            <div className="mt-2.5 grid gap-[5px] font-meta text-[11.5px] text-ink-400">
              <span>Médico · javier.garcia@hospital.es</span>
              <span>Administrador · admin@hospital.es</span>
              <span className="text-ink-200">(cualquier contraseña)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
