import { NavLink, useLocation } from 'react-router-dom'

const NAV_ITEMS = [
  { label: 'Harita', to: '/', end: true },
  { label: 'Hava Durumu', to: '/weather', end: false },
  { label: 'İstatistikler', to: '/statistics', end: false },
] as const

function getNavbarBgClass(pathname: string): string {
  if (pathname === '/') {
    return 'bg-[#dc2f02]'
  }
  if (pathname.startsWith('/weather')) {
    return 'bg-[#023e8a]/85'
  }
  return 'bg-[#31572c]'
}

export default function Navbar() {
  const { pathname } = useLocation()
  const bgClass = getNavbarBgClass(pathname)

  return (
    <nav
      aria-label="Ana navigasyon"
      className={`w-full ${bgClass} text-white shadow-md transition-colors duration-300 ease-in-out`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-center px-6">
        <div className="grid w-full max-w-lg grid-cols-3 items-center gap-2 sm:gap-4">
          {NAV_ITEMS.map(({ label, to, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                [
                  'cursor-pointer rounded-md px-3 py-2 text-center text-sm font-medium tracking-wide whitespace-nowrap text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/15 focus:outline-none focus-visible:bg-white/15 focus-visible:ring-2 focus-visible:ring-white/80 active:translate-y-0 sm:px-4 sm:text-base',
                  isActive ? 'bg-white/20' : '',
                ].join(' ')
              }
            >
              {label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  )
}
