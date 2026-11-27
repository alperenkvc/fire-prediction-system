import { useEffect, useState } from 'react'
import MapCanvas, {
  type ClickedCoordinate,
} from '../../components/Canvas/MapCanvas'
import LeftSidePanelCard from '../../components/Cards/LeftSidePanelCard'
import SpreadPeriodModal, {
  type SpreadPeriodHours,
} from '../../components/Modals/SpreadPeriodModal'
import {
  fetchStaticRiskByCoordinates,
  getRegionNameByCoordinates,
  type StaticRiskResponse,
} from '../../services/RiskService'
import {
  fetchFireSpreadSimulation,
  type FireSpreadFeatureCollection,
} from '../../services/SimulationService'
import {
  fetchOptimalRoute,
  MOCK_FIRE_STATIONS,
  type OptimalRouteFeatureCollection,
} from '../../services/RouteService'

const RISK_COOLDOWN_MS = 60_000
const ROUTE_COOLDOWN_MS = 60_000
const SPREAD_COOLDOWN_MS = 10_000

function getCoordinateKey(point: ClickedCoordinate): string {
  return `${point.lat.toFixed(6)},${point.lng.toFixed(6)}`
}

export default function Home() {
  const [selectedPoint, setSelectedPoint] = useState<ClickedCoordinate | null>(
    null,
  )
  const [riskData, setRiskData] = useState<StaticRiskResponse | null>(null)
  const [hasCalculatedRisk, setHasCalculatedRisk] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSpreadLoading, setIsSpreadLoading] = useState(false)
  const [isRouteLoading, setIsRouteLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSpreadModalOpen, setIsSpreadModalOpen] = useState(false)
  const [selectedSpreadPeriod, setSelectedSpreadPeriod] =
    useState<SpreadPeriodHours | null>(null)
  const [spreadGeoJson, setSpreadGeoJson] =
    useState<FireSpreadFeatureCollection | null>(null)
  const [optimalRouteGeoJson, setOptimalRouteGeoJson] =
    useState<OptimalRouteFeatureCollection | null>(null)
  const [spreadCooldownEnd, setSpreadCooldownEnd] = useState(0)
  const [cooldownEndsByCoord, setCooldownEndsByCoord] = useState<
    Record<string, number>
  >({})
  const [routeCooldownEndsByCoord, setRouteCooldownEndsByCoord] = useState<
    Record<string, number>
  >({})
  const [now, setNow] = useState(() => Date.now())

  const selectedCoordKey = selectedPoint
    ? getCoordinateKey(selectedPoint)
    : null
  const activeCooldownEnd = selectedCoordKey
    ? (cooldownEndsByCoord[selectedCoordKey] ?? 0)
    : 0
  const activeRouteCooldownEnd = selectedCoordKey
    ? (routeCooldownEndsByCoord[selectedCoordKey] ?? 0)
    : 0
  const cooldownSeconds =
    activeCooldownEnd > now
      ? Math.ceil((activeCooldownEnd - now) / 1000)
      : 0
  const routeCooldownSeconds =
    activeRouteCooldownEnd > now
      ? Math.ceil((activeRouteCooldownEnd - now) / 1000)
      : 0
  const spreadCooldownSeconds =
    spreadCooldownEnd > now
      ? Math.ceil((spreadCooldownEnd - now) / 1000)
      : 0

  useEffect(() => {
    if (
      cooldownSeconds <= 0 &&
      routeCooldownSeconds <= 0 &&
      spreadCooldownSeconds <= 0
    ) {
      return
    }

    const timer = window.setInterval(() => {
      setNow(Date.now())
    }, 1000)

    return () => window.clearInterval(timer)
  }, [cooldownSeconds, routeCooldownSeconds, spreadCooldownSeconds])

  function handlePointSelect(point: ClickedCoordinate) {
    setSelectedPoint(point)
    setRiskData(null)
    setHasCalculatedRisk(false)
    setError(null)
    setIsSpreadModalOpen(false)
    setSelectedSpreadPeriod(null)
    setSpreadGeoJson(null)
    setOptimalRouteGeoJson(null)
    setNow(Date.now())
  }

  async function handleCalculateRisk() {
    if (!selectedPoint || !selectedCoordKey || isLoading || cooldownSeconds > 0)
      return

    const currentTime = Date.now()
    setNow(currentTime)
    setIsLoading(true)
    setError(null)
    setCooldownEndsByCoord((prev) => ({
      ...prev,
      [selectedCoordKey]: currentTime + RISK_COOLDOWN_MS,
    }))

    try {
      const result = await fetchStaticRiskByCoordinates(
        selectedPoint.lat,
        selectedPoint.lng,
      )
      setRiskData(result)
      setHasCalculatedRisk(true)
    } catch {
      setError('Seçilen bölgenin risk skoru alınamadı.')
      setRiskData(null)
      setHasCalculatedRisk(false)
    } finally {
      setIsLoading(false)
    }
  }

  function handleClearSelection() {
    setSelectedPoint(null)
    setRiskData(null)
    setHasCalculatedRisk(false)
    setError(null)
    setIsSpreadModalOpen(false)
    setSelectedSpreadPeriod(null)
    setSpreadGeoJson(null)
    setOptimalRouteGeoJson(null)
  }

  function handleOpenSpreadSimulation() {
    if (!hasCalculatedRisk) return
    setIsSpreadModalOpen(true)
  }

  async function handleOptimalRoute() {
    if (
      !selectedPoint ||
      !selectedCoordKey ||
      !hasCalculatedRisk ||
      isRouteLoading ||
      routeCooldownSeconds > 0
    ) {
      return
    }

    const currentTime = Date.now()
    setNow(currentTime)
    setIsRouteLoading(true)
    setError(null)
    setRouteCooldownEndsByCoord((prev) => ({
      ...prev,
      [selectedCoordKey]: currentTime + ROUTE_COOLDOWN_MS,
    }))

    try {
      const routeGeoJson = await fetchOptimalRoute(
        selectedPoint.lat,
        selectedPoint.lng,
      )
      setOptimalRouteGeoJson(routeGeoJson)
    } catch {
      setError('Optimum müdahale rotası oluşturulamadı.')
    } finally {
      setIsRouteLoading(false)
    }
  }

  async function handleSelectSpreadPeriod(hours: SpreadPeriodHours) {
    if (!selectedPoint || isSpreadLoading || spreadCooldownSeconds > 0) return

    const currentTime = Date.now()
    setNow(currentTime)
    setIsSpreadLoading(true)
    setError(null)
    setSelectedSpreadPeriod(hours)
    setSpreadCooldownEnd(currentTime + SPREAD_COOLDOWN_MS)

    try {
      const geoJson = await fetchFireSpreadSimulation(
        selectedPoint.lat,
        selectedPoint.lng,
        hours,
      )
      setSpreadGeoJson(geoJson)
    } catch {
      setError('Yayılım simülasyonu oluşturulamadı.')
    } finally {
      setIsSpreadLoading(false)
    }
  }

  const regionName = selectedPoint
    ? getRegionNameByCoordinates(selectedPoint.lat)
    : null
  const spreadSummary = spreadGeoJson?.features[0]?.properties ?? null
  const routeSummary = optimalRouteGeoJson?.features[0]?.properties ?? null

  return (
    <main className="relative min-h-0 w-full flex-1 overflow-hidden">
      <MapCanvas
        selectedPoint={selectedPoint}
        fireStations={MOCK_FIRE_STATIONS}
        spreadGeoJson={spreadGeoJson}
        optimalRouteGeoJson={optimalRouteGeoJson}
        onPointSelect={handlePointSelect}
      />

      <LeftSidePanelCard
        selectedPoint={selectedPoint}
        regionName={regionName}
        riskData={riskData}
        spreadSummary={spreadSummary}
        routeSummary={routeSummary}
        isLoading={isLoading}
        isSpreadLoading={isSpreadLoading}
        isRouteLoading={isRouteLoading}
        error={error}
        cooldownSeconds={cooldownSeconds}
        routeCooldownSeconds={routeCooldownSeconds}
        hasCalculatedRisk={hasCalculatedRisk}
        onCalculateRisk={handleCalculateRisk}
        onSpreadSimulation={handleOpenSpreadSimulation}
        onOptimalRoute={handleOptimalRoute}
        onClearSelection={handleClearSelection}
      />

      <SpreadPeriodModal
        isOpen={isSpreadModalOpen}
        selectedPeriod={selectedSpreadPeriod}
        cooldownSeconds={spreadCooldownSeconds}
        onSelectPeriod={handleSelectSpreadPeriod}
        onClose={() => setIsSpreadModalOpen(false)}
      />
    </main>
  )
}
