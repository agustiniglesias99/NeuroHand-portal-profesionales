import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { MOCK_PATIENTS, MOCK_ACTIVITIES, MOCK_NEWS, MOCK_DOCTORS } from '../data/mock'
import { isSupabaseConfigured } from '../lib/supabase'
import {
  fetchDoctors,
  insertDoctor,
  updateDoctorRow,
  deleteDoctorRow,
} from '../lib/doctors'
import type { Patient, Activity, Session, NewsItem, Doctor } from '../types'

interface DataContextType {
  patients: Patient[]
  activities: Activity[]
  news: NewsItem[]
  doctors: Doctor[]
  doctorsLoading: boolean
  doctorsError: string | null
  refreshDoctors: () => Promise<void>
  addActivity: (activity: Omit<Activity, 'id' | 'sessions'>) => void
  addSession: (activityId: string, session: Omit<Session, 'id'>) => void
  addDoctor: (doctor: Omit<Doctor, 'id'>) => Promise<void>
  updateDoctor: (id: string, partial: Partial<Omit<Doctor, 'id'>>) => Promise<void>
  removeDoctor: (id: string) => Promise<void>
}

const DataContext = createContext<DataContextType | null>(null)

export function DataProvider({ children }: { children: ReactNode }) {
  const [patients] = useState<Patient[]>(MOCK_PATIENTS)
  const [activities, setActivities] = useState<Activity[]>(MOCK_ACTIVITIES)
  const [news, setNews] = useState<NewsItem[]>(MOCK_NEWS)

  // Sin credenciales de Supabase: usar datos de ejemplo para que el portal siga funcionando.
  const [doctors, setDoctors] = useState<Doctor[]>(() =>
    isSupabaseConfigured ? [] : MOCK_DOCTORS,
  )
  const [doctorsLoading, setDoctorsLoading] = useState<boolean>(isSupabaseConfigured)
  const [doctorsError, setDoctorsError] = useState<string | null>(null)

  async function refreshDoctors() {
    if (!isSupabaseConfigured) {
      setDoctors(MOCK_DOCTORS)
      return
    }
    setDoctorsLoading(true)
    try {
      const rows = await fetchDoctors()
      setDoctors(rows)
      setDoctorsError(null)
    } catch (err) {
      setDoctorsError(err instanceof Error ? err.message : 'Error al cargar los médicos.')
    } finally {
      setDoctorsLoading(false)
    }
  }

  // Carga inicial desde Supabase (si está configurado).
  useEffect(() => {
    if (!isSupabaseConfigured) return
    let active = true
    void (async () => {
      try {
        const rows = await fetchDoctors()
        if (active) {
          setDoctors(rows)
          setDoctorsError(null)
        }
      } catch (err) {
        if (active) {
          setDoctorsError(err instanceof Error ? err.message : 'Error al cargar los médicos.')
        }
      } finally {
        if (active) setDoctorsLoading(false)
      }
    })()
    return () => {
      active = false
    }
  }, [])

  function addActivity(data: Omit<Activity, 'id' | 'sessions'>) {
    const newActivity: Activity = { ...data, id: `a${Date.now()}`, sessions: [] }
    setActivities((prev) => [...prev, newActivity])

    const patient = patients.find((p) => p.id === data.patientId)
    const newsItem: NewsItem = {
      id: `n${Date.now()}`,
      type: 'assignment',
      patientId: data.patientId,
      patientName: patient?.name ?? '',
      message: `Nueva actividad asignada: ${data.name}.`,
      date: new Date().toISOString(),
    }
    setNews((prev) => [newsItem, ...prev])
  }

  function addSession(activityId: string, session: Omit<Session, 'id'>) {
    setActivities((prev) =>
      prev.map((a) =>
        a.id === activityId
          ? { ...a, sessions: [...a.sessions, { ...session, id: `s${Date.now()}` }] }
          : a,
      ),
    )
  }

  async function addDoctor(data: Omit<Doctor, 'id'>) {
    const created = await insertDoctor(data)
    setDoctors((prev) => [...prev, created])
  }

  async function updateDoctor(id: string, partial: Partial<Omit<Doctor, 'id'>>) {
    await updateDoctorRow(id, partial)
    setDoctors((prev) => prev.map((d) => (d.id === id ? { ...d, ...partial } : d)))
  }

  async function removeDoctor(id: string) {
    await deleteDoctorRow(id)
    setDoctors((prev) => prev.filter((d) => d.id !== id))
  }

  return (
    <DataContext.Provider
      value={{
        patients,
        activities,
        news,
        doctors,
        doctorsLoading,
        doctorsError,
        refreshDoctors,
        addActivity,
        addSession,
        addDoctor,
        updateDoctor,
        removeDoctor,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used within DataProvider')
  return ctx
}
