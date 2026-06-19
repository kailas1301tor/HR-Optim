// lib/helpers/geolocation.ts

const GEOLOCATION_TIMEOUT_MS = 15_000

export interface GeoCoordinates {
  latitude: string
  longitude: string
}

function formatCoordinate(value: number): string {
  return String(value)
}

export function getCurrentCoordinates(): Promise<GeoCoordinates> {
  return new Promise((resolve, reject) => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      reject(new Error('Geolocation is not supported on this device.'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: formatCoordinate(position.coords.latitude),
          longitude: formatCoordinate(position.coords.longitude),
        })
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          reject(new Error('Location permission denied. Enable location access to check in or out.'))
          return
        }
        if (error.code === error.POSITION_UNAVAILABLE) {
          reject(new Error('Unable to determine your location. Please try again.'))
          return
        }
        if (error.code === error.TIMEOUT) {
          reject(new Error('Location request timed out. Please try again.'))
          return
        }
        reject(new Error('Failed to get your location. Please try again.'))
      },
      {
        enableHighAccuracy: true,
        timeout: GEOLOCATION_TIMEOUT_MS,
        maximumAge: 0,
      },
    )
  })
}
