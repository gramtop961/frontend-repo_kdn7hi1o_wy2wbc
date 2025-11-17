import React, { useState, useCallback } from 'react'
import { motion, useSpring } from 'framer-motion'
import Spline from '@splinetool/react-spline'
import { FileText, Bot, Tags, Calculator, AlertTriangle, Bell, CalendarCheck } from 'lucide-react'

function useParallax() {
  const [cursor, setCursor] = useState({ x: 0, y: 0 })

  const onMouseMove = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1 // -1 to 1
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1 // -1 to 1
    setCursor({ x, y })
  }, [])

  return { cursor, onMouseMove }
}

const Layer = ({ depth = 0.2, children, className = '' }) => {
  // Springs for smoothness. Closer layers respond faster.
  const stiffness = 100 + depth * 300
  const damping = 18 + depth * 10

  const sx = useSpring(0, { stiffness, damping })
  const sy = useSpring(0, { stiffness, damping })
  const rX = useSpring(0, { stiffness, damping })
  const rY = useSpring(0, { stiffness, damping })

  return (
    <motion.div
      style={{
        x: sx,
        y: sy,
        rotateX: rX,
        rotateY: rY,
        transformStyle: 'preserve-3d',
      }}
      className={className}
    >
      {typeof children === 'function'
        ? children({ sx, sy, rX, rY })
        : children}
    </motion.div>
  )
}

