export const geolocationEP = (lat: number, lon: number): string =>
  `http://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
