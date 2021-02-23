import { CovidData } from './CovidData'

export interface CovidGlobalData extends CovidData {
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
}
