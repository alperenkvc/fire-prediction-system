export interface StatCardProps {
  title: string
  value: string | number
  unit?: string
  description?: string
  trend?: string
}

export default function StatCard({
  title,
  value,
  unit,
  description,
  trend,
}: StatCardProps) {
  return (
    <article className="flex flex-col justify-between rounded-xl border-2 border-[#31572c] bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:ring-2 hover:ring-[#31572c]/20">
      <div>
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[#31572c]">
            {title}
          </h2>
          {trend && (
            <span className="shrink-0 rounded-full bg-[#31572c]/10 px-2.5 py-0.5 text-xs font-medium text-[#31572c]">
              {trend}
            </span>
          )}
        </div>

        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-4xl font-bold tracking-tight text-slate-900">
            {value}
          </span>
          {unit && (
            <span className="text-base font-medium text-slate-500">{unit}</span>
          )}
        </div>
      </div>

      {description && (
        <p className="mt-4 text-sm leading-relaxed text-slate-600">
          {description}
        </p>
      )}
    </article>
  )
}
