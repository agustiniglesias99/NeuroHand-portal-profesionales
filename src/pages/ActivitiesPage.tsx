import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useData } from '../context/DataContext'
import { formatShortDate } from '../utils/date'
import type { ActivityCategory, ActivityStatus } from '../types'

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

const STATUS_OPTIONS: { value: ActivityStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'active', label: 'Activas' },
  { value: 'paused', label: 'Pausadas' },
  { value: 'completed', label: 'Completadas' },
]

export function ActivitiesPage() {
  const { patients, activities } = useData()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const initialPatient = searchParams.get('patient') ?? 'all'
  const [patientFilter, setPatientFilter] = useState(initialPatient)
  const [statusFilter, setStatusFilter] = useState<ActivityStatus | 'all'>('all')
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  function toggleExpand(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const filtered = activities.filter((a) => {
    const matchesPatient = patientFilter === 'all' || a.patientId === patientFilter
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter
    return matchesPatient && matchesStatus
  })

  const totalSessions = filtered.flatMap((a) => a.sessions).length
  const completedSessions = filtered.flatMap((a) => a.sessions).filter((s) => s.completed).length

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Actividades y sesiones</h1>
        <p className="text-slate-500 text-sm mt-0.5">
          {filtered.length} actividad{filtered.length !== 1 ? 'es' : ''} · {completedSessions}/{totalSessions} sesiones completadas
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-wrap gap-4 items-end">
        {/* Patient filter */}
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Paciente</label>
          <select
            value={patientFilter}
            onChange={(e) => setPatientFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="all">Todos los pacientes</option>
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Status filter chips */}
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Estado</label>
          <div className="flex gap-2 flex-wrap">
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setStatusFilter(opt.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  statusFilter === opt.value
                    ? 'bg-blue-700 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Activity list */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <p className="text-slate-400 text-sm">No se encontraron actividades con los filtros actuales.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((activity) => {
            const patient = patients.find((p) => p.id === activity.patientId)
            const completed = activity.sessions.filter((s) => s.completed).length
            const isExpanded = expandedIds.has(activity.id)

            return (
              <div key={activity.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                {/* Activity header */}
                <button
                  onClick={() => toggleExpand(activity.id)}
                  className="w-full text-left px-5 py-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <p className="font-semibold text-slate-900 text-sm">{activity.name}</p>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${CATEGORY_STYLE[activity.category]}`}>
                          {activity.category.charAt(0).toUpperCase() + activity.category.slice(1)}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${ACTIVITY_STATUS_STYLE[activity.status]}`}>
                          {ACTIVITY_STATUS_LABEL[activity.status]}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mb-2">{activity.description}</p>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                        <button
                          onClick={(e) => { e.stopPropagation(); navigate(`/patients/${activity.patientId}`) }}
                          className="font-medium text-blue-600 hover:underline"
                        >
                          {patient?.name ?? 'Paciente desconocido'}
                        </button>
                        <span>📅 {activity.frequency}</span>
                        <span>Asignada: {formatShortDate(activity.assignedDate)}</span>
                        <span>
                          ✓ {completed}/{activity.sessions.length} sesiones
                        </span>
                      </div>
                    </div>

                    {/* Progress bar + chevron */}
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="hidden sm:block w-20">
                        <div className="flex justify-between text-xs text-slate-400 mb-1">
                          <span>{activity.sessions.length > 0 ? Math.round((completed / activity.sessions.length) * 100) : 0}%</span>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full transition-all"
                            style={{
                              width: activity.sessions.length > 0
                                ? `${(completed / activity.sessions.length) * 100}%`
                                : '0%',
                            }}
                          />
                        </div>
                      </div>
                      <svg
                        className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </button>

                {/* Sessions */}
                {isExpanded && (
                  <div className="border-t border-slate-100">
                    {activity.sessions.length === 0 ? (
                      <p className="text-slate-400 text-xs text-center py-6">
                        No hay sesiones registradas.
                      </p>
                    ) : (
                      <div className="divide-y divide-slate-50">
                        <div className="px-5 py-2 bg-slate-50 grid grid-cols-5 gap-2 text-xs font-medium text-slate-400 uppercase tracking-wide">
                          <span>Fecha</span>
                          <span>Duración</span>
                          <span>Terapeuta</span>
                          <span className="col-span-2">Notas</span>
                        </div>
                        {activity.sessions.map((session) => (
                          <div key={session.id} className="px-5 py-3 grid grid-cols-5 gap-2 items-start">
                            <div className="flex items-center gap-1.5">
                              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${session.completed ? 'bg-emerald-400' : 'bg-slate-300'}`} />
                              <span className="text-sm text-slate-800">{formatShortDate(session.date)}</span>
                            </div>
                            <span className="text-sm text-slate-600">{session.durationMinutes} min</span>
                            <span className="text-sm text-slate-600">{session.therapist}</span>
                            <span className="col-span-2 text-sm text-slate-600">{session.notes}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
