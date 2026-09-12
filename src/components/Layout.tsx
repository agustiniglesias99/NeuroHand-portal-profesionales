import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const DOCTOR_NAV = [
  { to: '/dashboard', label: 'Inicio' },
  { to: '/activities', label: 'Actividades y sesiones' },
  { to: '/profile', label: 'Mi perfil' },
]

const ADMIN_NAV = [
  { to: '/dashboard', label: 'Pacientes' },
  { to: '/admin/doctors', label: 'Médicos' },
]

export function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const navItems = user?.role === 'admin' ? ADMIN_NAV : DOCTOR_NAV
  const roleLabel = user?.role === 'admin' ? 'Administrador' : 'Médico'

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div className="flex h-screen overflow-hidden bg-paper-shell font-body text-ink">
      <aside className="flex w-[252px] flex-none flex-col bg-deep-800 bg-[linear-gradient(180deg,#00464a_0%,#002a2d_100%)] text-on-deep">
        <div className="flex items-center gap-3 border-b border-mint-200/[.16] px-[22px] py-6">
          <span
            aria-hidden="true"
            className="grid h-[34px] w-[34px] flex-none place-items-center rounded-[9px] bg-brand-600 text-[12px] font-semibold text-white"
          >
            K
          </span>
          <div className="min-w-0">
            <p className="m-0 font-display text-[17px] leading-[1.15] text-white">KINESIS</p>
            <p className="m-0 mt-0.5 font-meta text-[10px] tracking-[.1em] text-[#7fadad]">
              PORTAL MÉDICO
            </p>
          </div>
        </div>

        <nav className="grid content-start gap-[3px] overflow-y-auto px-3.5 py-4">
          {navItems.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/dashboard'}
              className={({ isActive }) =>
                `flex items-center gap-[11px] rounded-[9px] px-3.5 py-[11px] text-[14.5px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint-300 ${
                  isActive
                    ? 'bg-brand-600 font-medium text-white'
                    : 'text-nav-idle hover:bg-white/[.06] hover:text-white'
                }`
              }
            >
              <span
                aria-hidden="true"
                className="h-[5px] w-[5px] flex-none rounded-full bg-current opacity-70"
              />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto border-t border-mint-200/[.16] p-[22px]">
          <p className="m-0 font-meta text-[10px] tracking-[.1em] text-[#7fadad]">
            {roleLabel.toUpperCase()}
          </p>
          <p className="m-0 mt-[5px] truncate text-[15px] text-white">{user?.displayName}</p>
          <button
            onClick={handleLogout}
            className="mt-4 rounded-sm text-[13.5px] text-mint-300 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint-300"
          >
            Cerrar sesión →
          </button>
        </div>
      </aside>

      {/* Padding lives on each page so the screens not yet redesigned keep their own. */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
