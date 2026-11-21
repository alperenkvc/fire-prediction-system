import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

export default function HomeLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <header>
        <Navbar />
      </header>

      <div className="flex-1">
        <Outlet />
      </div>

      {/* Room for future persistent components across all routes (e.g. Footer, AlertBanner, ToastContainer) */}
    </div>
  )
}
