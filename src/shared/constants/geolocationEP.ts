export const geolocationEP = (lat: number, lon: number): string =>
  `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
