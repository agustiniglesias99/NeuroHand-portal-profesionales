import { useState, type FormEvent, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Reveal } from '../components/Reveal'
import heroImg from '../assets/rect_lofo.jpeg'
import squareLogo from '../assets/squareLogo.jpeg'

/** Content shell: section backgrounds bleed full width, content stays centred. */
const SHELL = 'mx-auto w-full max-w-[1440px] px-6 md:px-10 lg:px-14'

/** Stagger between the blocks of a section, and between cards within a grid. */
const STEP = 90
const CARD_STEP = 70

const NAV_LINKS = [
  { href: '#nosotros', label: 'Nosotros' },
  { href: '#guante', label: 'El Guante Kinesis' },
  { href: '#imagenes', label: 'Imágenes' },
  { href: '#contacto', label: 'Contacto' },
]

export function LandingPage() {
  return (
    <div className="bg-paper font-body text-ink">
      <Header />
      <main>
        <Hero />
        <Nosotros />
        <Guante />
        <Imagenes />
        <Contacto />
      </main>
      <Footer />
    </div>
  )
}

/* ---------------------------------------------------------------- Header */

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-paper/[.86] backdrop-blur-[14px]">
      <div className={`${SHELL} flex items-center justify-between py-[18px]`}>
        <a href="#top" className="flex items-center gap-3 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-600">
          <Monogram />
          <span className="font-display text-[21px] font-medium tracking-[-.01em] text-ink">
            KINESIS
          </span>
        </a>

        <nav className="hidden items-center gap-[34px] lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-sm text-[14.5px] text-ink-500 transition-colors hover:text-brand-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-600"
            >
              {link.label}
            </a>
          ))}
          <PortalLink />
        </nav>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-md p-1 text-ink-500 transition-colors hover:text-brand-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 lg:hidden"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
            <path
              strokeLinecap="round"
              d={menuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 7h16M4 12h16M4 17h16'}
            />
          </svg>
        </button>
      </div>

      {menuOpen && (
        <nav className="border-t border-line bg-paper lg:hidden">
          <div className={`${SHELL} pb-5 pt-2`}>
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block border-b border-line py-3 text-[15px] text-ink-500"
              >
                {link.label}
              </a>
            ))}
            <div className="mt-4">
              <PortalLink />
            </div>
          </div>
        </nav>
      )}
    </header>
  )
}

/**
 * Brand tile. The source asset is the full lockup (hand + wordmark + tagline),
 * so it is cropped to the hand symbol: at this size the wordmark would be
 * unreadable, and the text next to the tile already reads KINESIS.
 */
function Monogram({ size = 'md' }: { size?: 'sm' | 'md' }) {
  const box = size === 'sm' ? 'h-7 w-7 rounded-lg' : 'h-[34px] w-[34px] rounded-[9px]'
  return (
    <span
      aria-hidden="true"
      className={`block flex-none bg-white bg-no-repeat ${box}`}
      style={{
        backgroundImage: `url(${squareLogo})`,
        backgroundSize: '100%',
        //backgroundPosition: '54% 40%',
      }}
    />
  )
}

function PortalLink() {
  return (
    <Link
      to="/login"
      className="inline-block rounded-lg bg-brand-600 px-5 py-2.5 text-center text-[14px] font-medium text-white shadow-[0_1px_2px_rgba(0,42,45,.25)] transition-colors hover:bg-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
    >
      Portal médico
    </Link>
  )
}

/* ------------------------------------------------------------------ Hero */

const HERO_STATS = [
  { value: '5', label: 'sensores por mano' },
  { value: '100%', label: 'sesiones registradas' },
  { value: '24/7', label: 'acceso al panel' },
]

