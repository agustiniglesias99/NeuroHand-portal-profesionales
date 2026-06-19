import { supabase, DOCTORS_TABLE } from './supabase'
import type { Doctor } from '../types'

/** Forma de una fila tal como existe en la tabla `medicos` de Supabase. */
interface DoctorRow {
  id: string | number
  matricula: string | null
  nombre: string | null
  apellido: string | null
  email: string | null
}

function client() {
  if (!supabase) {
    throw new Error('Supabase no está configurado. Revisa las variables VITE_SUPABASE_* en .env')
  }
  return supabase
}

/** Mapea una fila de la BD al modelo `Doctor` del portal. */
function rowToDoctor(row: DoctorRow): Doctor {
  return {
    id: String(row.id),
    licenseNumber: row.matricula ?? '',
    firstName: row.nombre ?? '',
    lastName: row.apellido ?? '',
    email: row.email ?? '',
    // Columnas que aún no existen en la tabla; se mantienen vacías por ahora.
    address: '',
    specialty: '',
  }
}

/** Mapea los campos del modelo a columnas de la BD (solo las que existen hoy). */
function doctorToRow(d: Partial<Doctor>): Partial<DoctorRow> {
  const row: Partial<DoctorRow> = {}
  if (d.licenseNumber !== undefined) row.matricula = d.licenseNumber
  if (d.firstName !== undefined) row.nombre = d.firstName
  if (d.lastName !== undefined) row.apellido = d.lastName
  if (d.email !== undefined) row.email = d.email
  return row
}

/** GET — obtiene todos los médicos. */
export async function fetchDoctors(): Promise<Doctor[]> {
  const { data, error } = await client()
    .from(DOCTORS_TABLE)
    .select('*')
    .order('apellido', { ascending: true })
  if (error) throw error
  return (data as DoctorRow[]).map(rowToDoctor)
}

/** POST — inserta un nuevo médico y devuelve el registro creado (con su id). */
export async function insertDoctor(doctor: Omit<Doctor, 'id'>): Promise<Doctor> {
  const { data, error } = await client()
    .from(DOCTORS_TABLE)
    .insert(doctorToRow(doctor))
    .select()
    .single()
  if (error) throw error
  return rowToDoctor(data as DoctorRow)
}

/** PATCH — actualiza un médico existente. */
export async function updateDoctorRow(id: string, partial: Partial<Doctor>): Promise<void> {
  const { data, error } = await client()
    .from(DOCTORS_TABLE)
    .update(doctorToRow(partial))
    .eq('id', id)
    .select()
  if (error) throw error
  if (!data || data.length === 0) {
    throw new Error(
      'No se actualizó ningún registro. Revisá las políticas RLS de UPDATE en Supabase (o que el id exista).',
    )
  }
}

/** DELETE — elimina un médico. */
export async function deleteDoctorRow(id: string): Promise<void> {
  const { data, error } = await client()
    .from(DOCTORS_TABLE)
    .delete()
    .eq('id', id)
    .select()
  if (error) throw error
  if (!data || data.length === 0) {
    throw new Error(
      'No se eliminó ningún registro. Revisá las políticas RLS de DELETE en Supabase (o que el id exista).',
    )
  }
}
