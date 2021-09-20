import { CovidStateType } from './CovidStateType'
import Vue from 'vue'

import {
  DateRange,
  GraphType,
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

import { searchForSelectedData } from './helpers'

export const mutations = {
  setSelectedCountry: (state: CovidStateType, country: SelectItem): void => {
    state.selectedCountry = country.name
  },

  setSelectedState: (state: CovidStateType, selectedState: SelectItem): void => {
    state.selectedState = selectedState.name
  },

  setSelectedCounty: (state: CovidStateType, county: SelectItem): void => {
    state.selectedCounty = county.name
    state.selectedCovidCountyData = searchForSelectedData(county.name, state.covidCountyData, 'county') as CovidCountyData
  },

  setSelectedCovidCountryData: (state: CovidStateType, country: SelectItem): void => {
    state.selectedCovidCountryData = searchForSelectedData(
      country.name,
      state.covidCountryData,
      'country'
    ) as CovidCountryData
  },

  setSelectedCovidStateData: (state: CovidStateType, usaState: SelectItem): void => {
    state.selectedCovidStateData = searchForSelectedData(
      usaState.name,
      state.covidStateData,
      'state'
    ) as CovidStateData
  },

  setSelectedCovidCountyData: (state: CovidStateType, county: SelectItem): void => {
    state.selectedCovidCountyData = searchForSelectedData(
      county.name,
      state.covidCountyData,
      'county'
    ) as CovidCountyData
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

  setSelectedResultType: (state: CovidStateType, resultType: ResultType): void => {
    state.selectedResultType = resultType
  },

  setSelectedGraphType: (state: CovidStateType, graphType: GraphType): void => {
    state.selectedGraphType = graphType
  },

  setSelectedRankingType: (state: CovidStateType, rankingType: RankingType): void => {
    state.selectedRankingType = rankingType
  },

  setSelectedDataScale: (state: CovidStateType, scale: RankingType): void => {
    state.selectedDataScale = scale
  },

  addDataScale: (state: CovidStateType, scale: RankingType): void => {
    state.dataScales.push(scale)
  },

  removeDataScale: (state: CovidStateType, scale: RankingType): void => {
    state.dataScales.splice(state.dataScales.findIndex((data: RankingType): boolean => data.value === scale.value), 1)
  },

  setIsLoading: (state: CovidStateType, isLoading: boolean): void => {
    state.isLoading = isLoading
  },

  setHasError: (state: CovidStateType, hasError: boolean): void => {
    state.hasError = hasError
  }
}
