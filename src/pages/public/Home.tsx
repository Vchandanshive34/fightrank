import { Link } from 'react-router-dom'
import { ArrowRight, Crown, TrendingUp } from 'lucide-react'
import { useApp, useRepository } from '@/hooks/useData'
import { useAsync } from '@/hooks/useAsync'
import { FighterAvatar } from '@/components/FighterAvatar'
import { MoversList } from '@/components/MoversList'
import { FightRow } from '@/components/FightRow'
import { Movement } from '@/components/Movement'
import {
  Button,
  Container,
  EmptyState,
  ErrorState,
  SectionHeader,
  Skeleton,
} from '@/components/ui'
import type { DashboardStats } from '@/data/repository'
import { flagOf, record, shortDate } from '@/lib/format'

export default function Home() {
  const repository = useRepository()
  const { revision } = useApp()

  const { data, error, loading, reload } = useAsync(
    async () => {
      const [champions, p4p, movers, results, upcoming, stats] = await Promise.all([
        repository.listChampions(),
        repository.listP4P(5),
        repository.listMovers(6),
        repository.listFights({ status: 'completed', limit: 6 }),
        repository.listEvents({ status: 'scheduled', pageSize: 3 }),
        repository.dashboardStats(),
      ])
      return { champions, p4p, movers, results, upcoming: upcoming.rows, stats }
    },
    [repository, revision],
  )

  if (error) {
    return (
      <Container className="py-16">
        <ErrorState error={error} onRetry={reload} />
      </Container>
    )
  }

  return (
    <>
      <Hero stats={data?.stats ?? null} />

      <Container className="py-12 sm:py-16">
        <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr] lg:gap-14">
          <div className="min-w-0 space-y-14">
            <section>
              <SectionHeader
                eyebrow="Reigning"
                title="Champions"
                action={
                  <Link to="/rankings" className="text-sm text-muted transition hover:text-signal">
                    All divisions →
                  </Link>
                }
              />
              {loading ? (
                <div className="grid gap-px sm:grid-cols-2">
                  {Array.from({ length: 6 }, (_, i) => (
                    <Skeleton key={i} className="h-20" />
                  ))}
                </div>
              ) : data && data.champions.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {data.champions.map((row) => (
                    <Link
                      key={row.fighterId}
                      to={`/fighters/${row.fighter.slug}`}
                      className="group flex items-center gap-3 border border-line bg-ink-800 p-3 transition-colors hover:border-signal/50"
                    >
                      <FighterAvatar
                        id={row.fighterId}
                        name={row.fighter.displayName}
                        photoUrl={row.fighter.photoUrl}
                        size="md"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="eyebrow flex items-center gap-1 text-[0.58rem] text-signal">
                          <Crown className="size-3" />
                          <span className="text-faint">{row.fighter.disciplineCode}</span>
                          {row.fighter.divisionName}
                        </div>
                        <div className="truncate font-display text-lg font-bold uppercase text-chalk transition-colors group-hover:text-signal">
                          {row.fighter.displayName}
                        </div>
                        <div className="truncate text-xs text-muted">
                          {flagOf(row.fighter.countryCode)} {record(row.fighter)} · rating{' '}
                          {Math.round(row.rating)}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="No champions yet"
                  description="A champion is crowned the moment a title fight result is recorded."
                />
              )}
            </section>

            <section>
              <SectionHeader
                eyebrow="Just recorded"
                title="Latest results"
                action={
                  <Link to="/events" className="text-sm text-muted transition hover:text-signal">
                    All events →
                  </Link>
                }
              />
              {loading ? (
                <div className="space-y-px">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Skeleton key={i} className="h-20" />
                  ))}
                </div>
              ) : data && data.results.length > 0 ? (
                <div className="border-t border-line-soft">
                  {data.results.map((fight) => (
                    <FightRow key={fight.id} fight={fight} showEvent />
                  ))}
                </div>
              ) : (
                <EmptyState title="No results recorded yet" />
              )}
            </section>
          </div>

          <div className="min-w-0 space-y-14">
            <section>
              <SectionHeader
                eyebrow="Across every division"
                title="Pound for pound"
                action={
                  <Link to="/p4p" className="text-sm text-muted transition hover:text-signal">
                    Full list →
                  </Link>
                }
              />
              {loading ? (
                <div className="space-y-px">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Skeleton key={i} className="h-14" />
                  ))}
                </div>
              ) : (
                <ul>
                  {(data?.p4p ?? []).map((row) => (
                    <li key={row.fighterId} className="border-b border-line-soft last:border-b-0">
                      <Link
                        to={`/fighters/${row.fighter.slug}`}
                        className="group flex items-center gap-3 py-2.5"
                      >
                        <span className="numeral w-7 text-center text-xl text-signal">
                          {row.position}
                        </span>
                        <FighterAvatar
                          id={row.fighterId}
                          name={row.fighter.displayName}
                          photoUrl={row.fighter.photoUrl}
                          size="sm"
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium text-chalk transition-colors group-hover:text-signal">
                            {row.fighter.displayName}
                          </span>
                          <span className="block truncate text-xs text-muted">
                            {row.fighter.divisionName} · {record(row.fighter)}
                          </span>
                        </span>
                        <Movement movement={row.movement} label={row.movementLabel} size="sm" />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section>
              <SectionHeader
                eyebrow="Since the last card"
                title="Biggest movers"
                action={
                  <Link to="/movers" className="text-sm text-muted transition hover:text-signal">
                    All movement →
                  </Link>
                }
              />
              {loading ? (
                <div className="space-y-px">
                  {Array.from({ length: 4 }, (_, i) => (
                    <Skeleton key={i} className="h-16" />
                  ))}
                </div>
              ) : (
                <MoversList movers={data?.movers ?? []} />
              )}
            </section>

            <section>
              <SectionHeader eyebrow="Next up" title="Upcoming" />
              {loading ? (
                <Skeleton className="h-28" />
              ) : (data?.upcoming.length ?? 0) === 0 ? (
                <EmptyState title="Nothing scheduled" description="Add an event in the admin panel." />
              ) : (
                <ul className="space-y-3">
                  {data?.upcoming.map((event) => (
                    <li key={event.id}>
                      <Link
                        to={`/events/${event.slug}`}
                        className="group block border border-line bg-ink-800 p-4 transition-colors hover:border-signal/50"
                      >
                        <div className="eyebrow text-[0.58rem] text-signal">
                          {shortDate(event.eventDate)}
                        </div>
                        <div className="mt-1 font-display text-xl font-bold uppercase text-chalk transition-colors group-hover:text-signal">
                          {event.name}
                        </div>
                        {event.mainEventLabel ? (
                          <div className="mt-1 truncate text-sm text-chalk-dim">
                            {event.mainEventLabel}
                          </div>
                        ) : null}
                        <div className="mt-1 text-xs text-muted">
                          {[event.venue, event.city].filter(Boolean).join(' · ')} ·{' '}
                          {event.boutCount} bouts
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        </div>
      </Container>

      <MethodologyStrip />
    </>
  )
}

function Hero({ stats }: { stats: DashboardStats | null }) {
  const tiles = [
    { label: 'Disciplines', value: stats?.disciplines },
    { label: 'Ranked athletes', value: stats?.fighters },
    { label: 'Recorded bouts', value: stats?.fights },
    // One division per discipline is the pound-for-pound list, not a weight class.
    {
      label: 'Divisions',
      value: stats ? stats.divisions - stats.disciplines : undefined,
    },
    { label: 'Reigning champions', value: stats?.champions },
  ]
  return (
    <section className="relative overflow-hidden border-b border-line">
      <div className="hairline-grid absolute inset-0 opacity-60" aria-hidden />
      <div
        className="absolute inset-0"
        aria-hidden
        style={{
          background:
            'radial-gradient(70% 90% at 15% 0%, rgba(255,181,37,0.12) 0%, transparent 60%)',
        }}
      />
      <Container className="relative py-16 sm:py-24 lg:py-28">
        <div className="max-w-4xl">
          <div className="eyebrow animate-fade mb-5 text-signal">
            Transparent competitive rankings
          </div>
          <h1 className="animate-rise text-[13vw] leading-[0.86] text-chalk sm:text-6xl lg:text-8xl">
            Every fight
            <br />
            changes the
            <br />
            <span className="text-signal">ranking.</span>
          </h1>
          <p className="animate-fade mt-6 max-w-xl text-base text-chalk-dim sm:text-lg">
            Transparent combat-sports rankings powered by performance, opposition and momentum —
            across mixed martial arts, grappling, wrestling, Muay Thai and kickboxing. Every
            position is calculated from recorded results, and every movement comes with its
            reasons.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/rankings">
              <Button variant="primary" size="lg" icon={<ArrowRight className="size-4" />}>
                View rankings
              </Button>
            </Link>
            <Link to="/disciplines">
              <Button variant="secondary" size="lg">
                Browse disciplines
              </Button>
            </Link>
          </div>
        </div>

        <dl className="mt-14 grid grid-cols-2 gap-px border border-line bg-line sm:mt-16 sm:grid-cols-5">
          {tiles.map((stat) => (
            <div key={stat.label} className="bg-ink-900 px-4 py-5">
              <dd className="numeral text-4xl leading-none text-chalk sm:text-5xl">
                {stat.value === undefined ? (
                  <span className="text-ink-500">&mdash;</span>
                ) : (
                  stat.value.toLocaleString('en-GB')
                )}
              </dd>
              <dt className="eyebrow mt-2 text-[0.58rem]">{stat.label}</dt>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  )
}

function MethodologyStrip() {
  const steps = [
    {
      n: '01',
      title: 'Who you beat',
      body: 'Every result is an Elo adjustment against the opponent’s actual rating — beating a better fighter is worth more, always.',
    },
    {
      n: '02',
      title: 'How strong they were',
      body: 'An opponent-quality multiplier scales the reward by where that opponent stood on the night, from champion down to unranked.',
    },
    {
      n: '03',
      title: 'How you won',
      body: 'Finishes carry a bonus. A decision win is never worth less than no win — the bonus only ever adds.',
    },
    {
      n: '04',
      title: 'Form, streaks, activity',
      body: 'Recent results, sustained winning and time since the last bout adjust the standing — each capped so none can dominate.',
    },
  ]

  return (
    <section className="border-t border-line bg-ink-850">
      <Container className="py-14 sm:py-20">
        <SectionHeader
          eyebrow="No opinion. No votes. No promotion."
          title="How a position is earned"
          action={
            <Link to="/methodology">
              <Button variant="secondary" size="sm" icon={<TrendingUp className="size-3.5" />}>
                Full methodology
              </Button>
            </Link>
          }
        />
        <div className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <div key={step.n} className="bg-ink-850 p-5">
              <div className="numeral text-3xl text-signal">{step.n}</div>
              <h3 className="mt-3 text-lg text-chalk">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{step.body}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
