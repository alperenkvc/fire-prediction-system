import type { SpreadPeriodHours } from '../components/Modals/SpreadPeriodModal'

export interface FireSpreadFeatureProperties {
  hours: SpreadPeriodHours
  label: string
  estimatedAreaHa: number
  windDirectionDeg: number
  windSpeedKmh: number
}

export interface FireSpreadFeature {
  type: 'Feature'
  properties: FireSpreadFeatureProperties
  geometry: {
    type: 'Polygon'
    coordinates: [number, number][][]
  }
}

export interface FireSpreadFeatureCollection {
  type: 'FeatureCollection'
  features: FireSpreadFeature[]
}

const KM_PER_DEG_LAT = 111.32

/**
 * Generates an elliptical wildfire spread polygon oriented downwind from the
 * ignition point, matching the GeoJSON Polygon shape expected from PostGIS.
 */
function buildSpreadEllipsePolygon(
  originLat: number,
  originLng: number,
  semiMajorKm: number,
  semiMinorKm: number,
  bearingDeg: number,
  segments = 64,
): [number, number][] {
  const kmPerDegLng = KM_PER_DEG_LAT * Math.cos((originLat * Math.PI) / 180)
  // Convert compass bearing (0° = North, 90° = East) to math angle (0° = East, CCW)
  const theta = ((90 - bearingDeg) * Math.PI) / 180
  const cosT = Math.cos(theta)
  const sinT = Math.sin(theta)

  // Shift ellipse center downwind so ignition sits near the upwind focus
  const focalOffsetKm = semiMajorKm * 0.55

  const ring: [number, number][] = []
  for (let i = 0; i <= segments; i++) {
    const t = (i / segments) * 2 * Math.PI
    const localX = focalOffsetKm + semiMajorKm * Math.cos(t)
    const localY = semiMinorKm * Math.sin(t)

    const eastKm = localX * cosT - localY * sinT
    const northKm = localX * sinT + localY * cosT

    const lng = originLng + eastKm / kmPerDegLng
    const lat = originLat + northKm / KM_PER_DEG_LAT
    ring.push([Number(lng.toFixed(6)), Number(lat.toFixed(6))])
  }

  return ring
}

const SPREAD_DIMENSIONS_KM: Record<
  SpreadPeriodHours,
  { semiMajorKm: number; semiMinorKm: number }
> = {
  1: { semiMajorKm: 1.6, semiMinorKm: 0.9 },
  2: { semiMajorKm: 3.1, semiMinorKm: 1.65 },
  3: { semiMajorKm: 4.8, semiMinorKm: 2.4 },
}

export async function fetchFireSpreadSimulation(
  lat: number,
  lng: number,
  maxHours: SpreadPeriodHours,
): Promise<FireSpreadFeatureCollection> {
  // TODO: Once Spring Boot + PostGIS spread endpoint is ready, replace mock block with:
  // const res = await fetch(`/api/v1/simulation/spread?lat=${lat}&lng=${lng}&hours=${maxHours}`)
  // if (!res.ok) throw new Error('Yayılım simülasyonu alınamadı.')
  // return res.json()

  await new Promise((resolve) => setTimeout(resolve, 200))

  // Mock wind vector (NE 45°, 18 km/h) consistent with Weather page mock
  const windDirectionDeg = 45
  const windSpeedKmh = 18

  // Order largest -> smallest so outer rings render underneath inner rings
  const periods: SpreadPeriodHours[] = ([3, 2, 1] as SpreadPeriodHours[]).filter(
    (h) => h <= maxHours,
  )

  const features: FireSpreadFeature[] = periods.map((hours) => {
    const { semiMajorKm, semiMinorKm } = SPREAD_DIMENSIONS_KM[hours]
    const areaHa = Math.round(Math.PI * semiMajorKm * semiMinorKm * 100)

    return {
      type: 'Feature',
      properties: {
        hours,
        label: `${hours} Saat`,
        estimatedAreaHa: areaHa,
        windDirectionDeg,
        windSpeedKmh,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          buildSpreadEllipsePolygon(
            lat,
            lng,
            semiMajorKm,
            semiMinorKm,
            windDirectionDeg,
          ),
        ],
      },
    }
  })

  return {
    type: 'FeatureCollection',
    features,
  }
}
