import { useEffect, useRef, useState } from 'react'
import * as maplibregl from 'maplibre-gl'
import maplibreWorkerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url'
import Map, {
  Layer,
  Marker,
  NavigationControl,
  ScaleControl,
  Source,
  type ErrorEvent,
  type MapLayerMouseEvent,
} from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'
import type {
  FireSpreadFeature,
  FireSpreadFeatureCollection,
} from '../../services/SimulationService'
import type {
  FireStation,
  OptimalRouteFeatureCollection,
} from '../../services/RouteService'
import {
  ADANA_BORDER_GEOJSON,
  ADANA_OUTSIDE_MASK_GEOJSON,
  isPointInsideAdana,
} from '../../data/adanaBorder'

maplibregl.setWorkerUrl(maplibreWorkerUrl)

const SPREAD_ANIMATION_MS = 650

function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3
}

function interpolateRing(
  fromRing: [number, number][],
  toRing: [number, number][],
  progress: number,
): [number, number][] {
  const fromLast = fromRing.length - 1
  const toLast = toRing.length - 1
  if (fromLast <= 0 || toLast <= 0) return toRing

  return toRing.map(([toLng, toLat], idx) => {
    const mappedIdx = Math.round((idx / toLast) * fromLast)
    const [fromLng, fromLat] = fromRing[mappedIdx]
    return [
      fromLng + (toLng - fromLng) * progress,
      fromLat + (toLat - fromLat) * progress,
    ]
  })
}

function collapsedRingAt(
  point: ClickedCoordinate,
  length: number,
): [number, number][] {
  return Array.from({ length }, () => [point.lng, point.lat])
}

function getLargestFeature(
  collection: FireSpreadFeatureCollection | null,
): FireSpreadFeature | null {
  if (!collection || collection.features.length === 0) return null
  return collection.features.reduce((largest, current) =>
    current.properties.hours > largest.properties.hours ? current : largest,
  )
}

export interface ClickedCoordinate {
  lat: number
  lng: number
}

interface MapCanvasProps {
  selectedPoint: ClickedCoordinate | null
  fireStations?: FireStation[]
  spreadGeoJson?: FireSpreadFeatureCollection | null
  optimalRouteGeoJson?: OptimalRouteFeatureCollection | null
  onPointSelect: (point: ClickedCoordinate) => void
}

// Covers Adana province with enough horizontal margin for 16:9 widescreen viewports
const ADANA_MAX_BOUNDS: [number, number, number, number] = [
  33.8, // West lng
  36.3, // South lat
  37.0, // East lng
  38.6, // North lat
]

const ADANA_INITIAL_VIEW = {
  longitude: 35.3213,
  latitude: 37.15,
  zoom: 8.6,
}

const MAPTILER_KEY = import.meta.env.VITE_MAPTILER_API_KEY?.trim() ?? ''
const MAP_STYLE = `https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_KEY}`

