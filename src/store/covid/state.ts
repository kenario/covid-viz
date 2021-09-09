import {
  GraphType,
  DateRange,
  SelectItem,
  ResultType,
  RankingType
} from '@/types'

import {
  CovidStateData,
  CovidCountyData,
  CovidGlobalData,
  CovidCountryData,
  CovidHistoricalData
} from '@/types/covid'

export const state = () => ({
  selectedCountry: '',
  selectedState: '',
  selectedCounty: '',
  selectedGraphType: {} as GraphType,
  selectedResultType: {} as ResultType,
  selectedRankingType: {} as RankingType,
  selectedDataScale: {} as RankingType,
  selectedDates: {} as DateRange,
  selectedCovidCountryData: {} as CovidCountryData,
  selectedCovidStateData: {} as CovidStateData,
  selectedCovidCountyData: {} as CovidCountyData,
  selectedCovidDataType: [] as SelectItem[],
  covidGlobalData: {} as CovidGlobalData,
  covidCountryData: [] as CovidCountryData[],
  covidStateData: [] as CovidStateData[],
  covidCountyData: [] as CovidCountyData[],
  covidHistoricalCountryData: {} as CovidHistoricalData,
  covidHistoricalStateData: {} as CovidHistoricalData,
  dataScales: [] as RankingType[]
})
