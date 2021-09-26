import {
  GraphType,
  DateRange,
  SelectItem,
  MeasurementType,
  DataScale
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
  selectedRankingMeasurementType: {} as MeasurementType,
  selectedGraphMeasurementType: {} as MeasurementType,
  selectedRankingDataScale: {} as DataScale,
  selectedGraphDataScale: {} as DataScale,
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
  covidHistoricalCountyData: {} as CovidHistoricalData,
  dataScales: [] as DataScale[],
  isLoading: false,
  hasError: false
})
