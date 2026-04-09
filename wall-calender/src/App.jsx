import { useState } from 'react'
import heroImg from './assets/hero.png'

function App() {
  const [count, setCount] = useState(0)

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl items-center px-6 py-12 sm:px-10">
      <section className="grid w-full gap-10 overflow-hidden rounded-[2rem] border border-black/10 bg-[var(--color-panel)] p-6 shadow-[var(--shadow-poster)] backdrop-blur md:grid-cols-[1.05fr_0.95fr] md:p-10">
        <div className="flex flex-col justify-between gap-8">
          <div className="space-y-5">
            <p className="inline-flex rounded-full border border-[var(--color-accent)]/20 bg-[var(--color-accent)]/10 px-4 py-1 text-sm font-semibold uppercase tracking-[0.28em] text-[var(--color-accent-dark)]">
              Tailwind v4 is ready
            </p>
            <div className="space-y-4">
              <h1 className="max-w-xl text-5xl font-semibold tracking-tight text-[var(--color-ink)] sm:text-6xl">
                Wall calendar UI, now powered by utility classes.
              </h1>
              <p className="max-w-lg text-base leading-7 text-black/70 sm:text-lg">
                The project is configured with the official Tailwind Vite plugin,
                global Tailwind import, and a starter screen you can extend right
                away.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              className="rounded-full bg-[var(--color-accent)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--color-accent-dark)]"
              onClick={() => setCount((value) => value + 1)}
            >
              Count is {count}
            </button>
            <code className="rounded-full border border-black/10 bg-white/70 px-4 py-3 text-sm text-black/70">
              Edit src/App.jsx
            </code>
          </div>
        </div>

        <div className="relative flex min-h-[420px] items-center justify-center rounded-[1.5rem] bg-[#efe2d3] p-8">
          <div className="absolute inset-6 rounded-[1.25rem] border border-dashed border-black/10" />
          <div className="relative w-full max-w-sm rounded-[1.75rem] bg-white p-6 shadow-2xl shadow-black/10">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-black/45">
                  April 2026
                </p>
                <p className="text-2xl font-semibold">Planning board</p>
              </div>
              <img
                src={heroImg}
                width="72"
                height="76"
                alt="Wall calendar illustration"
                className="h-18 w-18 rounded-2xl object-cover"
              />
            </div>

            <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold uppercase tracking-wide text-black/45">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>

            <div className="mt-3 grid grid-cols-7 gap-2 text-sm">
              {Array.from({ length: 30 }, (_, index) => {
                const day = index + 1
                const highlighted = day === 9 || day === 18 || day === 24

                return (
                  <div
                    key={day}
                    className={`flex aspect-square items-center justify-center rounded-2xl border text-sm ${
                      highlighted
                        ? 'border-[var(--color-accent)] bg-[var(--color-accent)] text-white'
                        : 'border-black/5 bg-[#faf7f2] text-black/70'
                    }`}
                  >
                    {day}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default App
