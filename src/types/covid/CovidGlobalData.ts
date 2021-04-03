import { CovidData } from './CovidData'

export interface CovidGlobalData {
  recovered: number;
  todayRecovered: number;
  critical: number;
  oneCasePerPeople: number;
  oneDeathPerPeople: number;
  oneTestPerPeople: number;
  activePerOneMillion: number;
  recoveredPerOneMillion: number;
  criticalPerOneMillion: number;
  affectedCountries: number;
  vaccinated?: number;
  baseData: CovidData;
}
