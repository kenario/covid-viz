import { CovidData } from './CovidData'

export interface CovidCountryData {
  country: string;
  countryInfo?: CountryInfo;
  critical: number;
  continent: string;
  oneCasePerPeople: number;
  oneTestPerPeople: number;
  activePerOneMillion: number;
  recoveredPerOneMillion: number;
  criticalPerOneMillion: number;
  affectedCountries?: number;
  baseData: CovidData;
}

interface CountryInfo {
  _id: number;
  iso2: string;
  iso3: string;
  lat: number;
  long: number;
  flag: string;
}