export default function MapCanvas({
  selectedPoint,
  fireStations = [],
  spreadGeoJson,
  optimalRouteGeoJson,
  onPointSelect,
}: MapCanvasProps) {
  const [mapError, setMapError] = useState<string | null>(null)
  const [cursor, setCursor] = useState<'crosshair' | 'not-allowed'>('crosshair')
  const [animatedSpread, setAnimatedSpread] =
    useState<FireSpreadFeatureCollection | null>(null)
  const displayedSpreadRef = useRef<FireSpreadFeatureCollection | null>(null)

  useEffect(() => {
    if (!spreadGeoJson || !selectedPoint) {
      displayedSpreadRef.current = null
      return
    }

    const fromCollection = displayedSpreadRef.current
    const fromByHours: Record<number, FireSpreadFeature> = {}
    fromCollection?.features.forEach((f) => {
      fromByHours[f.properties.hours] = f
    })

    const toByHours: Record<number, FireSpreadFeature> = {}
    spreadGeoJson.features.forEach((f) => {
      toByHours[f.properties.hours] = f
    })

    const prevLargest = getLargestFeature(fromCollection)
    const nextLargest = getLargestFeature(spreadGeoJson)

    // Pair every growing/persisting feature and every shrinking outer feature
    type TransitionSpec = {
      feature: FireSpreadFeature
      fromRing: [number, number][]
      toRing: [number, number][]
      keepAtEnd: boolean
    }

    const transitions: TransitionSpec[] = []

    // Target features (persist or grow from previous largest ring / ignition point)
    for (const targetFeature of spreadGeoJson.features) {
      const toRing = targetFeature.geometry.coordinates[0]
      const matchingPrev = fromByHours[targetFeature.properties.hours]
      const fromRing =
        matchingPrev?.geometry.coordinates[0] ??
        prevLargest?.geometry.coordinates[0] ??
        collapsedRingAt(selectedPoint, toRing.length)

      transitions.push({
        feature: targetFeature,
        fromRing,
        toRing,
        keepAtEnd: true,
      })
    }

    // Disappearing outer features (shrink inward onto the new largest ring)
    if (fromCollection && nextLargest) {
      const shrinkTargetRing = nextLargest.geometry.coordinates[0]
      for (const prevFeature of fromCollection.features) {
        if (!toByHours[prevFeature.properties.hours]) {
          transitions.push({
            feature: prevFeature,
            fromRing: prevFeature.geometry.coordinates[0],
            toRing: shrinkTargetRing,
            keepAtEnd: false,
          })
        }
      }
    }

    // Keep largest rings first so outer ellipses draw underneath inner ellipses
    transitions.sort(
      (a, b) => b.feature.properties.hours - a.feature.properties.hours,
    )

    let rafId = 0
    const startTime = performance.now()

    const step = (now: number) => {
      const rawProgress = Math.min(1, (now - startTime) / SPREAD_ANIMATION_MS)
      const eased = easeOutCubic(rawProgress)

      if (rawProgress >= 1) {
        displayedSpreadRef.current = spreadGeoJson
        setAnimatedSpread(spreadGeoJson)
        return
      }

      const frameCollection: FireSpreadFeatureCollection = {
        type: 'FeatureCollection',
        features: transitions.map(({ feature, fromRing, toRing }) => ({
          ...feature,
          geometry: {
            type: 'Polygon',
            coordinates: [interpolateRing(fromRing, toRing, eased)],
          },
        })),
      }

      displayedSpreadRef.current = frameCollection
      setAnimatedSpread(frameCollection)
      rafId = window.requestAnimationFrame(step)
    }

    rafId = window.requestAnimationFrame(step)

    return () => {
      window.cancelAnimationFrame(rafId)
    }
  }, [spreadGeoJson, selectedPoint])

  function handleMapClick(event: MapLayerMouseEvent) {
    const { lat, lng } = event.lngLat
    if (!isPointInsideAdana(lat, lng)) {
      return
    }
    onPointSelect({
      lat: Number(lat.toFixed(6)),
      lng: Number(lng.toFixed(6)),
    })
  }

  function handleMouseMove(event: MapLayerMouseEvent) {
    const { lat, lng } = event.lngLat
    const nextCursor = isPointInsideAdana(lat, lng)
      ? 'crosshair'
      : 'not-allowed'
    setCursor((prev) => (prev === nextCursor ? prev : nextCursor))
  }

  function handleMapError(event: ErrorEvent) {
    console.error('MapLibre error:', event.error)
    setMapError(
      'Harita katmanı yüklenemedi. VITE_MAPTILER_API_KEY değerini ve internet bağlantınızı kontrol edin.',
    )
  }

  if (!MAPTILER_KEY) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-slate-100 p-6 text-center text-slate-700">
        <p>
          Haritayı görüntülemek için <code className="font-mono">frontend/.env</code>{' '}
          dosyasına <code className="font-mono">VITE_MAPTILER_API_KEY</code> ekleyin
          ve geliştirme sunucusunu yeniden başlatın.
        </p>
      </div>
    )
  }

  return (
    <div className="absolute inset-0">
      <Map
        mapLib={maplibregl}
        initialViewState={ADANA_INITIAL_VIEW}
        maxBounds={ADANA_MAX_BOUNDS}
        minZoom={8}
        maxZoom={18.5}
        maxPitch={0}
        dragRotate={false}
        pitchWithRotate={false}
        touchPitch={false}
        cursor={cursor}
        mapStyle={MAP_STYLE}
        style={{ width: '100%', height: '100%' }}
        onLoad={() => setMapError(null)}
        onMouseMove={handleMouseMove}
        onClick={handleMapClick}
        onError={handleMapError}
      >
        {/* Google Maps-style +/- zoom buttons (compass hidden since map is 2D) */}
        <NavigationControl position="bottom-right" showCompass={false} />
        <ScaleControl position="bottom-left" unit="metric" />

        <Source
          id="adana-outside-mask-source"
          type="geojson"
          data={ADANA_OUTSIDE_MASK_GEOJSON}
        >
          <Layer
            id="adana-outside-mask-fill"
            type="fill"
            paint={{
              'fill-color': '#1e293b',
              'fill-opacity': 0.45,
            }}
          />
        </Source>

        <Source
          id="adana-border-source"
          type="geojson"
          data={ADANA_BORDER_GEOJSON}
        >
          <Layer
            id="adana-border-outline"
            type="line"
            paint={{
              'line-color': '#dc2f02',
              'line-width': 2.5,
              'line-opacity': 0.85,
              'line-dasharray': [3, 2],
            }}
          />
        </Source>

        {spreadGeoJson && selectedPoint && animatedSpread && (
          <Source
            id="fire-spread-source"
            type="geojson"
            data={animatedSpread}
          >
            <Layer
              id="fire-spread-fill"
              type="fill"
              paint={{
                'fill-color': [
                  'match',
                  ['get', 'hours'],
                  1,
                  '#ea580c',
                  2,
                  '#f97316',
                  '#fb923c',
                ],
                'fill-opacity': [
                  'match',
                  ['get', 'hours'],
                  1,
                  0.4,
                  2,
                  0.28,
                  0.2,
                ],
              }}
            />
            <Layer
              id="fire-spread-outline"
              type="line"
              paint={{
                'line-color': '#c2410c',
                'line-width': 2,
                'line-opacity': 0.85,
              }}
            />
          </Source>
        )}

        {optimalRouteGeoJson && (
          <Source
            id="optimal-route-source"
            type="geojson"
            data={optimalRouteGeoJson}
          >
            <Layer
              id="optimal-route-casing"
              type="line"
              layout={{ 'line-cap': 'round', 'line-join': 'round' }}
              paint={{
                'line-color': '#ffffff',
                'line-width': 7,
                'line-opacity': 0.9,
              }}
            />
            <Layer
              id="optimal-route-line"
              type="line"
              layout={{ 'line-cap': 'round', 'line-join': 'round' }}
              paint={{
                'line-color': '#0284c7',
                'line-width': 4,
                'line-opacity': 0.95,
              }}
            />
          </Source>
        )}

        {fireStations.map((station) => {
          const isDispatchStation =
            optimalRouteGeoJson?.features[0]?.properties.stationId === station.id

          return (
            <Marker
              key={station.id}
              longitude={station.lng}
              latitude={station.lat}
              anchor="center"
            >
              <div
                title={station.name}
                aria-label={station.name}
                className={`flex h-7 w-7 items-center justify-center rounded-full border-2 border-white shadow-md transition-transform duration-200 hover:scale-110 ${
                  isDispatchStation
                    ? 'scale-110 bg-[#0284c7] ring-4 ring-[#0284c7]/30'
                    : 'bg-slate-800'
                }`}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-3.5 w-3.5 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 2c1.5 3 4 4.5 4 8a4 4 0 1 1-8 0c0-1.6.6-3 1.5-4.2C10 7.2 11 8 11 8s-.3-3 1-6Z" />
                  <path d="M5 20h14" />
                </svg>
              </div>
            </Marker>
          )
        })}

        {selectedPoint && (
          <Marker
            longitude={selectedPoint.lng}
            latitude={selectedPoint.lat}
            anchor="bottom"
          >
            <div
              aria-label="Seçilen konum"
              className="flex flex-col items-center"
            >
              <span className="h-4 w-4 rounded-full border-2 border-white bg-[#dc2f02] shadow-md" />
              <span className="h-2 w-0.5 bg-[#dc2f02]" />
            </div>
          </Marker>
        )}
      </Map>

      {mapError && (
        <div
          role="alert"
          className="absolute right-4 bottom-12 left-4 z-10 mx-auto max-w-md rounded-lg border border-red-200 bg-red-50/95 px-4 py-3 text-center text-sm text-red-800 shadow-md backdrop-blur-sm"
        >
          {mapError}
        </div>
      )}
    </div>
  )
}