function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden bg-deep-800 bg-[radial-gradient(120%_90%_at_88%_12%,#05787d_0%,#00575b_38%,#00393c_72%,#002a2d_100%)] py-20 text-white lg:pb-[108px] lg:pt-28"
    >
      <div className="nh-grid absolute inset-0 opacity-[.16]" aria-hidden="true" />

      <div
        className={`${SHELL} relative grid items-center gap-14 lg:grid-cols-[1.05fr_.95fr] lg:gap-16`}
      >
        <div className="max-w-[600px]">
          <Reveal
            as="p"
            immediate
            className="inline-flex items-center gap-[9px] rounded-full border border-mint-200/35 bg-brand-600/35 py-[7px] pl-[11px] pr-[14px]"
          >
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-mint-400" />
            <span className="font-meta text-[11px] uppercase tracking-[.09em] text-mint-200">
              Rehabilitación motora de la mano
            </span>
          </Reveal>

          <Reveal
            as="h1"
            immediate
            delay={80}
            className="mt-[26px] font-display text-[42px] font-normal leading-[1.05] tracking-[-.025em] text-pretty sm:text-[54px] lg:text-[66px]"
          >
            Rehabilitación más <em className="italic text-mint-300">interactiva</em>, accesible y
            medible
          </Reveal>

          <Reveal
            as="p"
            immediate
            delay={160}
            className="mt-[26px] max-w-[520px] text-[17px] leading-[1.62] text-on-deep"
          >
            Kinesis combina un guante inteligente sensorizado con una plataforma digital
            interactiva para acompañar la rehabilitación motriz de la mano, favoreciendo la
            adherencia al tratamiento y el seguimiento del proceso terapéutico.
          </Reveal>

          <Reveal immediate delay={240} className="mt-9 flex flex-wrap gap-3">
            <a
              href="#guante"
              className="rounded-[9px] bg-white px-[26px] py-3.5 text-[15px] font-semibold text-deep-800 transition-colors hover:bg-[#d9f0ef] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint-300"
            >
              Conocé el guante
            </a>
            <a
              href="#contacto"
              className="rounded-[9px] border border-mint-200/40 px-[26px] py-3.5 text-[15px] font-medium text-[#dceceb] transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint-300"
            >
              Contactanos
            </a>
          </Reveal>

          <Reveal
            as="dl"
            immediate
            delay={320}
            className="mt-14 flex flex-wrap gap-x-11 gap-y-6 border-t border-mint-200/20 pt-7"
          >
            {HERO_STATS.map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd className="m-0">
                  <span className="block font-display text-[30px] text-white">{stat.value}</span>
                  <span className="mt-0.5 block text-[12.5px] text-on-deep-dim">{stat.label}</span>
                </dd>
              </div>
            ))}
          </Reveal>
        </div>

        <Reveal
          immediate
          delay={160}
          className="relative grid h-[340px] place-items-center overflow-hidden rounded-2xl border border-mint-200/[.28] bg-[linear-gradient(160deg,rgba(255,255,255,.09),rgba(255,255,255,.02))] lg:h-[440px]"
        >
          <div className="nh-hatch-dark absolute inset-0" aria-hidden="true" />
          <img
            src={heroImg}
            alt="Guante Kinesis colocado en una mano"
            className="relative max-h-[78%] w-auto max-w-[70%] object-contain drop-shadow-[0_18px_40px_rgba(0,25,27,.45)]"
          />
        </Reveal>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------- Nosotros */

const PILLARS = [
  {
    index: '01',
    title: 'Guante inteligente',
    text: 'Dispositivo sensorizado que captura el movimiento de la mano y brinda retroalimentación háptica.',
  },
  {
    index: '02',
    title: 'Software para pacientes',
    text: 'Actividades terapéuticas interactivas con historial, progreso y métricas de desempeño.',
  },
  {
    index: '03',
    title: 'Gestión para profesionales',
    text: 'Seguimiento de la evolución, administración de pacientes y visualización de indicadores.',
  },
]

