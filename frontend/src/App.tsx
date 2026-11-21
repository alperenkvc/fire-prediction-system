import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomeLayout from './components/Layouts/HomeLayout'
import Home from './pages/Content/Home'
import Statistics from './pages/Content/Statistics'
import Weather from './pages/Content/Weather'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<HomeLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/weather" element={<Weather />} />
          <Route path="/statistics" element={<Statistics />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
