import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'
import { formatMonoDate, formatMonoDay } from '../utils/date'
import type { Patient, PatientStatus, NewsItem } from '../types'

const STATUS_LABEL: Record<PatientStatus, string> = {
  active: 'Activo',
  discharged: 'Alta',
  'on-hold': 'En espera',
}

const STATUS_BADGE: Record<PatientStatus, string> = {
  active: 'bg-ok-bg text-ok',
  discharged: 'bg-neutral-bg text-neutral',
  'on-hold': 'bg-warn-bg text-warn',
}

const NEWS_DOT: Record<NewsItem['type'], string> = {
  session: 'bg-brand-600',
  assignment: 'bg-ok',
  'status-change': 'bg-neutral',
  note: 'bg-warn',
}

type StatusFilter = PatientStatus | 'all'

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'active', label: 'Activos' },
  { value: 'on-hold', label: 'En espera' },
  { value: 'discharged', label: 'Alta' },
]

export function DashboardPage() {
  const { user } = useAuth()
  const { patients, activities, news } = useData()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')

  const activePatients = patients.filter((p) => p.status === 'active').length
  const onHoldPatients = patients.filter((p) => p.status === 'on-hold').length
  const activeActivities = activities.filter((a) => a.status === 'active').length
  const allSessions = activities.flatMap((a) => a.sessions)
  const completedSessions = allSessions.filter((s) => s.completed).length

  const filtered = patients.filter((p) => {
    const q = search.toLowerCase()
    const matchesSearch =
      p.name.toLowerCase().includes(q) || p.diagnosis.toLowerCase().includes(q)
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const today = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  function activityCount(patient: Patient): number {
    return activities.filter((a) => a.patientId === patient.id).length
  }

  function exportReport() {
    const rows = [
      ['Nombre', 'Estado', 'Diagnóstico', 'Ingreso', 'Actividades'],
      ...filtered.map((p) => [
        p.name,
        STATUS_LABEL[p.status],
        p.diagnosis,
        p.admissionDate,
        String(activityCount(p)),
      ]),
    ]
    const csv = rows
      .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(','))
      .join('\r\n')

    // BOM so Excel reads the accents correctly.
    const url = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = `neurohand-pacientes-${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="px-6 py-[34px] lg:px-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="m-0 font-meta text-[10.5px] tracking-[.12em] text-brand-600">
            PANEL GENERAL
          </p>
          <h1 className="m-0 mt-2.5 font-display text-[30px] font-normal tracking-[-.02em] lg:text-[38px]">
            Bienvenido, {user?.displayName}
          </h1>
          <p className="m-0 mt-1 text-[13.5px] capitalize text-ink-350">{today}</p>
        </div>
        <button
          onClick={exportReport}
          className="rounded-[9px] border border-line-400 bg-white px-5 py-[11px] text-[14px] font-medium text-brand-600 transition-colors hover:bg-paper-tint focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
        >
          Exportar informe
        </button>
      </div>

      <div className="mt-[26px] grid gap-px overflow-hidden rounded-[13px] border border-line-200 bg-line-200 sm:grid-cols-2 xl:grid-cols-4">
        <StatCell value={activePatients} of={patients.length} label="Pacientes activos" tone="brand" />
        <StatCell value={onHoldPatients} of={patients.length} label="En espera" tone="warn" />
        <StatCell value={activeActivities} of={activities.length} label="Actividades activas" tone="ok" />
        <StatCell
          value={completedSessions}
          of={allSessions.length}
          label="Sesiones completadas"
          tone="ink"
        />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.55fr_1fr]">
        <section className="overflow-hidden rounded-[13px] border border-line-200 bg-white">
          <div className="border-b border-line-100 px-[22px] pb-4 pt-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="m-0 text-[16px] font-semibold">Pacientes</h2>
              <span className="font-meta text-[10.5px] text-ink-200">
                {filtered.length} {filtered.length === 1 ? 'REGISTRO' : 'REGISTROS'}
              </span>
            </div>

            <label htmlFor="patient-search" className="sr-only">
              Buscar pacientes
            </label>
            <input
              id="patient-search"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre o diagnóstico…"
              className="mt-3.5 w-full rounded-[9px] border border-line-200 bg-paper-050 px-3.5 py-[11px] text-[14px] text-ink outline-none transition-colors placeholder:text-ink-200 focus:border-brand-600 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-600"
            />

            <div className="mt-3 flex flex-wrap gap-2">
              {STATUS_OPTIONS.map((opt) => {
                const on = statusFilter === opt.value
                return (
                  <button
                    key={opt.value}
                    onClick={() => setStatusFilter(opt.value)}
                    aria-pressed={on}
                    className={`rounded-full px-3.5 py-[7px] text-[13px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 ${
                      on
                        ? 'bg-brand-600 text-white'
                        : 'border border-line bg-paper-shell text-ink-400 hover:bg-paper-tint'
                    }`}
                  >
                    {opt.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="max-h-[404px] overflow-auto">
            {filtered.length === 0 ? (
              <p className="px-[22px] py-14 text-center text-[14px] text-ink-200">
                Ningún paciente coincide con la búsqueda.
              </p>
            ) : (
              filtered.map((patient) => {
                const count = activityCount(patient)
                return (
                  <button
                    key={patient.id}
                    onClick={() => navigate(`/patients/${patient.id}`)}
                    className="flex w-full items-center gap-4 border-b border-paper-200 px-[22px] py-4 text-left transition-colors hover:bg-paper-row focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-600"
                  >
                    <span
                      aria-hidden="true"
                      className="grid h-[38px] w-[38px] flex-none place-items-center rounded-[10px] bg-avatar text-[12.5px] font-semibold text-brand-600"
                    >
                      {initials(patient.name)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-2.5">
                        <span className="text-[15.5px] font-semibold text-ink">{patient.name}</span>
                        <span
                          className={`rounded-[5px] px-2 py-[3px] font-meta text-[10px] uppercase tracking-[.06em] ${STATUS_BADGE[patient.status]}`}
                        >
                          {STATUS_LABEL[patient.status]}
                        </span>
                      </span>
                      <span className="mt-[3px] block text-[13.5px] text-ink-400">
                        {patient.diagnosis}
                      </span>
                      <span className="mt-[5px] block font-meta text-[11px] text-ink-200">
                        INGRESO {formatMonoDate(patient.admissionDate)} · {count}{' '}
                        {count === 1 ? 'ACTIVIDAD' : 'ACTIVIDADES'}
                      </span>
                    </span>
                    <span aria-hidden="true" className="text-[17px] text-chevron">
                      ›
                    </span>
                  </button>
                )
              })
            )}
          </div>
        </section>

        <section className="flex flex-col overflow-hidden rounded-[13px] border border-line-200 bg-white">
          <div className="border-b border-line-100 px-[22px] pb-4 pt-5">
            <h2 className="m-0 text-[16px] font-semibold">Novedades recientes</h2>
          </div>
          <div className="max-h-[472px] overflow-auto">
            {news.map((item) => (
              <article key={item.id} className="border-b border-paper-200 px-[22px] py-4">
                <div className="flex items-center gap-2.5">
                  <span
                    aria-hidden="true"
                    className={`h-1.5 w-1.5 flex-none rounded-full ${NEWS_DOT[item.type]}`}
                  />
                  <button
                    onClick={() => navigate(`/patients/${item.patientId}`)}
                    className="rounded-sm text-[14px] font-semibold text-deep-800 transition-colors hover:text-brand-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
                  >
                    {item.patientName}
                  </button>
                  <span className="ml-auto font-meta text-[10.5px] text-meta-dim">
                    {formatMonoDay(item.date)}
                  </span>
                </div>
                <p className="m-0 mt-[7px] pl-4 text-[13.5px] leading-[1.55] text-ink-400">
                  {item.message}
                </p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

function initials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase()
}

const TONE: Record<string, string> = {
  brand: 'text-brand-600',
  warn: 'text-warn',
  ok: 'text-ok',
  ink: 'text-ink',
}

function StatCell({
  value,
  of,
  label,
  tone,
}: {
  value: number
  of: number
  label: string
  tone: keyof typeof TONE
}) {
  return (
    <div className="bg-white px-[22px] pb-[22px] pt-5">
      <div className="flex items-baseline gap-[9px]">
        <span className={`font-display text-[38px] leading-none ${TONE[tone]}`}>{value}</span>
        <span className={`font-meta text-[10.5px] ${TONE[tone]}`}>DE {of}</span>
      </div>
      <p className="m-0 mt-2.5 text-[13.5px] text-ink-400">{label}</p>
    </div>
  )
}
