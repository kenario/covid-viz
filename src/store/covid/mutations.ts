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

export const mutations = {
  setSelectedCountry: (state: CovidStateType, country: SelectItem): void => {
    state.selectedCountry = country.name
  },

  setSelectedState: (state: CovidStateType, selectedState: SelectItem): void => {
    state.selectedState = selectedState.name
  },

  setSelectedCounty: (state: CovidStateType, county: SelectItem): void => {
    state.selectedCounty = county.name
  },

  setSelectedDates: (state: CovidStateType, dates: DateRange): void => {
    state.selectedDates = dates
  },
  /**
   * Iterates through all countries, converts countries and country to lowercase, and assigns to
   * selectedCovidCountryData state.  Asserts that country is not null, since country comes from the Covid
   * API and is sure to exist.  This is the same for the selected state data as well.
   */
  setSelectedCovidCountryData: (state: CovidStateType): void => {
    state.selectedCovidCountryData = state.covidCountryData.find((data: CovidCountryData): boolean =>
      data.country!.toLowerCase().includes(state.selectedCountry.toLowerCase())
    )!
  },

  setSelectedCovidStateData: (state: CovidStateType): void => {
    state.selectedCovidStateData = state.covidStateData.find((data: CovidStateData): boolean =>
      data.state!.toLowerCase().includes(state.selectedState.toLowerCase())
    )!
  },

  setSelectedCovidCountyData: (state: CovidStateType): void => {
    state.selectedCovidCountyData = state.covidCountyData.find((data: CovidCountyData): boolean =>
      data.county!.toLowerCase().includes(state.selectedCounty.toLowerCase())
    )!
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

  /* We loop through each country and get the maps value using the country name as the key */
  setCovidVaccineCountryData: (state: CovidStateType, data: Map<string, number>) => {
    state.covidCountryData.forEach((countryTotal: CovidCountryData): void => {
      const value = data.get(countryTotal.country.toLowerCase())
      Vue.set(countryTotal.baseData, 'vaccinated', value !== undefined ? value : 0)
    })
  },

  setHistoricalCountryData: (state: CovidStateType, data: CovidHistoricalData): void => {
    state.covidHistoricalCountryData = data
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
  }
}
