import { CovidStateType } from './CovidStateType'
import { rankCovidData, determineCovidChartData } from './helpers'

import {
  DateValue,
  GraphType,
  ResultType,
  SelectItem,
  CountryInfo
} from '@/types'

import {
  CovidTotals,
  CovidLineChart,
  CovidStateData,
  CovidCountyData,
  CovidGlobalData,
  CovidCountryData,
  CovidRankingData
} from '@/types/covid'

export const getters = {
  getSelectedCountry: (state: CovidStateType): string => state.selectedCountry,

  getSelectedState: (state: CovidStateType): string => state.selectedState,

  getSelectedCounty: (state: CovidStateType): string => state.selectedCounty,

  getSelectedGraphType: (state: CovidStateType): GraphType => state.selectedGraphType,

  getSelectedResultType: (state: CovidStateType): ResultType => state.selectedResultType,

  getNumberOfSelectedCovidDataTypes: (state: CovidStateType): string =>
    `(${state.selectedCovidDataType.length}) data types selected`,
  /*
   * Map all affected countries names and country codes.
   */
  getAllAffectedCountries: (state: CovidStateType): CountryInfo[] =>
    state.covidCountryData.map((data: CovidCountryData): CountryInfo => {
      return { name: data.country!, countryCode: data.countryInfo?.iso2! }
    }),
  /*  Map all affected state names. */
  getAllAffectedStates: (state: CovidStateType): SelectItem[] =>
    state.covidStateData.map((data: CovidStateData): SelectItem => {
      return { name: data.state, value: data.state.toLowerCase() }
    }),
  /* Map all affected counties of the selected state. */
  getStatesAffectedCounties: (state: CovidStateType): SelectItem[] =>
    state.covidCountyData
      .filter((data: CovidCountyData): boolean => data.state === state.selectedState)
      .map((data: CovidCountyData): SelectItem => {
        return { name: data.county, value: data.county.toLowerCase() }
      }),
  /*
   * Map the dates provided by the selected countries historical data.
   */
  getCovidChartLabels: (state: CovidStateType): string[] =>
    state.covidHistoricalCountryData.timeline?.cases.map((x: DateValue): string => x.date),

  getCovidGlobalTotals: (state: CovidStateType): CovidTotals => {
    const data: CovidGlobalData = state.covidGlobalData

    return {
      cases: data.baseData.cases,
      deaths: data.baseData.deaths,
      recovered: data.recovered,
      tests: data.baseData.tests,
      vaccinated: data.vaccinated,
      updated: data.baseData.updated
    }
  },

  getCovidCountryTotals: (state: CovidStateType): CovidTotals => {
    const data: CovidCountryData = state.selectedCovidCountryData

    return {
      country: data.country,
      cases: data.baseData.cases,
      deaths: data.baseData.deaths,
      tests: data.baseData.tests,
      vaccinated: data.vaccinated,
      updated: data.baseData.updated
    }
  },

  getCovidStateTotals: (state: CovidStateType): CovidTotals => {
    const data: CovidStateData = state.selectedCovidStateData

    return {
      state: data.state,
      cases: data.baseData.cases,
      deaths: data.baseData.deaths,
      tests: data.baseData.tests,
      vaccinated: undefined,
      updated: data.baseData.updated
    }
  },

  getCovidCountyTotals: (state: CovidStateType): CovidTotals => {
    const data: CovidCountyData = state.selectedCovidCountyData

    return {
      county: data.county,
      cases: data.cases,
      deaths: data.deaths,
      tests: undefined,
      vaccinated: undefined,
      updated: data.updated
    }
  },

  getWorldwideCaseRankings: (state: CovidStateType): CovidRankingData[] =>
    rankCovidData([...state.covidCountryData], 'country', 'casesPerOneMillion'),

  getWorldwideDeathRankings: (state: CovidStateType): CovidRankingData[] =>
    rankCovidData([...state.covidCountryData], 'country', 'deathsPerOneMillion'),

  getWorldwideTestRankings: (state: CovidStateType): CovidRankingData[] =>
    rankCovidData([...state.covidCountryData], 'country', 'testsPerOneMillion'),
  /*
   * Map historical data values for the chosen data types: cases, deaths, and recovered to
   * CovidLineChart data structure.
   */
  getCovidChartData: (state: CovidStateType): CovidLineChart[] => {
    const covidChartData: CovidLineChart[] = []

    if (state.covidHistoricalCountryData.timeline) {
      state.selectedCovidDataType.forEach((type: SelectItem): void => {
        covidChartData.push({
          label: type.name,
          data: determineCovidChartData(
            state.covidHistoricalCountryData.timeline[type.value],
            state.selectedResultType
          )
        })
      })
    }

    return covidChartData
  },

  /* Conditionals to render state and county totals since we are only doing this for USA data. */
  renderStateTotals: (state: CovidStateType): boolean =>
    state.selectedCountry === 'USA' && state.selectedState.length > 0,

  renderCountyTotals: (state: CovidStateType): boolean => state.selectedCountry === 'USA'
    && state.selectedState.length > 0
    && state.selectedCovidCountyData.state === state.selectedState
}
