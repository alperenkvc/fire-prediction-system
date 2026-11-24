import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

export type RiskTimeRange = '24h' | '7d'

export interface RiskDataPoint {
  /** ISO-8601 timestamp from backend (e.g. "2026-11-24T14:00:00+03:00") */
  timestamp: string
  /** Overall average fire risk score (0–100) */
  riskScore: number
}

export interface CustomLineChartProps {
  title?: string
  subtitle?: string
  data: RiskDataPoint[]
  range: RiskTimeRange
  onRangeChange: (range: RiskTimeRange) => void
  isLoading?: boolean
}

const HOUR_FORMATTER = new Intl.DateTimeFormat('tr-TR', {
  hour: '2-digit',
  minute: '2-digit',
})

const DAY_FORMATTER = new Intl.DateTimeFormat('tr-TR', {
  day: 'numeric',
  month: 'short',
})

const TOOLTIP_HOUR_FORMATTER = new Intl.DateTimeFormat('tr-TR', {
  day: 'numeric',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
})

const TOOLTIP_DAY_FORMATTER = new Intl.DateTimeFormat('tr-TR', {
  weekday: 'short',
  day: 'numeric',
  month: 'long',
})

function formatAxisTime(timestamp: string, range: RiskTimeRange): string {
  const date = new Date(timestamp)
  if (Number.isNaN(date.getTime())) {
    return timestamp
  }
  return range === '24h'
    ? HOUR_FORMATTER.format(date)
    : DAY_FORMATTER.format(date)
}

function formatTooltipTime(timestamp: string, range: RiskTimeRange): string {
  const date = new Date(timestamp)
  if (Number.isNaN(date.getTime())) {
    return timestamp
  }
  return range === '24h'
    ? TOOLTIP_HOUR_FORMATTER.format(date)
    : TOOLTIP_DAY_FORMATTER.format(date)
}

function getRiskClassLabel(score: number): string {
  if (score < 20) return 'Çok Düşük'
  if (score < 40) return 'Düşük'
  if (score < 60) return 'Orta'
  if (score < 80) return 'Yüksek'
  return 'Kritik'
}

export default function CustomLineChart({
  title = 'Ortalama Yangın Risk Skoru Trendi',
  subtitle,
  data,
  range,
  onRangeChange,
  isLoading = false,
}: CustomLineChartProps) {
  const defaultSubtitle =
    range === '24h'
      ? 'Son 24 saatlik saatlik ortalama risk skoru (0–100)'
      : 'Son 7 günlük günlük ortalama risk skoru (0–100)'

  return (
    <section className="rounded-xl border-2 border-[#31572c] bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[#31572c]">{title}</h2>
          <p className="mt-0.5 text-sm text-slate-600">
            {subtitle ?? defaultSubtitle}
          </p>
        </div>

        <div
          role="group"
          aria-label="Zaman aralığı seçimi"
          className="inline-flex w-fit rounded-lg border border-[#31572c]/25 bg-[#31572c]/5 p-1"
        >
          <button
            type="button"
            onClick={() => onRangeChange('24h')}
            aria-pressed={range === '24h'}
            className={`cursor-pointer rounded-md px-3.5 py-1.5 text-sm font-medium transition-all duration-200 ${
              range === '24h'
                ? 'bg-[#31572c] text-white shadow-sm'
                : 'text-[#31572c] hover:bg-[#31572c]/10'
            }`}
          >
            24 Saatlik
          </button>
          <button
            type="button"
            onClick={() => onRangeChange('7d')}
            aria-pressed={range === '7d'}
            className={`cursor-pointer rounded-md px-3.5 py-1.5 text-sm font-medium transition-all duration-200 ${
              range === '7d'
                ? 'bg-[#31572c] text-white shadow-sm'
                : 'text-[#31572c] hover:bg-[#31572c]/10'
            }`}
          >
            7 Günlük
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-80 items-center justify-center text-sm text-slate-500">
          Veriler yükleniyor...
        </div>
      ) : data.length === 0 ? (
        <div className="flex h-80 items-center justify-center text-sm text-slate-500">
          Seçilen zaman aralığı için veri bulunamadı.
        </div>
      ) : (
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 10, right: 20, left: 0, bottom: 8 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="timestamp"
                tickFormatter={(value: string) => formatAxisTime(value, range)}
                tick={{ fill: '#475569', fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: '#cbd5e1' }}
                minTickGap={range === '24h' ? 24 : 12}
              />
              <YAxis
                domain={[0, 100]}
                ticks={[0, 20, 40, 60, 80, 100]}
                tick={{ fill: '#475569', fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: '#cbd5e1' }}
                width={36}
              />
              <Tooltip
                labelFormatter={(label) =>
                  formatTooltipTime(String(label ?? ''), range)
                }
                formatter={(value) => {
                  const score = Number(value)
                  return [
                    `${score} / 100 (${getRiskClassLabel(score)})`,
                    'Ortalama Risk Skoru',
                  ]
                }}
                contentStyle={{
                  borderRadius: '0.75rem',
                  border: '1px solid #31572c',
                  backgroundColor: '#ffffff',
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                }}
                labelStyle={{
                  color: '#0f172a',
                  fontWeight: 600,
                  marginBottom: '0.25rem',
                }}
                itemStyle={{
                  color: '#31572c',
                  fontWeight: 600,
                }}
              />
              <Line
                type="monotone"
                dataKey="riskScore"
                name="Ortalama Risk Skoru"
                stroke="#31572c"
                strokeWidth={3}
                dot={{ r: 3.5, fill: '#31572c', strokeWidth: 2, stroke: '#ffffff' }}
                activeDot={{ r: 6, fill: '#31572c', stroke: '#ffffff', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  )
}
