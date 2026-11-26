import { useState } from 'react'
import * as maplibregl from 'maplibre-gl'
import maplibreWorkerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url'
import Map, {
  Marker,
  NavigationControl,
  ScaleControl,
  type ErrorEvent,
  type MapLayerMouseEvent,
} from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'

maplibregl.setWorkerUrl(maplibreWorkerUrl)

export interface ClickedCoordinate {
  lat: number
  lng: number
}

interface MapCanvasProps {
  selectedPoint: ClickedCoordinate | null
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
  onPointSelect,
}: MapCanvasProps) {
  const [mapError, setMapError] = useState<string | null>(null)

  function handleMapClick(event: MapLayerMouseEvent) {
    const { lat, lng } = event.lngLat
    onPointSelect({
      lat: Number(lat.toFixed(6)),
      lng: Number(lng.toFixed(6)),
    })
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
        cursor="crosshair"
        mapStyle={MAP_STYLE}
        style={{ width: '100%', height: '100%' }}
        onLoad={() => setMapError(null)}
        onClick={handleMapClick}
        onError={handleMapError}
      >
        {/* Google Maps-style +/- zoom buttons (compass hidden since map is 2D) */}
        <NavigationControl position="bottom-right" showCompass={false} />
        <ScaleControl position="bottom-left" unit="metric" />

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
