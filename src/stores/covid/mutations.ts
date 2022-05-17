import { CovidStateType } from './CovidStateType'
import Vue from 'vue'

import {
  DateRange,
  GraphType,
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

import { findCovidData } from './helpers'

export const mutations = {
  setSelectedCountry: (state: CovidStateType, country: SelectItem): void => {
    state.selectedCountry = country.name
  },

  setSelectedState: (state: CovidStateType, selectedState: SelectItem): void => {
    state.selectedState = selectedState.name
  },

  setSelectedCounty: (state: CovidStateType, county: SelectItem): void => {
    state.selectedCounty = county.name
    state.selectedCovidCountyData = findCovidData<CovidCountyData>(county.name, state.covidCountyData)
  },

  setSelectedCovidCountryData: (state: CovidStateType, country: SelectItem): void => {
    state.selectedCovidCountryData = findCovidData<CovidCountryData>(country.name, state.covidCountryData)
  },

  setSelectedCovidStateData: (state: CovidStateType, usaState: SelectItem): void => {
    state.selectedCovidStateData = findCovidData<CovidStateData>(usaState.name, state.covidStateData)
  },

  setSelectedCovidCountyData: (state: CovidStateType, county: SelectItem): void => {
    state.selectedCovidCountyData = findCovidData<CovidCountyData>(county.name, state.covidCountyData)
  },

  setSelectedDates: (state: CovidStateType, dates: DateRange): void => {
    state.selectedDates = dates
  },

  setCovidGlobalData: (state: CovidStateType, data: CovidGlobalData): void => {
    state.covidGlobalData = data
  },

  setCovidCountryData: (state: CovidStateType, data: CovidCountryData[]): void => {
    state.covidCountryData = data
  },

  setCovidStateData: (state: CovidStateType, data: CovidStateData[]): void => {
    state.covidStateData = data
  },

  setCovidCountyData: (state: CovidStateType, data: CovidCountyData[]): void => {
    state.covidCountyData = data
  },

  setCovidVaccineGlobalData: (state: CovidStateType, data: number): void => {
    state.covidGlobalData.baseData.vaccinated = data
  },

  /* We loop through each country and get the maps value using the country name as the key.
   * We use Vue to set the data since we want this to be reactive. */
  setCovidVaccineCountryData: (state: CovidStateType, data: Map<string, number>) => {
    state.covidCountryData.forEach((countryTotal: CovidCountryData): void => {
      const value = data.get(countryTotal.country.toLowerCase())
      Vue.set(countryTotal.baseData, 'vaccinated', value !== undefined ? value : 0)
    })
  },

  /* We loop through each state and get the maps value using the state name as the key.
   * We use Vue to set the data since we want this to be reactive. */
  setCovidVaccineStateData: (state: CovidStateType, data: Map<string, number>) => {
    state.covidStateData.forEach((stateTotal: CovidStateData): void => {
      const value = data.get(stateTotal.state.toLowerCase())
      Vue.set(stateTotal.baseData, 'vaccinated', value !== undefined ? value : 0)
    })
  },

  setHistoricalCountryData: (state: CovidStateType, data: CovidHistoricalData): void => {
    state.covidHistoricalCountryData = data
  },

  setHistoricalStateData: (state: CovidStateType, data: CovidHistoricalData): void => {
    state.covidHistoricalStateData = data
  },

  setHistoricalCountyData: (state: CovidStateType, data: CovidHistoricalData): void => {
    state.covidHistoricalCountyData = data
  },

  setSelectedCovidDataType: (state: CovidStateType, dataType: SelectItem[]): void => {
    state.selectedCovidDataType = dataType
  },

  setSelectedGraphMeasurementType: (state: CovidStateType, measurement: MeasurementType): void => {
    state.selectedGraphMeasurementType = measurement
  },

  setSelectedGraphType: (state: CovidStateType, graphType: GraphType): void => {
    state.selectedGraphType = graphType
  },

  setSelectedRankingDataScale: (state: CovidStateType, dataScale: DataScale): void => {
    state.selectedRankingDataScale = dataScale
  },

  setSelectedGraphDataScale: (state: CovidStateType, scale: DataScale): void => {
    state.selectedGraphDataScale = scale
  },

  addDataScale: (state: CovidStateType, scale: DataScale): void => {
    state.dataScales.push(scale)
  },

  removeDataScale: (state: CovidStateType, scale: DataScale): void => {
    state.dataScales.splice(state.dataScales.findIndex((data: DataScale): boolean => data.value === scale.value), 1)
  },

  setIsLoading: (state: CovidStateType, isLoading: boolean): void => {
    state.isLoading = isLoading
  },

  setHasError: (state: CovidStateType, hasError: boolean): void => {
    state.hasError = hasError
  }
}
