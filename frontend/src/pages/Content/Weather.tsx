import DailyWeatherCard, {
  type DailyWeatherCardProps,
} from '../../components/Cards/DailyWeatherCard'

const MOCK_DAILY_WEATHER: DailyWeatherCardProps[] = [
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

export default function Weather() {
  return (
    <div className="flex-1 bg-white">
      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-[#023e8a]">
            Hava Durumu
          </h1>
          <p className="mt-1.5 text-sm text-[#0077b6]">
            Adana için 5 günlük hava durumu tahmini.
          </p>
        </div>

        <section
          aria-label="5 günlük hava durumu kartları"
          className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5"
        >
          {MOCK_DAILY_WEATHER.map((forecast) => (
            <DailyWeatherCard key={forecast.dateLabel} {...forecast} />
          ))}
        </section>
      </main>
    </div>
  )
}
