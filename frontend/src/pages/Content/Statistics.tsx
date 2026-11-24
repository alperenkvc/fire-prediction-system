import { useState } from 'react'
import StatCard, { type StatCardProps } from '../../components/Cards/StatCard'
import CustomLineChart, {
  type RiskDataPoint,
  type RiskTimeRange,
} from '../../components/Charts/CustomLineChart'

const MOCK_STATISTICS: StatCardProps[] = [
  {
    title: 'Ortalama Yangın Risk Skoru',
    value: 68,
    unit: '/ 100',
    description: 'Adana geneli güncel nihai risk ortalaması.',
    trend: '+4.2% (24s)',
  },
  {
    title: 'Yüksek Riskli Bölgeler',
    value: 12,
    unit: 'Bölge',
    description: 'Yüksek ve kritik risk sınıfında yer alan izleme alanları.',
    trend: '3 yeni uyarı',
  },
  {
    title: 'En Yüksek Riskli Bölge',
    value: 89,
    unit: '/ 100',
    description: 'Aladağ',
    trend: '+2.5% (24s)',
  },
]

const MOCK_RISK_TREND: Record<RiskTimeRange, RiskDataPoint[]> = {
  '24h': [
    { timestamp: '2026-11-24T01:00:00+03:00', riskScore: 44 },
    { timestamp: '2026-11-24T02:00:00+03:00', riskScore: 42 },
    { timestamp: '2026-11-24T03:00:00+03:00', riskScore: 40 },
    { timestamp: '2026-11-24T04:00:00+03:00', riskScore: 39 },
    { timestamp: '2026-11-24T05:00:00+03:00', riskScore: 38 },
    { timestamp: '2026-11-24T06:00:00+03:00', riskScore: 41 },
    { timestamp: '2026-11-24T07:00:00+03:00', riskScore: 45 },
    { timestamp: '2026-11-24T08:00:00+03:00', riskScore: 51 },
    { timestamp: '2026-11-24T09:00:00+03:00', riskScore: 56 },
    { timestamp: '2026-11-24T10:00:00+03:00', riskScore: 62 },
    { timestamp: '2026-11-24T11:00:00+03:00', riskScore: 67 },
    { timestamp: '2026-11-24T12:00:00+03:00', riskScore: 73 },
    { timestamp: '2026-11-24T13:00:00+03:00', riskScore: 78 },
    { timestamp: '2026-11-24T14:00:00+03:00', riskScore: 82 },
    { timestamp: '2026-11-24T15:00:00+03:00', riskScore: 84 },
    { timestamp: '2026-11-24T16:00:00+03:00', riskScore: 81 },
    { timestamp: '2026-11-24T17:00:00+03:00', riskScore: 76 },
    { timestamp: '2026-11-24T18:00:00+03:00', riskScore: 71 },
    { timestamp: '2026-11-24T19:00:00+03:00', riskScore: 66 },
    { timestamp: '2026-11-24T20:00:00+03:00', riskScore: 62 },
    { timestamp: '2026-11-24T21:00:00+03:00', riskScore: 58 },
    { timestamp: '2026-11-24T22:00:00+03:00', riskScore: 54 },
    { timestamp: '2026-11-24T23:00:00+03:00', riskScore: 51 },
    { timestamp: '2026-11-25T00:00:00+03:00', riskScore: 49 },
  ],
  '7d': [
    { timestamp: '2026-11-18T12:00:00+03:00', riskScore: 54 },
    { timestamp: '2026-11-19T12:00:00+03:00', riskScore: 59 },
    { timestamp: '2026-11-20T12:00:00+03:00', riskScore: 63 },
    { timestamp: '2026-11-21T12:00:00+03:00', riskScore: 61 },
    { timestamp: '2026-11-22T12:00:00+03:00', riskScore: 66 },
    { timestamp: '2026-11-23T12:00:00+03:00', riskScore: 71 },
    { timestamp: '2026-11-24T12:00:00+03:00', riskScore: 68 },
  ],
}

export default function Statistics() {
  const [timeRange, setTimeRange] = useState<RiskTimeRange>('24h')

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-8">
      <section
        aria-label="İstatistik kartları"
        className="grid grid-cols-1 gap-6 md:grid-cols-3"
      >
        {MOCK_STATISTICS.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </section>

      <div className="mt-8">
        <CustomLineChart
          data={MOCK_RISK_TREND[timeRange]}
          range={timeRange}
          onRangeChange={setTimeRange}
        />
      </div>
    </main>
  )
}
