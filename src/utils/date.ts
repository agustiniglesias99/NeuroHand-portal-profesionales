export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

export function formatShortDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

/** "14 ENE 2026" — for the portal's monospace metadata lines. */
export function formatMonoDate(iso: string): string {
  return new Date(iso)
    .toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
    .replace(/\./g, '')
    .toUpperCase()
}

/** "11 JUN" — same, without the year. */
export function formatMonoDay(iso: string): string {
  return new Date(iso)
    .toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })
    .replace(/\./g, '')
    .toUpperCase()
}

export function formatRelative(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime()
  const diffH = Math.floor(diffMs / (1000 * 60 * 60))
  if (diffH < 1) return 'Hace menos de 1h'
  if (diffH < 24) return `Hace ${diffH}h`
  const diffD = Math.floor(diffH / 24)
  if (diffD === 1) return 'Ayer'
  if (diffD < 7) return `Hace ${diffD} días`
  return formatShortDate(iso)
}
