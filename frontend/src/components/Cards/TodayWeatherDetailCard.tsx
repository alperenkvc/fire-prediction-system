export type TodayWeatherIconType =
  | 'wind'
  | 'temperature'
  | 'rain'
  | 'humidity'
  | 'sun-cycle'
  | 'uv'

export interface WeatherDetailMetric {
  label: string
  value: string
}

export interface TodayWeatherDetailCardProps {
  title: string
  icon: TodayWeatherIconType
  primaryValue?: string
  note?: string
  metrics?: WeatherDetailMetric[]
}

function DetailIcon({ icon }: { icon: TodayWeatherIconType }) {
  switch (icon) {
    case 'wind':
      return (
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5 text-sky-200"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M9.59 4.59A2 2 0 1 1 11 8H2" />
          <path d="M12.59 19.41A2 2 0 1 0 14 16H2" />
          <path d="M17.73 7.73A2.5 2.5 0 1 1 19.5 12H2" />
        </svg>
      )
    case 'temperature':
      return (
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5 text-amber-300"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
        </svg>
      )
    case 'rain':
      return (
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5 text-sky-300"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
          <path d="M8 19v2" />
          <path d="M12 17v4" />
          <path d="M16 19v2" />
        </svg>
      )
    case 'humidity':
      return (
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5 text-sky-200"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
        </svg>
      )
    case 'sun-cycle':
      return (
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5 text-amber-300"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 2v4" />
          <path d="M4.93 10.93l1.41 1.41" />
          <path d="M2 18h2" />
          <path d="M20 18h2" />
          <path d="M19.07 10.93l-1.41 1.41" />
          <path d="M22 22H2" />
          <path d="M8 18a4 4 0 0 1 8 0" />
        </svg>
      )
    case 'uv':
      return (
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5 text-amber-300"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="M4.93 4.93l1.41 1.41" />
          <path d="M17.66 17.66l1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="M6.34 17.66l-1.41 1.41" />
          <path d="M19.07 4.93l-1.41 1.41" />
        </svg>
      )
  }
}

export default function TodayWeatherDetailCard({
  title,
  icon,
  primaryValue,
  note,
  metrics,
}: TodayWeatherDetailCardProps) {
  return (
    <article className="flex min-h-[156px] flex-col justify-between rounded-xl bg-[#023e8a]/85 p-6 text-white shadow-sm backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#023e8a]/95 hover:shadow-lg">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold tracking-wide text-white/90 sm:text-base">
          {title}
        </h3>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10">
          <DetailIcon icon={icon} />
        </span>
      </div>

      {primaryValue !== undefined && (
        <div className="mt-4">
          <p className="text-3xl font-bold tracking-tight text-white">
            {primaryValue}
          </p>
          {note && <p className="mt-1 text-xs text-white/75">{note}</p>}
        </div>
      )}

      {metrics && metrics.length > 0 && (
        <dl
          className={`mt-4 grid gap-3 ${
            metrics.length === 2 ? 'grid-cols-2' : 'grid-cols-3'
          }`}
        >
          {metrics.map(({ label, value }) => (
            <div
              key={label}
              className="rounded-lg bg-white/10 px-3 py-2.5 text-center"
            >
              <dt className="text-xs font-medium text-white/70">{label}</dt>
              <dd className="mt-1 text-lg font-bold tracking-tight text-white">
                {value}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </article>
  )
}
