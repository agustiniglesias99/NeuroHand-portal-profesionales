import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'
import { formatRelative, formatDate } from '../utils/date'
import type { PatientStatus, NewsItem } from '../types'

const STATUS_LABEL: Record<PatientStatus, string> = {
  active: 'Activo',
  discharged: 'Alta',
  'on-hold': 'En espera',
}

const STATUS_STYLE: Record<PatientStatus, string> = {
  active: 'bg-emerald-100 text-emerald-700',
  discharged: 'bg-slate-100 text-slate-600',
  'on-hold': 'bg-amber-100 text-amber-700',
}

const NEWS_ICON: Record<NewsItem['type'], string> = {
  session: '🗂',
  assignment: '➕',
  'status-change': '🔄',
  note: '📝',
}

const NEWS_STYLE: Record<NewsItem['type'], string> = {
  session: 'bg-blue-50 border-blue-200 text-blue-700',
  assignment: 'bg-emerald-50 border-emerald-200 text-emerald-700',
  'status-change': 'bg-amber-50 border-amber-200 text-amber-700',
  note: 'bg-slate-50 border-slate-200 text-slate-600',
}

type StatusFilter = PatientStatus | 'all'

export function DashboardPage() {
  const { user } = useAuth()
  const { patients, activities, news } = useData()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')

  const activePatients = patients.filter((p) => p.status === 'active').length
  const onHoldPatients = patients.filter((p) => p.status === 'on-hold').length
  const activeActivities = activities.filter((a) => a.status === 'active').length
  const completedSessions = activities.flatMap((a) => a.sessions).filter((s) => s.completed).length

  const filtered = patients.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.diagnosis.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const statusOptions: { value: StatusFilter; label: string }[] = [
    { value: 'all', label: 'Todos' },
    { value: 'active', label: 'Activos' },
    { value: 'on-hold', label: 'En espera' },
    { value: 'discharged', label: 'Alta' },
  ]

  const today = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Bienvenido, {user?.displayName}
        </h1>
        <p className="text-slate-500 text-sm capitalize mt-0.5">{today}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Pacientes activos" value={activePatients} color="blue" />
        <StatCard label="En espera" value={onHoldPatients} color="amber" />
        <StatCard label="Actividades activas" value={activeActivities} color="emerald" />
        <StatCard label="Sesiones completadas" value={completedSessions} color="slate" />
      </div>

      {/* Patients + News */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Patient list */}
        <div className="xl:col-span-3 bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-800 mb-3">Pacientes</h2>

            {/* Search */}
            <input
              type="text"
              placeholder="Buscar por nombre o diagnóstico..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3"
            />

            {/* Status filter chips */}
            <div className="flex gap-2 flex-wrap">
              {statusOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setStatusFilter(opt.value)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
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

          <div className="divide-y divide-slate-50">
            {filtered.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-10">
                No se encontraron pacientes.
              </p>
            ) : (
              filtered.map((patient) => {
                const patientActivities = activities.filter((a) => a.patientId === patient.id)
                return (
                  <button
                    key={patient.id}
                    onClick={() => navigate(`/patients/${patient.id}`)}
                    className="w-full text-left px-4 py-3.5 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="font-medium text-slate-900 text-sm truncate">
                            {patient.name}
                          </p>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ${STATUS_STYLE[patient.status]}`}>
                            {STATUS_LABEL[patient.status]}
                          </span>
                        </div>
                        <p className="text-slate-500 text-xs truncate">{patient.diagnosis}</p>
                        <p className="text-slate-400 text-xs mt-1">
                          Ingreso: {formatDate(patient.admissionDate)} · {patientActivities.length} actividad{patientActivities.length !== 1 ? 'es' : ''}
                        </p>
                      </div>
                      <svg className="w-4 h-4 text-slate-400 shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </div>

        {/* News feed */}
        <div className="xl:col-span-2 bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-800">Novedades recientes</h2>
          </div>
          <div className="divide-y divide-slate-50 overflow-y-auto max-h-[520px]">
            {news.map((item) => (
              <div key={item.id} className="px-4 py-3.5">
                <div className="flex items-start gap-2.5">
                  <span className={`text-base px-1.5 py-0.5 rounded border text-xs shrink-0 mt-0.5 ${NEWS_STYLE[item.type]}`}>
                    {NEWS_ICON[item.type]}
                  </span>
                  <div className="min-w-0">
                    <button
                      onClick={() => navigate(`/patients/${item.patientId}`)}
                      className="text-xs font-semibold text-blue-700 hover:underline"
                    >
                      {item.patientName}
                    </button>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{item.message}</p>
                    <p className="text-xs text-slate-400 mt-1">{formatRelative(item.date)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string
  value: number
  color: 'blue' | 'amber' | 'emerald' | 'slate'
}) {
  const styles = {
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    amber: 'bg-amber-50 border-amber-200 text-amber-700',
    emerald: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    slate: 'bg-slate-50 border-slate-200 text-slate-600',
  }

  return (
    <div className={`rounded-xl border p-4 ${styles[color]}`}>
      <p className="text-3xl font-bold">{value}</p>
      <p className="text-xs font-medium mt-1 opacity-80">{label}</p>
    </div>
  )
}
