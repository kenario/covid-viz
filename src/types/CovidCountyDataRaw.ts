/* Raw covid county data model. */

export interface CovidCountyDataRaw {
  country: string;
  province: string;
  county: string;
  updatedAt: string;
  stats: Stats;
  coordinates: Coordinates;
}

interface Stats {
  confirmed: number;
  deaths: number;
  recovered: number;
}

interface Coordinates {
  latitude: string;
  longitude: string;
}
