import StatCard, { type StatCardProps } from '../../components/Cards/StatCard'

const MOCK_STATISTICS: StatCardProps[] = [
  {
    title: 'Ortalama Yangın Risk Skoru',
    value: 68,
    unit: '/ 100',
    description: 'Adana geneli güncel statik ve dinamik risk ortalaması.',
    trend: '+4.2% (24s)',
  },
  {
    title: 'Yüksek Riskli Bölge',
    value: 12,
    unit: 'Bölge',
    description: 'Yüksek ve kritik risk sınıfında yer alan izleme alanları.',
    trend: '3 yeni uyarı',
  },
  {
    title: 'Aktif Gözlem İstasyonu',
    value: 24,
    unit: '/ 26',
    description: 'Gerçek zamanlı sıcaklık, nem ve rüzgar verisi sağlayan istasyonlar.',
    trend: '%92.3 aktif',
  },
]

export default function Statistics() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900">İstatistikler</h1>
        <p className="mt-1 text-sm text-slate-600">
          Adana pilot bölgesi için özet orman yangını risk göstergeleri.
        </p>
      </div>

      <section
        aria-label="İstatistik kartları"
        className="grid grid-cols-1 gap-6 md:grid-cols-3"
      >
        {MOCK_STATISTICS.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </section>
    </main>
  )
}
