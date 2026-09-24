export type PatientStatus = 'active' | 'discharged' | 'on-hold'
export type ActivityStatus = 'active' | 'completed' | 'paused'
export type ActivityCategory = 'motor' | 'cognitivo' | 'sensorial' | 'coordinación'
export const UserRole = {
  SUPERADMIN: 'SUPERADMIN',
  ACCOUNT_ADMIN: 'ACCOUNT_ADMIN',
  THERAPIST: 'THERAPIST',
  PATIENT: 'PATIENT',
  GUARDIAN: 'GUARDIAN',
} as const

export type UserRole = (typeof UserRole)[keyof typeof UserRole]

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
