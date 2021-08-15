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
  /*
   * The follow applies to selected covid country, state, and county data.  We iterate through the data
   * and find a match.  We return undefined if the selected data is an empty string.  We assign the
   * selected data if it exists, otherwise we assign an empty object. */
  setSelectedCovidCountryData: (state: CovidStateType): void => {
    const selectedCovidCountryData = state.covidCountryData.find((data: CovidCountryData): boolean =>
      state.selectedCountry !== '' && data.country!.toLowerCase().includes(state.selectedCountry.toLowerCase())
    )!

    state.selectedCovidCountryData = selectedCovidCountryData || {}
  },

  setSelectedCovidStateData: (state: CovidStateType): void => {
    const selectedCovidStateData = state.covidStateData.find((data: CovidStateData): boolean =>
      state.selectedState !== '' && data.state!.toLowerCase().includes(state.selectedState.toLowerCase())
    )!

    state.selectedCovidStateData = selectedCovidStateData || {}
  },

  setSelectedCovidCountyData: (state: CovidStateType): void => {
    const selectedCovidCountyData = state.covidCountyData.find((data: CovidCountyData): boolean =>
      state.selectedCounty !== '' && data.county!.toLowerCase().includes(state.selectedCounty.toLowerCase())
    )!

    state.selectedCovidCountyData = selectedCovidCountyData || {}
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
