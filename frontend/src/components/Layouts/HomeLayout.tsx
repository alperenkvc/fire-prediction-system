import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

export default function HomeLayout() {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <header className="shrink-0">
        <Navbar />
      </header>

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <Outlet />
      </div>

      {/* Room for future persistent components across all routes (e.g. Footer, AlertBanner, ToastContainer) */}
    </div>
  )
}
