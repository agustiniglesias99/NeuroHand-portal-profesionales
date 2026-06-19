import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

/** True cuando las variables de entorno de Supabase están presentes y son válidas. */
export const isSupabaseConfigured = Boolean(
  supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('http'),
)

/** Cliente de Supabase, o null si el proyecto aún no está configurado (modo mock). */
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl as string, supabaseAnonKey as string)
  : null

/** Nombre de la tabla de médicos en Supabase. */
export const DOCTORS_TABLE = 'medico'
