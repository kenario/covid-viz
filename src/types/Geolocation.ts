/* Geolocation interfaces from Mozilla seem to not be exported, despite being available in the api. */

export interface GeolocationPosition {
  readonly coords: GeolocationCoordinates;
  readonly timestamp: number;
}

export interface GeolocationResponse {
  readonly address: Address;
  readonly boundingbox: string[];
  readonly display_name: string;
  readonly lat: string;
  readonly licence: string;
  readonly lon: string;
  readonly osm_id: number;
  readonly osm_type: string;
  readonly place_id: number;
}

interface Address {
  readonly city: string;
  readonly country: string;
  readonly country_code: string;
  readonly county: string;
  readonly house_number: string;
  readonly postcode: string;
  readonly road: string;
  readonly state: string;
}

interface GeolocationCoordinates {
  readonly accuracy: number;
  readonly altitude: number | null;
  readonly altitudeAccuracy: number | null;
  readonly heading: number | null;
  readonly latitude: number;
  readonly longitude: number;
  readonly speed: number | null;
}
