'use client'

import { MoonIcon, SunIcon } from './Icons'

/** Theme is applied before paint by an inline script in the layout; this just flips it. */
export function ThemeToggle() {
  const toggle = () => {
    const dark = !document.documentElement.classList.contains('dark')
    document.documentElement.classList.toggle('dark', dark)
    try {
      localStorage.setItem('theme', dark ? 'dark' : 'light')
    } catch {}
  }
  return (
    <button
      type="button"
      onClick={toggle}
      className="grid size-10 place-items-center rounded-full text-muted transition hover:bg-accent-soft hover:text-ink"
      aria-label="Toggle dark mode"
    >
      <SunIcon className="hidden dark:block" />
      <MoonIcon className="block dark:hidden" />
    </button>
  )
}

export const themeScript = `(function(){try{var t=localStorage.getItem('theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(d)document.documentElement.classList.add('dark')}catch(e){}})()`