export default function ParallaxHero() {
  const { cursor, onMouseMove } = useParallax()

  // Helper to map depth to movement range
  const getTransforms = (depth) => {
    // Base ranges per spec
    const maxX = depth >= 0.4 ? 30 : depth >= 0.5 ? 40 : depth * 60 // approx
    const maxY = depth >= 0.4 ? 20 : depth >= 0.5 ? 40 : depth * 40
    const tilt = depth >= 0.4 ? 3 : depth * 2

    return {
      x: -cursor.x * maxX,
      y: -cursor.y * maxY,
      rx: cursor.y * tilt,
      ry: -cursor.x * tilt,
    }
  }

  return (
    <section
      onMouseMove={onMouseMove}
      className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white"
    >
      {/* Spline 3D cover background */}
      <div className="absolute inset-0 z-0">
        <Spline scene="https://prod.spline.design/IKzHtP5ThSO83edK/scene.splinecode" style={{ width: '100%', height: '100%' }} className="pointer-events-none" />
      </div>

      {/* Soft gradient overlay to match brand mood */}
      <div className="absolute inset-0 z-10 pointer-events-none bg-[radial-gradient(70%_60%_at_50%_20%,rgba(56,189,248,0.18),transparent_60%)]" />

      <div className="relative z-20 mx-auto max-w-6xl px-6 pt-24 pb-24 sm:pt-28">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mx-auto max-w-3xl text-center mb-14"
        >
          <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-slate-100 to-slate-300">
            Inteligentni knjigovodstveni centar
          </h1>
          <p className="mt-4 text-slate-300/90 text-lg">
            Jedinstven AI sistem koji automatski organizuje finansije, dokumente i obaveze — profesionalno, brzo i jednostavno.
          </p>
        </motion.div>

        {/* Parallax stage */}
        <div className="relative h-[520px] w-full [perspective:1200px]">
          {/* Layer 1: Background subtle shapes */}
          <motion.div
            className="absolute inset-0 rounded-3xl"
            animate={{ opacity: 1, scale: [0.95, 1] }}
            initial={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{
              transform: `translate3d(${getTransforms(0.1).x}px, ${getTransforms(0.1).y}px, 0)`,
            }}
          >
            <div className="absolute -inset-6 rounded-[32px] blur-2xl opacity-50 bg-gradient-to-tr from-sky-700/20 via-blue-500/10 to-cyan-300/10" />
          </motion.div>

          {/* Layer 2: Documents & invoices */}
          <div className="absolute inset-0">
            {[
              { x: '10%', y: '18%', r: -4 },
              { x: '75%', y: '22%', r: 6 },
              { x: '22%', y: '70%', r: 3 },
            ].map((item, i) => {
              const t = getTransforms(0.2)
              return (
                <motion.div
                  key={i}
                  className="absolute w-48 sm:w-56 backdrop-blur bg-white/5 border border-white/10 rounded-2xl p-4 shadow-lg shadow-sky-900/20"
                  style={{
                    left: item.x,
                    top: item.y,
                    transform: `translate3d(${t.x + (i - 1) * 8}px, ${t.y + (1 - i) * 6}px, 0) rotate(${item.r}deg)`,
                  }}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 + i * 0.1, ease: 'easeOut' }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-200 text-sm font-medium">Faktura #{1003 + i}</span>
                    <span className="text-sky-300 text-xs">PDF</span>
                  </div>
                  <div className="h-1.5 rounded bg-slate-700/60 w-5/6 mb-2" />
                  <div className="h-1.5 rounded bg-slate-700/50 w-2/3 mb-4" />
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300 text-sm">Iznos</span>
                    <span className="text-slate-50 font-semibold">€{(420 + i * 57).toFixed(2)}</span>
                  </div>
                  <div className="mt-3 text-[10px] text-sky-200/70">PDV obračun</div>
                  <div className="absolute inset-0 rounded-2xl ring-1 ring-sky-400/10 shadow-[0_0_40px_-10px_rgba(56,189,248,0.35)] pointer-events-none" />
                </motion.div>
              )
            })}
          </div>

          {/* Layer 3: Dashboard elements */}
          <div className="absolute inset-0">
            {(() => {
              const t = getTransforms(0.3)
              return (
                <>
                  {/* Mini bar chart */}
                  <motion.div
                    className="absolute left-[8%] top-[46%] w-56 rounded-2xl p-4 backdrop-blur bg-white/5 border border-white/10"
                    style={{ transform: `translate3d(${t.x}px, ${t.y}px, 0)` }}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                  >
                    <div className="text-slate-200 text-sm mb-3">Prihodi vs Rashodi</div>
                    <div className="flex items-end gap-1 h-16">
                      {[18, 26, 12, 30, 22, 34, 28].map((h, i) => (
                        <div key={i} className="flex-1 bg-gradient-to-t from-sky-500/30 to-sky-300/60 rounded" style={{ height: h }} />
                      ))}
                    </div>
                  </motion.div>

                  {/* Line chart */}
                  <motion.div
                    className="absolute right-[10%] top-[56%] w-64 rounded-2xl p-4 backdrop-blur bg-white/5 border border-white/10"
                    style={{ transform: `translate3d(${t.x}px, ${t.y}px, 0)` }}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.65, ease: 'easeOut' }}
                  >
                    <div className="text-slate-200 text-sm mb-2">Tok gotovine</div>
                    <svg viewBox="0 0 240 80" className="w-full h-20">
                      <defs>
                        <linearGradient id="lg" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0%" stopColor="rgba(56,189,248,0.6)" />
                          <stop offset="100%" stopColor="rgba(56,189,248,0.1)" />
                        </linearGradient>
                      </defs>
                      <path d="M0,60 C40,40 60,65 100,42 C130,28 160,50 200,32 C220,24 240,36 240,36" fill="none" stroke="url(#lg)" strokeWidth="3" />
                    </svg>
                    <div className="text-slate-400 text-xs">+12% ovaj mjesec</div>
                  </motion.div>

                  {/* AI recommendations card */}
                  <motion.div
                    className="absolute left-[20%] top-[12%] w-60 rounded-2xl p-4 backdrop-blur bg-white/5 border border-white/10"
                    style={{ transform: `translate3d(${t.x}px, ${t.y}px, 0)` }}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                  >
                    <div className="text-slate-200 text-sm mb-2">AI preporuke</div>
                    <ul className="text-slate-300 text-xs space-y-1.5">
                      <li>• Kategorizuj 5 novih troškova</li>
                      <li>• Pošalji podsjetnik za fakturu #1082</li>
                      <li>• Optimizuj PDV odbitak</li>
                    </ul>
                  </motion.div>

                  {/* Obligations widget */}
                  <motion.div
                    className="absolute right-[22%] top-[16%] w-64 rounded-2xl p-4 backdrop-blur bg-white/5 border border-white/10"
                    style={{ transform: `translate3d(${t.x}px, ${t.y}px, 0)` }}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.75, ease: 'easeOut' }}
                  >
                    <div className="text-slate-200 text-sm mb-3">Pregled obaveza</div>
                    <div className="flex items-center justify-between text-xs text-slate-300 mb-1"><span>Fakture za naplatu</span><span className="text-slate-100">3</span></div>
                    <div className="flex items-center justify-between text-xs text-slate-300 mb-1"><span>Neplaćeni troškovi</span><span className="text-slate-100">2</span></div>
                    <div className="flex items-center justify-between text-xs text-slate-300"><span>PDV prijava</span><span className="text-emerald-300">u toku</span></div>
                  </motion.div>
                </>
              )
            })()}
          </div>

          {/* Layer 4: Main hero panel */}
          {(() => {
            const t = getTransforms(0.4)
            return (
              <motion.div
                className="absolute left-1/2 top-1/2 w-[720px] max-w-[92%] -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-white/8 backdrop-blur-xl border border-white/10 shadow-2xl shadow-sky-900/30"
                style={{ transform: `translate3d(calc(-50% + ${t.x}px), calc(-50% + ${t.y}px), 0) rotateX(${t.rx}deg) rotateY(${t.ry}deg)` }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              >
                <div className="p-6 sm:p-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-slate-200 text-sm">Faktura</div>
                      <div className="text-2xl font-semibold tracking-tight">ACME d.o.o.</div>
                    </div>
                    <div className="text-right">
                      <div className="text-slate-400 text-xs">Iznos</div>
                      <div className="text-xl font-bold">€1,248.00</div>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="col-span-2 rounded-2xl p-4 bg-white/5 border border-white/10">
                      <div className="text-slate-300 text-sm mb-2">Tok fakturisanja</div>
                      <svg viewBox="0 0 280 90" className="w-full h-24">
                        <defs>
                          <linearGradient id="lg2" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="rgba(125,211,252,0.8)" />
                            <stop offset="100%" stopColor="rgba(56,189,248,0.1)" />
                          </linearGradient>
                        </defs>
                        <path d="M0,70 C40,50 60,75 100,52 C130,38 160,60 200,42 C220,34 260,46 280,46" fill="none" stroke="url(#lg2)" strokeWidth="3" />
                      </svg>
                    </div>
                    <div className="rounded-2xl p-4 bg-white/5 border border-white/10">
                      <div className="text-slate-300 text-sm mb-2">Notifikacija</div>
                      <div className="text-slate-200 text-sm">Klijent je otvorio fakturu</div>
                      <div className="text-slate-400 text-xs mt-1">prije 2m</div>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center gap-3 rounded-2xl p-3 bg-gradient-to-r from-sky-500/10 to-cyan-400/10 border border-white/10">
                    <div className="h-8 w-8 rounded-full bg-sky-400/20 flex items-center justify-center ring-1 ring-sky-300/20">
                      <Bot className="h-4 w-4 text-sky-300" />
                    </div>
                    <div className="text-slate-200 text-sm">
                      AI asistent: Predlažem automatizaciju knjiženja za 5 novih troškova.
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })()}

          {/* Layer 5: Automation icons (closest) */}
          {(() => {
            const t = getTransforms(0.5)
            const items = [
              { Icon: FileText, style: { left: '6%', top: '30%' } },
              { Icon: Bot, style: { left: '14%', top: '60%' } },
              { Icon: Tags, style: { left: '88%', top: '34%' } },
              { Icon: Calculator, style: { left: '82%', top: '68%' } },
              { Icon: AlertTriangle, style: { left: '46%', top: '10%' } },
              { Icon: Bell, style: { left: '54%', top: '86%' } },
              { Icon: CalendarCheck, style: { left: '28%', top: '84%' } },
            ]
            return (
              <>
                {items.map(({ Icon, style }, i) => (
                  <motion.div
                    key={i}
                    className="absolute rounded-full bg-white/10 backdrop-blur ring-1 ring-white/20 p-2 shadow-lg shadow-cyan-900/30"
                    style={{
                      ...style,
                      transform: `translate3d(${t.x + (i % 2 === 0 ? 12 : -12)}px, ${t.y + (i % 3 === 0 ? -10 : 10)}px, 0)`,
                    }}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 + i * 0.08, ease: 'easeOut' }}
                  >
                    <Icon className="h-5 w-5 text-sky-300" />
                  </motion.div>
                ))}
              </>
            )
          })()}
        </div>
      </div>
    </section>
  )
}
