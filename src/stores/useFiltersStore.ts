import { defineStore } from 'pinia'

import {
  DateRange,
  GraphType,
  DataScale,
  FilterItem,
  CountryInfo,
  MeasurementType,
} from '@/types'

import {
  CovidStateData,
  CovidCountyData,
  CovidCountryData,
} from '@/types/covid'

interface FiltersState {
  selectedCountry: CountryInfo
  selectedState: FilterItem
  selectedCounty: string
  selectedGraphType: GraphType
  selectedGraphMeasurementType: MeasurementType
  selectedRankingDataScale: DataScale
  selectedGraphDataScale: DataScale
  selectedDates: DateRange
  selectedCovidDataType: FilterItem[]
  selectedCovidCountryData: CovidCountryData
  selectedCovidStateData: CovidStateData
  selectedCovidCountyData: CovidCountyData
}

export const useFiltersStore = defineStore('filters', {
  state: (): FiltersState => ({
    selectedCountry: {} as CountryInfo,
    selectedState: {} as FilterItem,
    selectedCounty: '',
    selectedGraphType: {} as GraphType,
    selectedGraphMeasurementType: {} as MeasurementType,
    selectedRankingDataScale: {} as DataScale,
    selectedGraphDataScale: {} as DataScale,
    selectedDates: {} as DateRange,
    selectedCovidCountryData: {} as CovidCountryData,
    selectedCovidStateData: {} as CovidStateData,
    selectedCovidCountyData: {} as CovidCountyData,
    selectedCovidDataType: [] as FilterItem[],
  })
})