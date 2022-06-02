/* Base fields for CovidData from the disease.sh API. */

export interface CovidData {
  [key: string]: number | string | undefined;
  updated?: string;
  cases?: number;
  todayCases?: number;
  recovered?: number;
  todayRecovered?: number;
  deaths?: number;
  todayDeaths?: number;
  vaccines?: number;
  active?: number;
  casesPerOneMillion?: number;
  deathsPerOneMillion?: number;
  tests?: number;
  testsPerOneMillion?: number;
  population?: number;
}
