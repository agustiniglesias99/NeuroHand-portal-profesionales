import { useState, type FormEvent } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useData } from '../context/DataContext'
import { formatDate, formatShortDate } from '../utils/date'
import type { ActivityCategory, ActivityStatus } from '../types'

const STATUS_LABEL: Record<string, string> = {
  active: 'Activo',
  discharged: 'Alta médica',
  'on-hold': 'En espera',
}

const STATUS_STYLE: Record<string, string> = {
  active: 'bg-emerald-100 text-emerald-700',
  discharged: 'bg-slate-100 text-slate-600',
  'on-hold': 'bg-amber-100 text-amber-700',
}

const ACTIVITY_STATUS_LABEL: Record<ActivityStatus, string> = {
  active: 'Activa',
  completed: 'Completada',
  paused: 'Pausada',
}

const ACTIVITY_STATUS_STYLE: Record<ActivityStatus, string> = {
  active: 'bg-emerald-100 text-emerald-700',
  completed: 'bg-blue-100 text-blue-700',
  paused: 'bg-amber-100 text-amber-700',
}

const CATEGORY_STYLE: Record<ActivityCategory, string> = {
  motor: 'bg-violet-100 text-violet-700',
  cognitivo: 'bg-sky-100 text-sky-700',
  sensorial: 'bg-orange-100 text-orange-700',
  coordinación: 'bg-teal-100 text-teal-700',
}

const CATEGORIES: ActivityCategory[] = ['motor', 'cognitivo', 'sensorial', 'coordinación']

interface ActivityForm {
  name: string
  category: ActivityCategory
  description: string
  frequency: string
}

const EMPTY_FORM: ActivityForm = {
  name: '',
  category: 'motor',
  description: '',
  frequency: '',
}

export function PatientDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { patients, activities, addActivity } = useData()

  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState<ActivityForm>(EMPTY_FORM)
  const [formError, setFormError] = useState('')

  const patient = patients.find((p) => p.id === id)

  if (!patient) {
    return (
      <div className="p-6">
        <p className="text-slate-500">Paciente no encontrado.</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="mt-4 text-sm text-blue-700 hover:underline"
        >
          ← Volver al portal
        </button>
      </div>
    )
  }

  const patientActivities = activities.filter((a) => a.patientId === patient.id)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setFormError('')
    if (!form.name.trim() || !form.description.trim() || !form.frequency.trim()) {
      setFormError('Todos los campos son obligatorios.')
      return
    }
    if (!patient) return
    addActivity({
      name: form.name.trim(),
      category: form.category,
      description: form.description.trim(),
      frequency: form.frequency.trim(),
      patientId: patient.id,
      assignedDate: new Date().toISOString().split('T')[0],
      status: 'active',
    })
    setForm(EMPTY_FORM)
    setShowModal(false)
  }

  const infoFields = [
    { label: 'Edad', value: `${patient.age} años` },
    { label: 'DNI', value: patient.dni },
    { label: 'Teléfono', value: patient.phone },
    { label: 'Correo', value: patient.email },
    { label: 'Médico responsable', value: patient.doctor },
    { label: 'Fecha de ingreso', value: formatDate(patient.admissionDate) },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Back */}
      <button
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Volver al portal
      </button>

      {/* Patient header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-xl font-bold text-slate-900">{patient.name}</h1>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLE[patient.status]}`}>
                {STATUS_LABEL[patient.status]}
              </span>
            </div>
            <p className="text-slate-500 text-sm">{patient.diagnosis}</p>
          </div>
        </div>
      </div>

      {/* Info grid + Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal data */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="font-semibold text-slate-800 mb-4">Datos personales</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {infoFields.map(({ label, value }) => (
              <div key={label}>
                <p className="text-xs text-slate-400 font-medium mb-0.5">{label}</p>
                <p className="text-sm text-slate-800">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="font-semibold text-slate-800 mb-3">Notas clínicas</h2>
          <p className="text-sm text-slate-600 leading-relaxed">{patient.notes}</p>
        </div>
      </div>

      {/* Activities */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-4">
          <h2 className="font-semibold text-slate-800">
            Actividades asignadas
            <span className="ml-2 text-slate-400 font-normal text-sm">
              ({patientActivities.length})
            </span>
          </h2>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Asignar actividad
          </button>
        </div>

        {patientActivities.length === 0 ? (
          <p className="text-slate-400 text-sm text-center py-12">
            No hay actividades asignadas aún.
          </p>
        ) : (
          <div className="divide-y divide-slate-50">
            {patientActivities.map((activity) => {
              const completed = activity.sessions.filter((s) => s.completed).length
              return (
                <div key={activity.id} className="px-5 py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <p className="font-medium text-slate-900 text-sm">{activity.name}</p>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${CATEGORY_STYLE[activity.category]}`}>
                          {activity.category.charAt(0).toUpperCase() + activity.category.slice(1)}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${ACTIVITY_STATUS_STYLE[activity.status]}`}>
                          {ACTIVITY_STATUS_LABEL[activity.status]}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mb-1.5">{activity.description}</p>
                      <div className="flex items-center gap-4 text-xs text-slate-400">
                        <span>📅 {activity.frequency}</span>
                        <span>✓ {completed}/{activity.sessions.length} sesiones completadas</span>
                        <span>Asignada: {formatShortDate(activity.assignedDate)}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate(`/activities?patient=${patient.id}`)}
                      className="text-xs text-blue-600 hover:underline shrink-0"
                    >
                      Ver sesiones →
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Assign activity modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-semibold text-slate-900">Asignar nueva actividad</h2>
              <button
                onClick={() => { setShowModal(false); setForm(EMPTY_FORM); setFormError('') }}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Nombre de la actividad
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Ej: Ejercicios de extensión digital"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Categoría
                </label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value as ActivityCategory })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Descripción
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Descripción del ejercicio y objetivos terapéuticos..."
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Frecuencia
                </label>
                <input
                  type="text"
                  value={form.frequency}
                  onChange={(e) => setForm({ ...form, frequency: e.target.value })}
                  placeholder="Ej: 3 veces por semana"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {formError && (
                <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  {formError}
                </p>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); setForm(EMPTY_FORM); setFormError('') }}
                  className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors"
                >
                  Asignar actividad
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
