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
    state.selectedCovidCountryData = searchForSelectedData(country.name, state.covidCountryData, 'country') as CovidCountryData
  },

  setSelectedState: (state: CovidStateType, selectedState: SelectItem): void => {
    state.selectedState = selectedState.name
    state.selectedCovidStateData = searchForSelectedData(selectedState.name, state.covidStateData, 'state') as CovidStateData
  },

  setSelectedCounty: (state: CovidStateType, county: SelectItem): void => {
    state.selectedCounty = county.name
    state.selectedCovidCountyData = searchForSelectedData(county.name, state.covidCountyData, 'county') as CovidCountyData
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
