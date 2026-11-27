export interface FireStation {
  id: string
  name: string
  lat: number
  lng: number
}

export interface OptimalRouteFeatureProperties {
  stationId: string
  stationName: string
  distanceKm: number
  estimatedMinutes: number
}

export interface OptimalRouteFeature {
  type: 'Feature'
  properties: OptimalRouteFeatureProperties
  geometry: {
    type: 'LineString'
    coordinates: [number, number][]
  }
}

export interface OptimalRouteFeatureCollection {
  type: 'FeatureCollection'
  features: OptimalRouteFeature[]
}

export const MOCK_FIRE_STATIONS: FireStation[] = [
  { id: 'seyhan', name: 'Seyhan Merkez İtfaiye', lat: 36.9914, lng: 35.3308 },
  { id: 'cukurova', name: 'Çukurova İtfaiye', lat: 37.0492, lng: 35.2856 },
  { id: 'yuregir', name: 'Yüreğir İtfaiye', lat: 36.9885, lng: 35.3821 },
  { id: 'kozan', name: 'Kozan İtfaiye', lat: 37.4552, lng: 35.8157 },
  { id: 'aladag', name: 'Aladağ Orman İtfaiye', lat: 37.5481, lng: 35.3965 },
  { id: 'karaisali', name: 'Karaisalı İtfaiye', lat: 37.2586, lng: 35.0604 },
  { id: 'ceyhan', name: 'Ceyhan İtfaiye', lat: 37.0247, lng: 35.8175 },
  { id: 'pozanti', name: 'Pozantı İtfaiye', lat: 37.4272, lng: 34.8722 },
]

function findNearestStation(lat: number, lng: number): FireStation {
  let nearest = MOCK_FIRE_STATIONS[0]
  let minDistSq = Number.POSITIVE_INFINITY

  for (const station of MOCK_FIRE_STATIONS) {
    const dLat = station.lat - lat
    const dLng = station.lng - lng
    const distSq = dLat * dLat + dLng * dLng
    if (distSq < minDistSq) {
      minDistSq = distSq
      nearest = station
    }
  }

  return nearest
}

/**
 * Generates a curved mock LineString from the fire station to the target point
 * to visually represent a road-following optimum path before pgRouting is wired.
 */
function buildMockRouteCoordinates(
  from: FireStation,
  toLat: number,
  toLng: number,
  steps = 24,
): [number, number][] {
  const dLng = toLng - from.lng
  const dLat = toLat - from.lat
  // Slight perpendicular curve so the mock path looks road-like rather than a rigid straight line
  const bend = 0.14
  const ctrlLng = (from.lng + toLng) / 2 - dLat * bend
  const ctrlLat = (from.lat + toLat) / 2 + dLng * bend

  const coords: [number, number][] = []
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const inv = 1 - t
    const lng = inv * inv * from.lng + 2 * inv * t * ctrlLng + t * t * toLng
    const lat = inv * inv * from.lat + 2 * inv * t * ctrlLat + t * t * toLat
    coords.push([Number(lng.toFixed(6)), Number(lat.toFixed(6))])
  }

  return coords
}

export async function fetchOptimalRoute(
  targetLat: number,
  targetLng: number,
): Promise<OptimalRouteFeatureCollection> {
  // TODO: Once Spring Boot + pgRouting A* endpoint is ready, replace mock block with:
  // const res = await fetch(`/api/v1/routes/optimal?lat=${targetLat}&lng=${targetLng}`)
  // if (!res.ok) throw new Error('Optimum rota hesaplanamadı.')
  // return res.json()

  await new Promise((resolve) => setTimeout(resolve, 200))

  const station = findNearestStation(targetLat, targetLng)
  const coordinates = buildMockRouteCoordinates(station, targetLat, targetLng)

  const approxKm = Math.max(
    1.5,
    Number(
      (
        Math.hypot(station.lat - targetLat, station.lng - targetLng) *
        111.32 *
        1.25
      ).toFixed(1),
    ),
  )

  return {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {
          stationId: station.id,
          stationName: station.name,
          distanceKm: approxKm,
          estimatedMinutes: Math.max(3, Math.round((approxKm / 55) * 60)),
        },
        geometry: {
          type: 'LineString',
          coordinates,
        },
      },
    ],
  }
}
