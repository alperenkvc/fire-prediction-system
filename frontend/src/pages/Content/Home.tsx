import { useState } from 'react'
import MapCanvas, {
  type ClickedCoordinate,
} from '../../components/Canvas/MapCanvas'
import {
  fetchStaticRiskByCoordinates,
  type RiskClass,
  type StaticRiskResponse,
} from '../../services/RiskService'

const RISK_BADGE_STYLES: Record<RiskClass, { label: string; className: string }> = {
  VERY_LOW: { label: 'Çok Düşük', className: 'bg-emerald-100 text-emerald-800' },
  LOW: { label: 'Düşük', className: 'bg-lime-100 text-lime-800' },
  MODERATE: { label: 'Orta', className: 'bg-amber-100 text-amber-800' },
  HIGH: { label: 'Yüksek', className: 'bg-orange-100 text-orange-800' },
  CRITICAL: { label: 'Kritik', className: 'bg-red-100 text-red-800' },
}

export default function Home() {
  const [selectedPoint, setSelectedPoint] = useState<ClickedCoordinate | null>(null)
  const [riskData, setRiskData] = useState<StaticRiskResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handlePointSelect(point: ClickedCoordinate) {
    setSelectedPoint(point)
    setIsLoading(true)
    setError(null)

    try {
      const result = await fetchStaticRiskByCoordinates(point.lat, point.lng)
      setRiskData(result)
    } catch {
      setError('Seçilen bölgenin risk skoru alınamadı.')
      setRiskData(null)
    } finally {
      setIsLoading(false)
    }
  }

  function handleClearSelection() {
    setSelectedPoint(null)
    setRiskData(null)
    setError(null)
  }

  return (
    <main className="relative min-h-0 w-full flex-1 overflow-hidden">
      <MapCanvas
        selectedPoint={selectedPoint}
        onPointSelect={handlePointSelect}
      />

      {/* Google Maps-style floating inspector card */}
      {selectedPoint && (
        <aside
          aria-live="polite"
          className="absolute top-4 left-4 z-10 w-80 max-w-[calc(100vw-2rem)] rounded-xl border border-slate-200 bg-white/95 p-4 shadow-lg backdrop-blur-sm"
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Bölge Statik Risk Analizi
              </h2>
              <p className="mt-0.5 font-mono text-xs text-slate-500">
                {selectedPoint.lat.toFixed(5)}° K, {selectedPoint.lng.toFixed(5)}° D
              </p>
            </div>
            <button
              type="button"
              onClick={handleClearSelection}
              aria-label="Kapat"
              className="cursor-pointer rounded-md px-2 py-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            >
              ✕
            </button>
          </div>

          <div className="mt-3 border-t border-slate-100 pt-3">
            {isLoading && (
              <p className="text-sm text-slate-500">Risk skoru sorgulanıyor...</p>
            )}

            {error && <p className="text-sm text-red-600">{error}</p>}

            {!isLoading && riskData && (
              <div>
                <p className="text-xs font-medium text-slate-500">
                  {riskData.regionName}
                </p>
                <div className="mt-2 flex items-baseline justify-between">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-slate-900">
                      {riskData.staticRiskScore}
                    </span>
                    <span className="text-sm text-slate-500">/ 100</span>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${RISK_BADGE_STYLES[riskData.riskClass].className}`}
                  >
                    {RISK_BADGE_STYLES[riskData.riskClass].label}
                  </span>
                </div>
              </div>
            )}
          </div>
        </aside>
      )}
    </main>
  )
}