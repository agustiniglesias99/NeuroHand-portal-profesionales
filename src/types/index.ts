export type PatientStatus = 'active' | 'discharged' | 'on-hold'
export type ActivityStatus = 'active' | 'completed' | 'paused'
export type ActivityCategory = 'motor' | 'cognitivo' | 'sensorial' | 'coordinación'
export type UserRole = 'doctor' | 'admin'

export interface Session {
  id: string
  date: string
  durationMinutes: number
  notes: string
  completed: boolean
  therapist: string
}

export interface Activity {
  id: string
  name: string
  description: string
  category: ActivityCategory
  patientId: string
  assignedDate: string
  status: ActivityStatus
  frequency: string
  sessions: Session[]
}

export interface Patient {
  id: string
  name: string
  age: number
  dni: string
  phone: string
  email: string
  diagnosis: string
  admissionDate: string
  status: PatientStatus
  doctor: string
  notes: string
}

export interface NewsItem {
  id: string
  type: 'session' | 'assignment' | 'status-change' | 'note'
  patientId: string
  patientName: string
  message: string
  date: string
}

export interface Doctor {
  id: string
  firstName: string
  lastName: string
  licenseNumber: string
  address: string
  email: string
  specialty: string
}
