import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import heroImg from '../assets/hero.png'

const NAV_LINKS = [
  { href: '#nosotros', label: 'Nosotros' },
  { href: '#guante', label: 'El Guante NeuroHand' },
  { href: '#imagenes', label: 'Imágenes' },
  { href: '#contacto', label: 'Contacto' },
]

export function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white text-slate-800">
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <main>
        <Hero />
        <Nosotros />
        <Guante />
        <Beneficios />
        <Imagenes />
        <Contacto />
      </main>
      <Footer />
    </div>
  )
}

/* ---------------------------------------------------------------- Header */

function Header({
  menuOpen,
  setMenuOpen,
}: {
  menuOpen: boolean
  setMenuOpen: (v: boolean) => void
}) {
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white/90 backdrop-blur border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-blue-700 rounded-lg flex items-center justify-center text-white text-xs font-bold">
            NH
          </div>
          <span className="font-bold text-lg text-slate-900">NeuroHand</span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-base font-medium text-slate-600 hover:text-blue-700 transition-colors"
            >
              {link.label}
            </a>
          ))}
          <Link
            to="/login"
            className="text-base font-medium px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg transition-colors"
          >
            Portal médico
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-slate-700"
          aria-label="Abrir menú"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d={menuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav className="md:hidden border-t border-slate-200 bg-white px-6 py-3 space-y-1">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block py-2 text-base font-medium text-slate-600 hover:text-blue-700"
            >
              {link.label}
            </a>
          ))}
          <Link
            to="/login"
            className="block mt-2 text-center text-base font-medium px-4 py-2 bg-blue-700 text-white rounded-lg"
          >
            Portal médico
          </Link>
        </nav>
      )}
    </header>
  )
}

/* ------------------------------------------------------------------ Hero */

function Hero() {
  return (
    <section
      id="top"
      className="relative pt-16 bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 text-white overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-6 py-20 lg:py-28 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <span className="inline-block px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 text-xs font-medium mb-5">
            Rehabilitación motora de la mano
          </span>
          <h1 className="text-4xl lg:text-5xl font-bold leading-tight tracking-tight">
            Rehabilitación más interactiva, accesible y medible
          </h1>
          <p className="mt-5 text-blue-100 text-xl leading-relaxed">
            NeuroHand combina un guante inteligente sensorizado con una plataforma
            digital interactiva para acompañar la rehabilitación motriz de la mano,
            favoreciendo la adherencia al tratamiento y el seguimiento del proceso
            terapéutico.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#guante"
              className="px-6 py-3 bg-white text-blue-800 font-medium rounded-lg hover:bg-blue-50 transition-colors"
            >
              Conocé el guante
            </a>
            <a
              href="#contacto"
              className="px-6 py-3 border border-blue-400/50 text-white font-medium rounded-lg hover:bg-blue-800/50 transition-colors"
            >
              Contactanos
            </a>
          </div>
        </div>

        <div className="relative flex justify-center">
          <div className="absolute w-72 h-72 bg-blue-500/30 rounded-full blur-3xl" />
          <img
            src={heroImg}
            alt="Dispositivo NeuroHand"
            className="relative w-64 lg:w-80 drop-shadow-2xl"
          />
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------- Nosotros */

function Nosotros() {
  return (
    <Section id="nosotros" eyebrow="Nosotros" title="Una solución integral para la rehabilitación">
      <div className="grid lg:grid-cols-2 gap-10 items-start">
        <p className="text-lg text-slate-600 leading-relaxed">
          NeuroHand nace para brindar una experiencia de rehabilitación motora más
          interactiva, accesible y medible. Nuestra propuesta integra tecnologías de
          sensado, seguimiento y actividades terapéuticas digitales con el fin de
          acompañar los procesos de rehabilitación de manera más participativa y
          cuantificable.
        </p>
        <p className="text-lg text-slate-600 leading-relaxed">
          La solución está pensada para centros de rehabilitación, clínicas, consultorios
          y profesionales de fisioterapia y terapia ocupacional, ofreciendo herramientas
          que complementan —sin reemplazar— la labor del profesional de la salud y
          potencian el vínculo con el paciente durante todo el tratamiento.
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-5 mt-12">
        <PillarCard
          title="Guante inteligente"
          text="Dispositivo sensorizado que captura el movimiento de la mano y brinda retroalimentación háptica."
        />
        <PillarCard
          title="Software para pacientes"
          text="Actividades terapéuticas interactivas con historial, progreso y métricas de desempeño."
        />
        <PillarCard
          title="Gestión para profesionales"
          text="Seguimiento de la evolución, administración de pacientes y visualización de indicadores."
        />
      </div>
    </Section>
  )
}

function PillarCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
      <h3 className="font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-base text-slate-600 leading-relaxed">{text}</p>
    </div>
  )
}

