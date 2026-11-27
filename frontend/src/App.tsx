import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomeLayout from './components/Layouts/HomeLayout'

const Home = lazy(() => import('./pages/Content/Home'))
const Weather = lazy(() => import('./pages/Content/Weather'))
const Statistics = lazy(() => import('./pages/Content/Statistics'))

function RouteFallback() {
  return (
    <div className="flex flex-1 items-center justify-center text-sm text-slate-500">
      Yükleniyor...
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<HomeLayout />}>
          <Route
            path="/"
            element={
              <Suspense fallback={<RouteFallback />}>
                <Home />
              </Suspense>
            }
          />
          <Route
            path="/weather"
            element={
              <Suspense fallback={<RouteFallback />}>
                <Weather />
              </Suspense>
            }
          />
          <Route
            path="/statistics"
            element={
              <Suspense fallback={<RouteFallback />}>
                <Statistics />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
