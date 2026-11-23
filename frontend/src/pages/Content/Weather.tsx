import FiveDayWeatherCard, {
  type FiveDayWeatherCardProps,
} from '../../components/Cards/FiveDayWeatherCard'
import TodayWeatherDetailCard, {
  type TodayWeatherDetailCardProps,
} from '../../components/Cards/TodayWeatherDetailCard'

interface NextHourWeather {
  tempC: number
  humidity: number
  windSpeedKmh: number
  windDirectionDeg: number
}

interface TodayWeatherSummary {
  wind: { max: number; avg: number; min: number }
  temp: { max: number; avg: number; min: number }
  rainMm: number
  humidity: { max: number; avg: number; min: number }
  sunrise: string
  sunset: string
  maxUv: number
}

const COMPASS_DIRECTIONS = ['K', 'KD', 'D', 'GD', 'G', 'GB', 'B', 'KB'] as const

function getWindDirectionLabel(deg: number): string {
  const normalized = ((deg % 360) + 360) % 360
  const index = Math.round(normalized / 45) % 8
  return COMPASS_DIRECTIONS[index]
}

function getUvLevelLabel(uv: number): string {
  if (uv <= 2) return 'Düşük'
  if (uv <= 5) return 'Orta'
  if (uv <= 7) return 'Yüksek'
  if (uv <= 10) return 'Çok Yüksek'
  return 'Aşırı'
}

const MOCK_NEXT_HOUR_WEATHER: NextHourWeather = {
  tempC: 23,
  humidity: 42,
  windSpeedKmh: 18,
  windDirectionDeg: 45,
}

const MOCK_FIVE_DAY_WEATHER: FiveDayWeatherCardProps[] = [
  {
    dateLabel: 'Bugün',
    condition: 'sunny',
    conditionLabel: 'Güneşli',
    dayTemp: 24,
    nightTemp: 13,
  },
  {
    dateLabel: 'Paz 22',
    condition: 'partly-cloudy',
    conditionLabel: 'Parçalı Bulutlu',
    dayTemp: 23,
    nightTemp: 12,
  },
  {
    dateLabel: 'Pzt 23',
    condition: 'windy',
    conditionLabel: 'Rüzgarlı',
    dayTemp: 21,
    nightTemp: 11,
  },
  {
    dateLabel: 'Sal 24',
    condition: 'cloudy',
    conditionLabel: 'Bulutlu',
    dayTemp: 20,
    nightTemp: 10,
  },
  {
    dateLabel: 'Çar 25',
    condition: 'rainy',
    conditionLabel: 'Yağmurlu',
    dayTemp: 18,
    nightTemp: 9,
  },
]

const MOCK_TODAY_SUMMARY: TodayWeatherSummary = {
  wind: { max: 26, avg: 17, min: 9 },
  temp: { max: 24, avg: 19, min: 13 },
  rainMm: 0,
  humidity: { max: 58, avg: 44, min: 31 },
  sunrise: '07:14',
  sunset: '17:26',
  maxUv: 5,
}

const TODAY_DETAIL_CARDS: TodayWeatherDetailCardProps[] = [
  {
    title: 'Rüzgar Hızı',
    icon: 'wind',
    metrics: [
      { label: 'En Yüksek', value: `${MOCK_TODAY_SUMMARY.wind.max} km/s` },
      { label: 'Ortalama', value: `${MOCK_TODAY_SUMMARY.wind.avg} km/s` },
      { label: 'En Düşük', value: `${MOCK_TODAY_SUMMARY.wind.min} km/s` },
    ],
  },
  {
    title: 'Sıcaklık',
    icon: 'temperature',
    metrics: [
      { label: 'En Yüksek', value: `${MOCK_TODAY_SUMMARY.temp.max}°C` },
      { label: 'Ortalama', value: `${MOCK_TODAY_SUMMARY.temp.avg}°C` },
      { label: 'En Düşük', value: `${MOCK_TODAY_SUMMARY.temp.min}°C` },
    ],
  },
  {
    title: 'Ortalama Yağış Miktarı (Metrekare Başına)',
    icon: 'rain',
    primaryValue: `${MOCK_TODAY_SUMMARY.rainMm} mm`,
    note:
      MOCK_TODAY_SUMMARY.rainMm === 0
        ? 'Bugün yağış kaydedilmedi.'
        : 'Günlük toplam yağış miktarı.',
  },
  {
    title: 'Nem Oranı',
    icon: 'humidity',
    metrics: [
      { label: 'En Yüksek', value: `%${MOCK_TODAY_SUMMARY.humidity.max}` },
      { label: 'Ortalama', value: `%${MOCK_TODAY_SUMMARY.humidity.avg}` },
      { label: 'En Düşük', value: `%${MOCK_TODAY_SUMMARY.humidity.min}` },
    ],
  },
  {
    title: 'Gün Doğumu ve Gün Batımı',
    icon: 'sun-cycle',
    metrics: [
      { label: 'Gün Doğumu', value: MOCK_TODAY_SUMMARY.sunrise },
      { label: 'Gün Batımı', value: MOCK_TODAY_SUMMARY.sunset },
    ],
  },
  {
    title: 'Günlük En Yüksek UV',
    icon: 'uv',
    primaryValue: `${MOCK_TODAY_SUMMARY.maxUv}`,
    note: `UV Seviyesi: ${getUvLevelLabel(MOCK_TODAY_SUMMARY.maxUv)}`,
  },
]

export default function Weather() {
  const windDirectionLabel = getWindDirectionLabel(
    MOCK_NEXT_HOUR_WEATHER.windDirectionDeg,
  )

  return (
    <div className="flex-1 bg-white">
      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-[#023e8a]">
            Sonraki Saat
          </h1>

          <p className="mt-1 text-2xl font-bold tracking-tight text-[#023e8a]">
            {MOCK_NEXT_HOUR_WEATHER.tempC}°C
          </p>

          <div className="mt-2.5 flex flex-wrap items-center gap-6 text-sm font-medium text-[#0077b6]">
            <span className="inline-flex items-center gap-1.5" title="Nem">
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
              </svg>
              <span>%{MOCK_NEXT_HOUR_WEATHER.humidity}</span>
            </span>

            <span
              className="inline-flex items-center gap-1.5"
              title={`Rüzgar: ${MOCK_NEXT_HOUR_WEATHER.windSpeedKmh} km/s ${windDirectionLabel}`}
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 shrink-0 transition-transform duration-300"
                style={{
                  transform: `rotate(${MOCK_NEXT_HOUR_WEATHER.windDirectionDeg}deg)`,
                }}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 19V5" />
                <path d="M6 11l6-6 6 6" />
              </svg>
              <span>
                {MOCK_NEXT_HOUR_WEATHER.windSpeedKmh} km/s {windDirectionLabel}
              </span>
            </span>
          </div>
        </div>

        <section aria-label="Beş Günlük Tahmin">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-[#023e8a]">
            Beş Günlük Tahmin
          </h2>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {MOCK_FIVE_DAY_WEATHER.map((forecast) => (
              <FiveDayWeatherCard key={forecast.dateLabel} {...forecast} />
            ))}
          </div>
        </section>

        <section aria-label="Bugün" className="mt-10">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-[#023e8a]">
            Bugün
          </h2>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {TODAY_DETAIL_CARDS.map((card) => (
              <TodayWeatherDetailCard key={card.title} {...card} />
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
