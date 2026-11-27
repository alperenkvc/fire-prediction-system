export type SpreadPeriodHours = 1 | 2 | 3

const SPREAD_PERIOD_OPTIONS: { hours: SpreadPeriodHours; label: string }[] = [
  { hours: 1, label: '1 Saat' },
  { hours: 2, label: '2 Saat' },
  { hours: 3, label: '3 Saat' },
]

export interface SpreadPeriodModalProps {
  isOpen: boolean
  selectedPeriod: SpreadPeriodHours | null
  cooldownSeconds: number
  onSelectPeriod: (hours: SpreadPeriodHours) => void
  onClose: () => void
}

export default function SpreadPeriodModal({
  isOpen,
  selectedPeriod,
  cooldownSeconds,
  onSelectPeriod,
  onClose,
}: SpreadPeriodModalProps) {
  if (!isOpen) return null

  const isDisabled = cooldownSeconds > 0

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="spread-period-modal-title"
      className="absolute bottom-6 left-1/2 z-20 w-fit max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-xl border border-slate-200 bg-white/95 px-6 py-4 shadow-xl backdrop-blur-sm"
    >
      <div className="mb-3 flex items-center justify-between gap-4">
        <h2
          id="spread-period-modal-title"
          className="text-sm font-semibold text-slate-900"
        >
          Ateş yayılım simülasyonu yapılacak periyodu seçin
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Kapat"
          className="cursor-pointer rounded-md px-2 py-0.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
        >
          ✕
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {SPREAD_PERIOD_OPTIONS.map(({ hours, label }) => {
          const isSelected = selectedPeriod === hours
          return (
            <button
              key={hours}
              type="button"
              disabled={isDisabled}
              aria-pressed={isSelected}
              onClick={() => onSelectPeriod(hours)}
              className={`cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200 disabled:cursor-not-allowed ${
                isSelected
                  ? 'bg-[#dc2f02] text-white shadow-sm disabled:opacity-75'
                  : 'border border-slate-300 bg-white text-slate-800 hover:border-[#dc2f02]/60 hover:bg-[#dc2f02]/5 disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400'
              }`}
            >
              {label}
            </button>
          )
        })}

        <span className="text-sm font-medium text-slate-500">
          (sonra){isDisabled ? ` · ${cooldownSeconds}s` : ''}
        </span>
      </div>
    </div>
  )
}