function Nosotros() {
  return (
    <section id="nosotros" className="scroll-mt-24 bg-paper py-20 lg:py-[104px]">
      <div className={SHELL}>
        <Reveal>
          <Eyebrow rule>Nosotros</Eyebrow>
          <h2 className="mt-5 max-w-[640px] font-display text-[34px] font-normal leading-[1.1] tracking-[-.02em] text-ink lg:text-[46px]">
            Una solución integral para la rehabilitación
          </h2>
        </Reveal>

        <Reveal delay={STEP} className="mt-10 grid max-w-[1100px] gap-10 md:grid-cols-2 md:gap-14">
          <p className="m-0 text-[16.5px] leading-[1.7] text-ink-500">
            Kinesis nace para brindar una experiencia de rehabilitación motora más interactiva,
            accesible y medible. Nuestra propuesta integra tecnologías de sensado, seguimiento y
            actividades terapéuticas digitales con el fin de acompañar los procesos de
            rehabilitación de manera más participativa y cuantificable.
          </p>
          <p className="m-0 text-[16.5px] leading-[1.7] text-ink-500">
            La solución está pensada para centros de rehabilitación, clínicas, consultorios y
            profesionales de fisioterapia y terapia ocupacional, ofreciendo herramientas que
            complementan —sin reemplazar— la labor del profesional de la salud y potencian el
            vínculo con el paciente durante todo el tratamiento.
          </p>
        </Reveal>

        {/* The 1px gaps are the card dividers, so the grid moves as one piece —
            staggering the cards would tear those hairlines apart mid-animation. */}
        <Reveal
          delay={STEP * 2}
          className="mt-14 grid gap-px overflow-hidden rounded-[14px] border border-line-200 bg-line-200 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3"
        >
          {PILLARS.map((pillar) => (
            <div
              key={pillar.index}
              className="bg-white px-[30px] pb-[38px] pt-[34px] transition-colors hover:bg-paper-tint"
            >
              <span className="font-meta text-[11px] text-ink-200">{pillar.index}</span>
              <h3 className="mb-2.5 mt-[18px] text-[18px] font-semibold text-deep-800">
                {pillar.title}
              </h3>
              <p className="m-0 text-[15px] leading-[1.65] text-ink-400">{pillar.text}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- Guante */

const GLOVE_FEATURES = [
  { index: '01', text: 'Captura de movimiento dedo por dedo en tiempo real' },
  { index: '02', text: 'Retroalimentación háptica durante cada ejercicio' },
  { index: '03', text: 'Datos sincronizados con el panel del profesional' },
]

function Guante() {
  return (
    <section
      id="guante"
      className="scroll-mt-24 border-y border-line bg-paper-200 py-20 lg:py-[100px]"
    >
      <div className={`${SHELL} grid items-center gap-12 lg:grid-cols-2 lg:gap-16`}>
        <Reveal className="relative order-last grid h-[320px] place-items-center overflow-hidden rounded-[14px] border border-[#d3e0de] bg-paper-400 lg:order-first lg:h-[420px]">
          <div className="nh-hatch-light absolute inset-0" aria-hidden="true" />
          <img
            src={heroImg}
            alt="Detalle del guante Kinesis"
            className="relative max-h-[76%] w-auto max-w-[68%] object-contain"
          />
        </Reveal>

        <div>
          <Reveal delay={STEP}>
            <Eyebrow rule>El guante Kinesis</Eyebrow>
            <h2 className="mt-5 font-display text-[32px] font-normal leading-[1.1] tracking-[-.02em] text-ink lg:text-[44px]">
              Tecnología sensorizada al servicio de la recuperación
            </h2>
            <p className="mt-[22px] max-w-[520px] text-[16.5px] leading-[1.7] text-ink-500">
              Un guante ligero y ergonómico que convierte cada sesión de rehabilitación en una
              experiencia interactiva y medible.
            </p>
          </Reveal>

          {/* Same hairline-gap construction as the pillars — reveal the list as one piece. */}
          <Reveal
            as="ul"
            delay={STEP * 2}
            className="mt-[34px] grid list-none gap-0.5 overflow-hidden rounded-xl bg-line-300 p-0"
          >
            {GLOVE_FEATURES.map((feature) => (
              <li
                key={feature.index}
                className="flex items-baseline gap-4 bg-paper px-[22px] py-[18px]"
              >
                <span className="min-w-[22px] font-meta text-[11px] text-brand-600">
                  {feature.index}
                </span>
                <span className="text-[15.5px] text-ink-600">{feature.text}</span>
              </li>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------- Imágenes */

const GALLERY = [
  { tag: 'IMG-01', name: 'Guante sensorizado' },
  { tag: 'IMG-02', name: 'App del paciente' },
  { tag: 'IMG-03', name: 'Actividades interactivas' },
  { tag: 'IMG-04', name: 'Panel del profesional' },
  { tag: 'IMG-05', name: 'Métricas de progreso' },
  { tag: 'IMG-06', name: 'Sesión de rehabilitación' },
]

function Imagenes() {
  return (
    <section id="imagenes" className="scroll-mt-24 bg-paper py-20 lg:py-[104px]">
      <div className={SHELL}>
        <Reveal className="mx-auto max-w-[660px] text-center">
          <span className="font-meta text-[11px] uppercase tracking-[.12em] text-brand-600">
            Imágenes
          </span>
          <h2 className="mt-4 font-display text-[34px] font-normal leading-[1.1] tracking-[-.02em] text-ink lg:text-[46px]">
            Conocé la solución en acción
          </h2>
          <p className="mt-4 text-[16.5px] leading-[1.65] text-ink-400">
            Una mirada al guante, la plataforma y las experiencias terapéuticas que componen
            Kinesis.
          </p>
        </Reveal>

        {/* Cards are observed one by one, so the stagger runs across a row only —
            later rows already arrive late by virtue of the scroll. */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:mt-[52px] lg:grid-cols-3">
          {GALLERY.map((item, index) => (
            <Reveal
              key={item.tag}
              as="figure"
              delay={(index % 3) * CARD_STEP}
              className="relative m-0 aspect-4/3 overflow-hidden rounded-[13px] border border-[#dbe5e4] bg-paper-300"
            >
              <div className="nh-hatch-light absolute inset-0" aria-hidden="true" />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,57,60,.82)_0%,rgba(0,57,60,.12)_52%,transparent_100%)]"
              />
              <span className="absolute left-4 top-3.5 font-meta text-[10.5px] tracking-[.08em] text-brand-600">
                {item.tag}
              </span>
              <figcaption className="absolute bottom-3.5 left-4 text-[15px] font-medium text-white">
                {item.name}
              </figcaption>
            </Reveal>
          ))}
        </div>

        <Reveal as="p" className="mt-[26px] text-center font-meta text-[11.5px] text-ink-200">
          Imágenes ilustrativas — se reemplazarán por fotografías reales del producto.
        </Reveal>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------- Contacto */

const CONTACT_DETAILS = [
  { label: 'MAIL', value: 'contacto@kinesis.com' },
  { label: 'SEDE', value: 'Universidad Nacional de La Matanza — Equipo 101' },
]

function Contacto() {
  const [sent, setSent] = useState(false)

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setSent(true)
  }

  return (
    <section
      id="contacto"
      className="scroll-mt-24 bg-deep-800 bg-[radial-gradient(90%_120%_at_10%_0%,#00575b_0%,#00393c_55%,#002a2d_100%)] py-20 text-white lg:py-[100px]"
    >
      <div className={`${SHELL} grid items-start gap-12 lg:grid-cols-2 lg:gap-[72px]`}>
        <Reveal>
          <Eyebrow rule tone="dark">
            Contacto
          </Eyebrow>
          <h2 className="mt-5 font-display text-[34px] font-normal leading-[1.1] tracking-[-.02em] lg:text-[46px]">
            Hablemos sobre tu institución
          </h2>
          <p className="mt-[22px] max-w-[460px] text-[16.5px] leading-[1.7] text-on-deep">
            ¿Querés incorporar Kinesis en tu centro de rehabilitación o conocer más sobre la
            solución? Escribinos y nos pondremos en contacto.
          </p>

          <div className="mt-9 grid gap-3.5">
            {CONTACT_DETAILS.map((detail) => (
              <div
                key={detail.label}
                className="flex flex-wrap items-center gap-x-3.5 gap-y-1 rounded-[10px] border border-mint-200/[.22] bg-white/[.04] px-[18px] py-4"
              >
                <span className="font-meta text-[10.5px] tracking-[.08em] text-mint-300">
                  {detail.label}
                </span>
                <span className="text-[15.5px] text-[#e4f0ef]">{detail.value}</span>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal
          delay={STEP}
          className="rounded-[14px] bg-paper p-6 text-ink shadow-[0_20px_50px_rgba(0,25,27,.35)] sm:p-8"
        >
          {sent ? (
            <div className="py-6 text-center">
              <p className="m-0 font-display text-[26px] text-deep-800">Mensaje enviado</p>
              <p className="mx-auto mt-3 max-w-[320px] text-[15px] leading-[1.6] text-ink-400">
                Gracias por escribirnos. Te respondemos dentro de las 48 hs hábiles.
              </p>
              <button
                type="button"
                onClick={() => setSent(false)}
                className="mt-6 font-meta text-[11.5px] uppercase tracking-[.1em] text-brand-600 underline underline-offset-4 transition-colors hover:text-brand-700"
              >
                Enviar otro mensaje
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="grid gap-3.5 sm:grid-cols-2">
                <Field name="nombre" label="Nombre" placeholder="Nombre" required />
                <Field name="institucion" label="Institución" placeholder="Institución" />
              </div>
              <div className="mt-3.5">
                <Field
                  name="email"
                  type="email"
                  label="Correo electrónico"
                  placeholder="Correo electrónico"
                  required
                />
              </div>
              <div className="mt-3.5">
                <label htmlFor="mensaje" className="sr-only">
                  Tu mensaje
                </label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  rows={5}
                  required
                  placeholder="Tu mensaje"
                  className="w-full resize-y rounded-[9px] border border-line-300 bg-white px-[15px] py-[13px] text-[15px] text-ink outline-none transition-colors placeholder:text-ink-300 focus:border-brand-600 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-600"
                />
              </div>
              <button
                type="submit"
                className="mt-[18px] w-full rounded-[9px] bg-brand-600 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
              >
                Enviar mensaje
              </button>
              <p className="mb-0 mt-3.5 text-center text-[12.5px] text-ink-300">
                Respondemos dentro de las 48 hs hábiles.
              </p>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  )
}

function Field({
  name,
  label,
  placeholder,
  type = 'text',
  required = false,
}: {
  name: string
  label: string
  placeholder: string
  type?: string
  required?: boolean
}) {
  return (
    <div>
      <label htmlFor={name} className="sr-only">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-[9px] border border-line-300 bg-white px-[15px] py-[13px] text-[15px] text-ink outline-none transition-colors placeholder:text-ink-300 focus:border-brand-600 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-600"
      />
    </div>
  )
}

/* ---------------------------------------------------------------- Footer */

function Footer() {
  return (
    <footer className="bg-deep-900 text-on-deep-dim">
      <div
        className={`${SHELL} flex flex-col items-center justify-between gap-5 py-[34px] sm:flex-row`}
      >
        <div className="flex items-center gap-[11px]">
          <Monogram size="sm" />
          <span className="font-display text-[17px] text-white">KINESIS</span>
        </div>
        <p className="m-0 text-center text-[13px]">
          © 2026 KINESIS · Rehabilitación motora interactiva
        </p>
        <Link
          to="/login"
          className="rounded-sm text-[13.5px] font-medium text-mint-300 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-mint-300"
        >
          Portal médico →
        </Link>
      </div>
    </footer>
  )
}

/* -------------------------------------------------------- Eyebrow helper */

function Eyebrow({
  children,
  rule = false,
  tone = 'light',
}: {
  children: ReactNode
  rule?: boolean
  tone?: 'light' | 'dark'
}) {
  return (
    <p className="flex items-center gap-3">
      {rule && (
        <span
          aria-hidden="true"
          className={`h-px w-[26px] ${tone === 'dark' ? 'bg-mint-400' : 'bg-brand-600'}`}
        />
      )}
      <span
        className={`font-meta text-[11px] uppercase tracking-[.12em] ${
          tone === 'dark' ? 'text-mint-300' : 'text-brand-600'
        }`}
      >
        {children}
      </span>
    </p>
  )
}