/* ---------------------------------------------------------------- Guante */

const GLOVE_FEATURES = [
  {
    title: 'Captura de movimientos',
    text: 'Sensores que registran la motricidad de la mano y los dedos durante cada ejercicio.',
  },
  {
    title: 'Retroalimentación háptica',
    text: 'Vibración que guía y refuerza al paciente en tiempo real durante las actividades.',
  },
  {
    title: 'Actividades interactivas',
    text: 'El guante interactúa con ejercicios terapéuticos digitales que motivan la participación.',
  },
  {
    title: 'Transmisión de datos',
    text: 'La información viaja a la plataforma para registrar el progreso y generar métricas.',
  },
]

function Guante() {
  return (
    <section id="guante" className="scroll-mt-20 bg-slate-50 border-y border-slate-200">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative flex justify-center order-last lg:order-first">
            <div className="absolute w-64 h-64 bg-blue-200/50 rounded-full blur-3xl" />
            <img src={heroImg} alt="Guante NeuroHand" className="relative w-60 lg:w-72" />
          </div>

          <div>
            <p className="text-blue-700 font-semibold text-base uppercase tracking-wide mb-2">
              El Guante NeuroHand
            </p>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Tecnología sensorizada al servicio de la recuperación
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed mb-8">
              Un guante ligero y ergonómico que convierte cada sesión de rehabilitación
              en una experiencia interactiva y medible, integrándose de forma natural con
              la plataforma de software.
            </p>

            <div className="grid sm:grid-cols-2 gap-5">
              {GLOVE_FEATURES.map((f) => (
                <div key={f.title} className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 text-base">{f.title}</h3>
                    <p className="text-base text-slate-600 mt-0.5 leading-relaxed">{f.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------ Beneficios */

const BENEFITS = [
  {
    title: 'Mayor adherencia al tratamiento',
    text: 'Las experiencias interactivas promueven una participación activa del paciente, sesión tras sesión.',
  },
  {
    title: 'Seguimiento medible',
    text: 'Registro de métricas e historial de desempeño para visualizar la evolución del proceso terapéutico.',
  },
  {
    title: 'Decisiones informadas',
    text: 'Información centralizada que apoya el análisis y la toma de decisiones del profesional.',
  },
  {
    title: 'Motivación constante',
    text: 'La retroalimentación háptica y los ejercicios gamificados mantienen al paciente comprometido.',
  },
  {
    title: 'Más accesible',
    text: 'Una alternativa potencialmente más económica frente a dispositivos especializados de alto costo.',
  },
  {
    title: 'Menos tareas manuales',
    text: 'Reduce el registro y la consulta manual de actividades, centralizando todo en un solo lugar.',
  },
]

function Beneficios() {
  return (
    <Section
      id="beneficios"
      eyebrow="Beneficios para la rehabilitación"
      title="Por qué NeuroHand marca la diferencia"
    >
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {BENEFITS.map((b) => (
          <div
            key={b.title}
            className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg hover:border-blue-200 transition-all"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center mb-4">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">{b.title}</h3>
            <p className="text-base text-slate-600 leading-relaxed">{b.text}</p>
          </div>
        ))}
      </div>
    </Section>
  )
}

/* -------------------------------------------------------------- Imágenes */

const GALLERY = [
  { label: 'Guante sensorizado', from: 'from-blue-500', to: 'to-blue-700' },
  { label: 'App del paciente', from: 'from-sky-500', to: 'to-blue-600' },
  { label: 'Actividades interactivas', from: 'from-indigo-500', to: 'to-blue-700' },
  { label: 'Panel del profesional', from: 'from-cyan-500', to: 'to-blue-600' },
  { label: 'Métricas de progreso', from: 'from-blue-600', to: 'to-indigo-700' },
  { label: 'Sesión de rehabilitación', from: 'from-teal-500', to: 'to-blue-600' },
]

function Imagenes() {
  return (
    <section id="imagenes" className="scroll-mt-20 bg-slate-50 border-y border-slate-200">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-blue-700 font-semibold text-base uppercase tracking-wide mb-2">
            Imágenes
          </p>
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900">Conocé la solución en acción</h2>
          <p className="text-lg text-slate-600 mt-3">
            Una mirada al guante, la plataforma y las experiencias terapéuticas que
            componen NeuroHand.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {GALLERY.map((item) => (
            <div
              key={item.label}
              className={`aspect-[4/3] rounded-xl bg-gradient-to-br ${item.from} ${item.to} flex items-end p-5 relative overflow-hidden group`}
            >
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_20%,white,transparent_60%)]" />
              <span className="relative text-white font-medium text-base drop-shadow">
                {item.label}
              </span>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-slate-400 mt-6">
          Imágenes ilustrativas — se reemplazarán por fotografías reales del producto.
        </p>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------- Contacto */

function Contacto() {
  const [sent, setSent] = useState(false)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSent(true)
  }

  return (
    <Section id="contacto" eyebrow="Contacto" title="Hablemos sobre tu institución">
      <div className="grid lg:grid-cols-2 gap-12">
        <div>
          <p className="text-lg text-slate-600 leading-relaxed mb-8">
            ¿Querés incorporar NeuroHand en tu centro de rehabilitación o conocer más
            sobre la solución? Escribinos y nos pondremos en contacto.
          </p>
          <ul className="space-y-4 text-base">
            <li className="flex items-center gap-3">
              <ContactIcon path="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              <span className="text-slate-700">contacto@neurohand.com</span>
            </li>
            <li className="flex items-center gap-3">
              <ContactIcon path="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              <span className="text-slate-700">Universidad Nacional de La Matanza — Equipo 101</span>
            </li>
          </ul>
        </div>

        <div>
          {sent ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center">
              <p className="text-emerald-700 font-medium">¡Gracias por tu mensaje!</p>
              <p className="text-emerald-600 text-base mt-1">Te responderemos a la brevedad.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  required
                  placeholder="Nombre"
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Institución"
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <input
                type="email"
                required
                placeholder="Correo electrónico"
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <textarea
                required
                rows={4}
                placeholder="Tu mensaje"
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-medium rounded-lg transition-colors"
              >
                Enviar mensaje
              </button>
            </form>
          )}
        </div>
      </div>
    </Section>
  )
}

function ContactIcon({ path }: { path: string }) {
  return (
    <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d={path} />
      </svg>
    </div>
  )
}

/* ---------------------------------------------------------------- Footer */

function Footer() {
  return (
    <footer className="bg-blue-950 text-blue-200">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center text-white text-xs font-bold">
            NH
          </div>
          <span className="font-bold text-white">NeuroHand</span>
        </div>
        <p className="text-xs text-blue-300">
          © 2026 NeuroHand · Rehabilitación motora interactiva
        </p>
        <Link to="/login" className="text-base font-medium text-white hover:text-blue-300 transition-colors">
          Portal médico →
        </Link>
      </div>
    </footer>
  )
}

/* -------------------------------------------------------- Section helper */

function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string
  eyebrow: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-20">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="max-w-2xl mb-12">
          <p className="text-blue-700 font-semibold text-base uppercase tracking-wide mb-2">
            {eyebrow}
          </p>
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900">{title}</h2>
        </div>
        {children}
      </div>
    </section>
  )
}
