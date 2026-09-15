import { useCallback, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import {
  BarChart3,
  CalendarDays,
  GitCompareArrows,
  Handshake,
  Home,
  Info,
  Layers,
  ListChecks,
  Menu,
  Search,
  Shield,
  Trophy,
  Users,
  X,
} from 'lucide-react'
import { useApp } from '@/hooks/useData'
import { GlobalSearch, useSearchHotkey } from '@/components/GlobalSearch'
import { cn } from '@/lib/cn'

const NAV = [
  { to: '/disciplines', label: 'Disciplines', icon: Layers },
  { to: '/rankings', label: 'Rankings', icon: BarChart3 },
  { to: '/p4p', label: 'Pound for Pound', icon: Trophy },
  { to: '/fighters', label: 'Fighters', icon: Users },
  { to: '/events', label: 'Events', icon: CalendarDays },
  { to: '/results', label: 'Results', icon: ListChecks },
  { to: '/about', label: 'About', icon: Info },
]

const MOBILE_NAV = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/disciplines', label: 'Sports', icon: Layers },
  { to: '/rankings', label: 'Rankings', icon: BarChart3 },
  { to: '/results', label: 'Results', icon: ListChecks },
  { to: '/fighters', label: 'Fighters', icon: Users },
]

export function PublicLayout() {
  const { session, context } = useApp()
  const [searchOpen, setSearchOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  useSearchHotkey(useCallback(() => setSearchOpen(true), []))

  return (
    <div className="flex min-h-screen flex-col bg-ink-900">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[80] focus:bg-signal focus:px-4 focus:py-2 focus:text-ink-900"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-40 border-b border-line bg-ink-900/92 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-[1400px] items-center gap-4 px-4 sm:px-6">
          <Link to="/" className="shrink-0" aria-label="FIGHTRANK home">
            <span className="numeral text-xl tracking-tight text-chalk sm:text-2xl">
              FIGHT<span className="text-signal">RANK</span>
            </span>
          </Link>

          <nav className="hidden flex-1 items-center gap-1 lg:flex">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'px-3 py-2 font-display text-sm font-semibold uppercase tracking-[0.08em] transition-colors',
                    isActive ? 'text-signal' : 'text-chalk-dim hover:text-chalk',
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-1">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 border border-line px-2.5 py-1.5 text-sm text-muted transition-colors hover:border-chalk-dim hover:text-chalk"
              aria-label="Search"
            >
              <Search className="size-4" />
              <span className="hidden text-xs xl:inline">Search</span>
              <kbd className="hidden rounded-xs border border-line px-1 text-[0.65rem] text-faint xl:inline">
                ⌘K
              </kbd>
            </button>

            <Link
              to={session ? '/admin' : '/admin/login'}
              className="hidden items-center gap-2 border border-line px-2.5 py-1.5 text-sm text-muted transition-colors hover:border-signal hover:text-signal sm:flex"
            >
              <Shield className="size-4" />
              <span className="hidden text-xs xl:inline">{session ? 'Admin' : 'Sign in'}</span>
            </Link>

            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="p-2 text-chalk-dim transition hover:text-chalk lg:hidden"
              aria-label="Menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {menuOpen ? (
          <div className="animate-fade border-t border-line bg-ink-850 lg:hidden">
            <nav className="mx-auto flex max-w-[1400px] flex-col px-4 py-2 sm:px-6">
              {[
                ...NAV,
                { to: '/compare', label: 'Compare', icon: GitCompareArrows },
                { to: '/partners', label: 'Partners', icon: Handshake },
                { to: '/methodology', label: 'How it works', icon: BarChart3 },
              ].map(
                (item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 border-b border-line-soft py-3 font-display text-base font-semibold uppercase tracking-wide last:border-b-0',
                        isActive ? 'text-signal' : 'text-chalk-dim',
                      )
                    }
                  >
                    <item.icon className="size-4" />
                    {item.label}
                  </NavLink>
                ),
              )}
              <Link
                to={session ? '/admin' : '/admin/login'}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 border-t border-line py-3 font-display text-base font-semibold uppercase tracking-wide text-muted"
              >
                <Shield className="size-4" />
                {session ? 'Admin panel' : 'Administrator sign in'}
              </Link>
            </nav>
          </div>
        ) : null}
      </header>

      <main id="main" key={location.pathname} className="flex-1 pb-20 lg:pb-0">
        <Outlet />
      </main>

      <Footer mode={context.mode} />

      {/* Mobile bottom navigation (§33) */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ink-850/97 backdrop-blur lg:hidden">
        <ul className="mx-auto flex max-w-lg">
          {MOBILE_NAV.map((item) => (
            <li key={item.to} className="flex-1">
              <NavLink
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    'flex flex-col items-center gap-1 py-2.5 text-[0.62rem] font-semibold uppercase tracking-wider transition-colors',
                    isActive ? 'text-signal' : 'text-muted',
                  )
                }
              >
                <item.icon className="size-[18px]" />
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  )
}

function Footer({ mode }: { mode: 'supabase' | 'local' }) {
  return (
    <footer className="border-t border-line bg-ink-850">
      <div className="mx-auto grid w-full max-w-[1400px] gap-8 px-4 py-10 sm:px-6 md:grid-cols-[2fr_1fr_1fr]">
        <div>
          <div className="numeral text-2xl text-chalk">
            FIGHT<span className="text-signal">RANK</span>
          </div>
          <p className="mt-2 max-w-sm text-sm text-muted">
            Every fight changes the ranking. Positions are produced by a published algorithm from
            recorded results — never by opinion, popularity or promotion.
          </p>
          <p className="mt-4 max-w-sm text-xs leading-relaxed text-faint">
            FIGHTRANK is an independent ranking platform and is not affiliated with, endorsed by or
            connected to any real promotion. The fighters, events and results shown in this
            installation are <strong className="text-muted">fictional demonstration data</strong>.
          </p>
        </div>
        <nav className="flex flex-col gap-2 text-sm">
          <span className="eyebrow mb-1">Rankings</span>
          <Link to="/disciplines" className="text-muted transition hover:text-chalk">Disciplines</Link>
          <Link to="/rankings" className="text-muted transition hover:text-chalk">All divisions</Link>
          <Link to="/p4p" className="text-muted transition hover:text-chalk">Pound for pound</Link>
          <Link to="/movers" className="text-muted transition hover:text-chalk">Biggest movers</Link>
          <Link to="/compare" className="text-muted transition hover:text-chalk">Compare fighters</Link>
        </nav>
        <nav className="flex flex-col gap-2 text-sm">
          <span className="eyebrow mb-1">The system</span>
          <Link to="/methodology" className="text-muted transition hover:text-chalk">How ranking works</Link>
          <Link to="/results" className="text-muted transition hover:text-chalk">All results</Link>
          <Link to="/events" className="text-muted transition hover:text-chalk">Events</Link>
          <Link to="/about" className="text-muted transition hover:text-chalk">About FIGHTRANK</Link>
          <Link to="/partners" className="text-muted transition hover:text-chalk">Partners</Link>
          <Link to="/admin" className="text-muted transition hover:text-chalk">Administration</Link>
          <span className="text-faint">
            {mode === 'supabase' ? 'Supabase PostgreSQL' : 'Local PostgreSQL (demo)'}
          </span>
        </nav>
      </div>
    </footer>
  )
}
