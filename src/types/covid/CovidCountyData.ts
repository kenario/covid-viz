import { CovidData } from './CovidData'

export interface CovidCountyData {
  country: string;
  state: string;
  county: string;
  baseData: CovidData;
}
