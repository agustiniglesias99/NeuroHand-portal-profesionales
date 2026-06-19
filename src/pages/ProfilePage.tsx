import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'

export function ProfilePage() {
  const { user, updateUser } = useAuth()
  const { doctors, updateDoctor } = useData()
  const navigate = useNavigate()

  const doctor = doctors.find((d) => d.id === user?.doctorId)

  const [firstName, setFirstName] = useState(doctor?.firstName ?? '')
  const [lastName, setLastName] = useState(doctor?.lastName ?? '')
  const [licenseNumber, setLicenseNumber] = useState(doctor?.licenseNumber ?? '')
  const [address, setAddress] = useState(doctor?.address ?? '')
  const [specialty, setSpecialty] = useState(doctor?.specialty ?? '')
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  if (!doctor) {
    return (
      <div className="p-6">
        <p className="text-slate-500 text-sm">
          No hay un perfil de médico asociado a esta sesión.
        </p>
        <button
          onClick={() => navigate('/dashboard')}
          className="mt-4 text-sm text-blue-700 hover:underline"
        >
          ← Volver al portal
        </button>
      </div>
    )
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setSaved(false)
    if (!firstName.trim() || !lastName.trim()) {
      setError('El nombre y el apellido son obligatorios.')
      return
    }
    setSaving(true)
    try {
      await updateDoctor(doctor!.id, {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        licenseNumber: licenseNumber.trim(),
        address: address.trim(),
        specialty: specialty.trim(),
      })
      updateUser({ displayName: `Dr. ${firstName.trim()} ${lastName.trim()}`.trim() })
      setSaved(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudieron guardar los cambios.')
    } finally {
      setSaving(false)
    }
  }

  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()

  return (
    <div className="p-6 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Mi perfil</h1>
        <p className="text-slate-500 text-sm mt-0.5">
          Gestiona tus datos profesionales
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-lg font-bold shrink-0">
            {initials || 'Dr'}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-slate-900">
              Dr. {firstName} {lastName}
            </p>
            <p className="text-sm text-slate-500 truncate">{doctor.email}</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Nombre</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => { setFirstName(e.target.value); setSaved(false) }}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Apellido</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => { setLastName(e.target.value); setSaved(false) }}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Nº de matrícula
              </label>
              <input
                type="text"
                value={licenseNumber}
                onChange={(e) => { setLicenseNumber(e.target.value); setSaved(false) }}
                placeholder="Ej: MN-12345"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Especialidad
              </label>
              <input
                type="text"
                value={specialty}
                onChange={(e) => { setSpecialty(e.target.value); setSaved(false) }}
                placeholder="Ej: Neurología"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Dirección</label>
            <input
              type="text"
              value={address}
              onChange={(e) => { setAddress(e.target.value); setSaved(false) }}
              placeholder="Calle, número, ciudad"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Correo electrónico
            </label>
            <input
              type="email"
              value={doctor.email}
              disabled
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-400 cursor-not-allowed"
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
          {saved && (
            <p className="text-emerald-700 text-sm bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
              ✓ Cambios guardados correctamente.
            </p>
          )}

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? 'Guardando…' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
