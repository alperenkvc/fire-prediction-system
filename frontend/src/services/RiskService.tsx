export type RiskClass = 'VERY_LOW' | 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL'

export interface StaticRiskResponse {
  latitude: number
  longitude: number
  regionName: string
  staticRiskScore: number // 0 - 100
  riskClass: RiskClass
}

function getRiskClass(score: number): RiskClass {
  if (score < 20) return 'VERY_LOW'
  if (score < 40) return 'LOW'
  if (score < 60) return 'MODERATE'
  if (score < 80) return 'HIGH'
  return 'CRITICAL'
}

export function getRegionNameByCoordinates(lat: number): string {
  return lat > 37.35 ? 'Kuzey Adana Orman Bölgesi' : 'Çukurova / Merkez Havzası'
}

export async function fetchStaticRiskByCoordinates(
  lat: number,
  lng: number,
): Promise<StaticRiskResponse> {
  // TODO: Once Spring Boot + PostGIS is running, replace mock block below with:
  // const res = await fetch(`/api/v1/risk/static?lat=${lat}&lng=${lng}`)
  // if (!res.ok) throw new Error('Risk verisi alınamadı.')
  // return res.json()

  await new Promise((resolve) => setTimeout(resolve, 250))

  // Deterministic mock score (higher toward northern Adana mountains like Aladağ/Kozan)
  const rawScore = Math.round(
    Math.min(100, Math.max(8, (lat - 36.5) * 45 + ((lng * 100) % 25))),
  )

  return {
    latitude: lat,
    longitude: lng,
    regionName: getRegionNameByCoordinates(lat),
    staticRiskScore: rawScore,
    riskClass: getRiskClass(rawScore),
  }
}