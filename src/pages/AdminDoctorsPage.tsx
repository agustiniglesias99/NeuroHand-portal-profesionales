import { useState, type FormEvent } from 'react'
import { useData } from '../context/DataContext'
import type { Doctor } from '../types'

interface DoctorForm {
  firstName: string
  lastName: string
  licenseNumber: string
  address: string
  email: string
  specialty: string
}

const EMPTY_FORM: DoctorForm = {
  firstName: '',
  lastName: '',
  licenseNumber: '',
  address: '',
  email: '',
  specialty: '',
}

const FIELD =
  'w-full rounded-[9px] border border-line-300 bg-white px-[15px] py-[11px] text-[14.5px] text-ink outline-none transition-colors placeholder:text-ink-200 focus:border-brand-600 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-600'

const LABEL = 'mb-1.5 block text-[13px] font-medium text-ink-500'

export function AdminDoctorsPage() {
  const {
    doctors,
    patients,
    doctorsLoading,
    doctorsError,
    addDoctor,
    updateDoctor,
    removeDoctor,
  } = useData()

  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<DoctorForm>(EMPTY_FORM)
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [actionError, setActionError] = useState('')
  const [search, setSearch] = useState('')

  function openAdd() {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setFormError('')
    setShowModal(true)
  }

  function openEdit(doctor: Doctor) {
    setEditingId(doctor.id)
    setForm({
      firstName: doctor.firstName,
      lastName: doctor.lastName,
      licenseNumber: doctor.licenseNumber,
      address: doctor.address,
      email: doctor.email,
      specialty: doctor.specialty,
    })
    setFormError('')
    setShowModal(true)
  }

  function closeModal() {
    setShowModal(false)
    setEditingId(null)
    setForm(EMPTY_FORM)
    setFormError('')
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setFormError('')
    if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim()) {
      setFormError('Nombre, apellido y correo son obligatorios.')
      return
    }
    const payload = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      licenseNumber: form.licenseNumber.trim(),
      address: form.address.trim(),
      email: form.email.trim(),
      specialty: form.specialty.trim(),
    }
    setSubmitting(true)
    try {
      if (editingId) await updateDoctor(editingId, payload)
      else await addDoctor(payload)
      closeModal()
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'No se pudo guardar el médico.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id: string) {
    try {
      await removeDoctor(id)
      setDeletingId(null)
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'No se pudo eliminar el médico.')
      setDeletingId(null)
    }
  }

  function patientCount(doctor: Doctor): number {
    return patients.filter((p) => p.doctor === `Dr. ${doctor.lastName}`).length
  }

  const filtered = doctors.filter((d) => {
    const q = search.toLowerCase()
    return (
      `${d.firstName} ${d.lastName}`.toLowerCase().includes(q) ||
      d.licenseNumber.toLowerCase().includes(q) ||
      d.specialty.toLowerCase().includes(q) ||
      d.email.toLowerCase().includes(q)
    )
  })

  return (
    <div className="px-6 py-[34px] lg:px-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="m-0 font-meta text-[10.5px] tracking-[.12em] text-brand-600">
            EQUIPO PROFESIONAL
          </p>
          <h1 className="m-0 mt-2.5 font-display text-[30px] font-normal tracking-[-.02em] lg:text-[38px]">
            Gestión de médicos
          </h1>
          <p className="m-0 mt-1 text-[13.5px] text-ink-350">
            {doctors.length} médico{doctors.length !== 1 ? 's' : ''} registrado
            {doctors.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 rounded-[9px] bg-brand-600 px-[22px] py-3 text-[14px] font-semibold text-white transition-colors hover:bg-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" d="M12 5v14M5 12h14" />
          </svg>
          Añadir médico
        </button>
      </div>

      <label htmlFor="doctor-search" className="sr-only">
        Buscar médicos
      </label>
      <input
        id="doctor-search"
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Buscar por nombre, matrícula, especialidad o correo…"
        className="mt-6 w-full max-w-[520px] rounded-[9px] border border-line-200 bg-white px-[15px] py-3 text-[14px] text-ink outline-none transition-colors placeholder:text-ink-200 focus:border-brand-600 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-600"
      />

      {doctorsError && (
        <p
          role="alert"
          className="mt-5 rounded-[10px] border border-danger/25 bg-danger-bg px-[18px] py-3.5 text-[13.5px] text-danger"
        >
          Error al cargar médicos desde Supabase: {doctorsError}
        </p>
      )}
      {actionError && (
        <p
          role="alert"
          className="mt-5 rounded-[10px] border border-danger/25 bg-danger-bg px-[18px] py-3.5 text-[13.5px] text-danger"
        >
          {actionError}
        </p>
      )}

      {doctorsLoading ? (
        <p className="mt-5 rounded-[13px] border border-line-200 bg-white py-16 text-center text-[14px] text-ink-200">
          Cargando médicos…
        </p>
      ) : filtered.length === 0 ? (
        <p className="mt-5 rounded-[13px] border border-line-200 bg-white py-16 text-center text-[14px] text-ink-200">
          Ningún médico coincide con la búsqueda.
        </p>
      ) : (
        <div className="mt-5 grid gap-[18px] md:grid-cols-2 2xl:grid-cols-3">
          {filtered.map((doctor) => {
            const count = patientCount(doctor)
            return (
              <article
                key={doctor.id}
                className="overflow-hidden rounded-[13px] border border-line-200 bg-white transition-colors hover:border-line-500"
              >
                <div className="px-[22px] pb-[18px] pt-[22px]">
                  <div className="flex items-center gap-3.5">
                    <span
                      aria-hidden="true"
                      className="grid h-[46px] w-[46px] flex-none place-items-center rounded-xl bg-brand-600 text-[14px] font-semibold text-white"
                    >
                      {`${doctor.firstName.charAt(0)}${doctor.lastName.charAt(0)}`.toUpperCase()}
                    </span>
                    <div className="min-w-0">
                      <h2 className="m-0 truncate text-[16px] font-semibold text-ink">
                        Dr. {doctor.firstName} {doctor.lastName}
                      </h2>
                      <p className="m-0 mt-0.5 text-[13px] text-ink-350">
                        {doctor.specialty || 'Sin especialidad'}
                      </p>
                    </div>
                  </div>

                  <dl className="m-0 mt-5 grid gap-[9px]">
                    <DetailRow label="MATRÍCULA" value={doctor.licenseNumber || '—'} />
                    <DetailRow label="SEDE" value={doctor.address || '—'} />
                    <DetailRow label="CORREO" value={doctor.email} />
                  </dl>

                  <div className="mt-[18px] flex items-center justify-between gap-3 rounded-[9px] bg-paper-tint px-3.5 py-[11px]">
                    <span className="text-[13px] text-ink-400">Pacientes asignados</span>
                    <span className="font-display text-[20px] text-brand-600">{count}</span>
                  </div>
                </div>

                <div className="flex border-t border-line-100">
                  {deletingId === doctor.id ? (
                    <>
                      <button
                        onClick={() => setDeletingId(null)}
                        className="flex-1 border-r border-line-100 py-3 text-[13.5px] font-medium text-ink-400 transition-colors hover:bg-paper-tint focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-600"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={() => handleDelete(doctor.id)}
                        className="flex-1 bg-danger-bg py-3 text-[13.5px] font-semibold text-danger transition-colors hover:bg-danger hover:text-white focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-danger"
                      >
                        Confirmar baja
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => openEdit(doctor)}
                        className="flex-1 border-r border-line-100 py-3 text-[13.5px] font-medium text-brand-600 transition-colors hover:bg-paper-tint focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-600"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => setDeletingId(doctor.id)}
                        className="flex-1 py-3 text-[13.5px] font-medium text-danger transition-colors hover:bg-danger-bg focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-danger"
                      >
                        Eliminar
                      </button>
                    </>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-deep-900/50 p-4 backdrop-blur-[2px]">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="doctor-modal-title"
            className="max-h-[90vh] w-full max-w-[560px] overflow-y-auto rounded-2xl bg-paper shadow-[0_28px_60px_rgba(0,25,27,.4)]"
          >
            <div className="sticky top-0 flex items-center justify-between gap-4 border-b border-line-100 bg-paper px-6 py-5">
              <div>
                <p className="m-0 font-meta text-[10.5px] tracking-[.12em] text-brand-600">
                  {editingId ? 'EDITAR REGISTRO' : 'NUEVO REGISTRO'}
                </p>
                <h2
                  id="doctor-modal-title"
                  className="m-0 mt-1.5 font-display text-[24px] font-normal tracking-[-.02em]"
                >
                  {editingId ? 'Editar médico' : 'Añadir médico'}
                </h2>
              </div>
              <button
                onClick={closeModal}
                aria-label="Cerrar"
                className="rounded-md p-1 text-ink-200 transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
                  <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="firstName" className={LABEL}>
                    Nombre
                  </label>
                  <input
                    id="firstName"
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    className={FIELD}
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className={LABEL}>
                    Apellido
                  </label>
                  <input
                    id="lastName"
                    value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    className={FIELD}
                  />
                </div>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="licenseNumber" className={LABEL}>
                    Nº de matrícula
                  </label>
                  <input
                    id="licenseNumber"
                    value={form.licenseNumber}
                    onChange={(e) => setForm({ ...form, licenseNumber: e.target.value })}
                    placeholder="Ej: MN-12345"
                    className={FIELD}
                  />
                </div>
                <div>
                  <label htmlFor="specialty" className={LABEL}>
                    Especialidad
                  </label>
                  <input
                    id="specialty"
                    value={form.specialty}
                    onChange={(e) => setForm({ ...form, specialty: e.target.value })}
                    placeholder="Ej: Neurología"
                    className={FIELD}
                  />
                </div>
              </div>

              <div className="mt-4">
                <label htmlFor="address" className={LABEL}>
                  Sede
                </label>
                <input
                  id="address"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="Calle, número, ciudad"
                  className={FIELD}
                />
              </div>

              <div className="mt-4">
                <label htmlFor="doctorEmail" className={LABEL}>
                  Correo electrónico
                </label>
                <input
                  id="doctorEmail"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="medico@hospital.es"
                  className={FIELD}
                />
              </div>

              {formError && (
                <p
                  role="alert"
                  className="mt-4 rounded-[9px] border border-danger/25 bg-danger-bg px-[15px] py-3 text-[13.5px] text-danger"
                >
                  {formError}
                </p>
              )}

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-[9px] border border-line-300 px-5 py-3 text-[14px] font-medium text-ink-500 transition-colors hover:bg-paper-tint focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-[9px] bg-brand-600 px-5 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? 'Guardando…' : editingId ? 'Guardar cambios' : 'Añadir médico'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3 text-[13.5px]">
      <dt className="w-16 flex-none pt-0.5 font-meta text-[10.5px] text-ink-200">{label}</dt>
      <dd className="m-0 min-w-0 break-words text-ink-600">{value}</dd>
    </div>
  )
}
