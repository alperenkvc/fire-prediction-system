import type { ClickedCoordinate } from '../Canvas/MapCanvas'
import type { RiskClass, StaticRiskResponse } from '../../services/RiskService'

const RISK_BADGE_STYLES: Record<
  RiskClass,
  { label: string; className: string }
> = {
  VERY_LOW: { label: 'Çok Düşük', className: 'bg-emerald-100 text-emerald-800' },
  LOW: { label: 'Düşük', className: 'bg-lime-100 text-lime-800' },
  MODERATE: { label: 'Orta', className: 'bg-amber-100 text-amber-800' },
  HIGH: { label: 'Yüksek', className: 'bg-orange-100 text-orange-800' },
  CRITICAL: { label: 'Kritik', className: 'bg-red-100 text-red-800' },
}

export interface LeftSidePanelCardProps {
  selectedPoint: ClickedCoordinate | null
  regionName: string | null
  riskData: StaticRiskResponse | null
  isLoading: boolean
  error: string | null
  cooldownSeconds: number
  routeCooldownSeconds: number
  hasCalculatedRisk: boolean
  onCalculateRisk: () => void
  onSpreadSimulation?: () => void
  onOptimalRoute?: () => void
  onClearSelection: () => void
}

export default function LeftSidePanelCard({
  selectedPoint,
  regionName,
  riskData,
  isLoading,
  error,
  cooldownSeconds,
  routeCooldownSeconds,
  hasCalculatedRisk,
  onCalculateRisk,
  onSpreadSimulation,
  onOptimalRoute,
  onClearSelection,
}: LeftSidePanelCardProps) {
  const isRiskButtonDisabled = isLoading || cooldownSeconds > 0
  const areSecondaryActionsDisabled = !hasCalculatedRisk || isLoading

  return (
    <aside
      aria-live="polite"
      className="absolute top-4 left-4 z-10 w-80 max-w-[calc(100vw-2rem)] rounded-xl border border-slate-200 bg-white/95 p-5 shadow-xl backdrop-blur-sm"
    >
      {!selectedPoint ? (
        <p className="text-sm leading-relaxed text-slate-600">
          Risk analizini görmek için harita üzerinde bir noktaya tıklayın.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                {riskData?.regionName ?? regionName ?? 'Adana'}
              </h2>
              <p className="mt-0.5 font-mono text-xs text-slate-500">
                {selectedPoint.lat.toFixed(5)}° K, {selectedPoint.lng.toFixed(5)}° D
              </p>
            </div>
            <button
              type="button"
              onClick={onClearSelection}
              aria-label="Seçimi temizle"
              className="cursor-pointer rounded-md px-2 py-0.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
            >
              ✕
            </button>
          </div>

          {(isLoading || error || riskData) && (
            <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
              {isLoading && (
                <p className="text-sm text-slate-500">
                  Risk skoru hesaplanıyor...
                </p>
              )}

              {!isLoading && error && (
                <p className="text-sm text-red-600">{error}</p>
              )}

              {!isLoading && riskData && (
                <div className="flex items-baseline justify-between">
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
              )}
            </div>
          )}

          <div className="flex flex-col gap-2.5">
            <button
              type="button"
              disabled={isRiskButtonDisabled}
              onClick={onCalculateRisk}
              className="w-full cursor-pointer rounded-lg bg-[#dc2f02] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#b82702] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
            >
              {isLoading
                ? 'Hesaplanıyor...'
                : cooldownSeconds > 0
                  ? `Risk Hesapla (${cooldownSeconds}s)`
                  : 'Risk Hesapla'}
            </button>

            <button
              type="button"
              disabled={areSecondaryActionsDisabled}
              onClick={onSpreadSimulation}
              className="w-full cursor-pointer rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 transition-all duration-200 hover:border-[#dc2f02]/50 hover:bg-[#dc2f02]/5 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
            >
              Yayılım Simülasyonu
            </button>

            <button
              type="button"
              disabled={areSecondaryActionsDisabled || routeCooldownSeconds > 0}
              onClick={onOptimalRoute}
              className="w-full cursor-pointer rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 transition-all duration-200 hover:border-[#dc2f02]/50 hover:bg-[#dc2f02]/5 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
            >
              {routeCooldownSeconds > 0
                ? `Optimum Müdahale Rotası (${routeCooldownSeconds}s)`
                : 'Optimum Müdahale Rotası'}
            </button>
          </div>
        </div>
      )}
    </aside>
  )
}
