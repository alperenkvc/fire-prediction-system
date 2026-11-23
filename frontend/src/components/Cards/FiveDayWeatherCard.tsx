export type WeatherCondition =
  | 'sunny'
  | 'partly-cloudy'
  | 'cloudy'
  | 'rainy'
  | 'windy'
  | 'stormy'

export interface FiveDayWeatherCardProps {
  dateLabel: string
  condition: WeatherCondition
  conditionLabel: string
  dayTemp: number
  nightTemp: number
  iconSrc?: string
}

function WeatherIcon({
  condition,
  conditionLabel,
  iconSrc,
}: {
  condition: WeatherCondition
  conditionLabel: string
  iconSrc?: string
}) {
  if (iconSrc) {
    return (
      <img
        src={iconSrc}
        alt={conditionLabel}
        className="h-14 w-14 object-contain"
      />
    )
  }

  switch (condition) {
    case 'sunny':
      return (
        <svg
          viewBox="0 0 48 48"
          className="h-14 w-14 text-amber-300"
          fill="none"
          aria-label={conditionLabel}
          role="img"
        >
          <circle cx="24" cy="24" r="9" fill="currentColor" />
          <g stroke="currentColor" strokeWidth="3" strokeLinecap="round">
            <line x1="24" y1="5" x2="24" y2="10" />
            <line x1="24" y1="38" x2="24" y2="43" />
            <line x1="5" y1="24" x2="10" y2="24" />
            <line x1="38" y1="24" x2="43" y2="24" />
            <line x1="10.6" y1="10.6" x2="14.1" y2="14.1" />
            <line x1="33.9" y1="33.9" x2="37.4" y2="37.4" />
            <line x1="37.4" y1="10.6" x2="33.9" y2="14.1" />
            <line x1="14.1" y1="33.9" x2="10.6" y2="37.4" />
          </g>
        </svg>
      )
    case 'partly-cloudy':
      return (
        <svg
          viewBox="0 0 48 48"
          className="h-14 w-14"
          fill="none"
          aria-label={conditionLabel}
          role="img"
        >
          <circle cx="19" cy="18" r="7" className="fill-amber-300" />
          <g
            className="stroke-amber-300"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <line x1="19" y1="6" x2="19" y2="8.5" />
            <line x1="7" y1="18" x2="9.5" y2="18" />
            <line x1="10.5" y1="9.5" x2="12.5" y2="11.5" />
            <line x1="27.5" y1="9.5" x2="25.5" y2="11.5" />
          </g>
          <path
            d="M17 36h17a7 7 0 0 0 1.2-13.9A9 9 0 0 0 18 23.5a6.5 6.5 0 0 0-1 12.5Z"
            className="fill-white/90"
          />
        </svg>
      )
    case 'cloudy':
      return (
        <svg
          viewBox="0 0 48 48"
          className="h-14 w-14 text-slate-200"
          fill="none"
          aria-label={conditionLabel}
          role="img"
        >
          <path
            d="M14 35h20a8 8 0 0 0 1.4-15.9A10 10 0 0 0 16 17.5a7.5 7.5 0 0 0-2 17.5Z"
            fill="currentColor"
          />
        </svg>
      )
    case 'rainy':
      return (
        <svg
          viewBox="0 0 48 48"
          className="h-14 w-14"
          fill="none"
          aria-label={conditionLabel}
          role="img"
        >
          <path
            d="M14 30h20a7 7 0 0 0 1.2-13.9A9 9 0 0 0 16 14.5a6.5 6.5 0 0 0-2 15.5Z"
            className="fill-slate-200"
          />
          <g
            className="stroke-sky-300"
            strokeWidth="2.8"
            strokeLinecap="round"
          >
            <line x1="17" y1="34" x2="15" y2="40" />
            <line x1="24" y1="34" x2="22" y2="40" />
            <line x1="31" y1="34" x2="29" y2="40" />
          </g>
        </svg>
      )
    case 'windy':
      return (
        <svg
          viewBox="0 0 48 48"
          className="h-14 w-14 text-sky-200"
          fill="none"
          aria-label={conditionLabel}
          role="img"
        >
          <g
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M8 19h22a4 4 0 1 0-4-4" />
            <path d="M8 26h28a4 4 0 1 1-4 4" />
            <path d="M8 33h14a3 3 0 1 1-3 3" />
          </g>
        </svg>
      )
    case 'stormy':
      return (
        <svg
          viewBox="0 0 48 48"
          className="h-14 w-14"
          fill="none"
          aria-label={conditionLabel}
          role="img"
        >
          <path
            d="M14 29h20a7 7 0 0 0 1.2-13.9A9 9 0 0 0 16 13.5a6.5 6.5 0 0 0-2 15.5Z"
            className="fill-slate-300"
          />
          <path
            d="M25 30l-5 8h5l-2 7 8-10h-5l2-5Z"
            className="fill-amber-300"
          />
        </svg>
      )
  }
}

export default function FiveDayWeatherCard({
  dateLabel,
  condition,
  conditionLabel,
  dayTemp,
  nightTemp,
  iconSrc,
}: FiveDayWeatherCardProps) {
  return (
    <article className="flex cursor-pointer flex-col items-center justify-between gap-4 rounded-xl bg-[#023e8a]/85 px-4 py-6 text-white shadow-sm backdrop-blur-sm transition-all duration-200 hover:-translate-y-1 hover:bg-[#023e8a]/95 hover:shadow-lg">
      <h3 className="text-sm font-semibold tracking-wide text-white/95 sm:text-base">
        {dateLabel}
      </h3>

      <div className="flex flex-col items-center gap-1">
        <WeatherIcon
          condition={condition}
          conditionLabel={conditionLabel}
          iconSrc={iconSrc}
        />
        <span className="text-xs text-white/75">{conditionLabel}</span>
      </div>

      <div
        className="flex items-baseline justify-center gap-3"
        aria-label={`Gündüz ${dayTemp} derece, gece ${nightTemp} derece`}
      >
        <span className="text-2xl font-bold tracking-tight text-white">
          {dayTemp}°
        </span>
        <span className="text-lg font-medium text-white/65">{nightTemp}°</span>
      </div>
    </article>
  )
}
