import { defineStore } from 'pinia'

import {
  DateRange,
  GraphType,
  DataScale,
  MeasurementType,
  FilterItem
} from '@/types'

import {
  CovidStateData,
  CovidCountyData,
  CovidCountryData,
} from '@/types/covid'

interface FiltersState {
  selectedCountry: string
  selectedState: string
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
    selectedCountry: '',
    selectedState: '',
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