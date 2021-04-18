import { CovidStateType } from './CovidStateType'
import { rankCovidData, determineCovidChartData, mapCovidTotals } from './helpers'

import {
  DateValue,
  GraphType,
  ResultType,
  SelectItem,
  CountryInfo,
  RankingType
} from '@/types'

import {
  CovidTotals,
  CovidLineChart,
  CovidStateData,
  CovidCountyData,
  CovidCountryData,
  CovidRankingData
} from '@/types/covid'
import { CovidRankings } from '@/types/covid/CovidRankings'

export const getters = {
  getSelectedCountry: (state: CovidStateType): string => state.selectedCountry,

  getSelectedState: (state: CovidStateType): string => state.selectedState,

  getSelectedCounty: (state: CovidStateType): string => state.selectedCounty,

  getSelectedGraphType: (state: CovidStateType): GraphType => state.selectedGraphType,

  getSelectedResultType: (state: CovidStateType): ResultType => state.selectedResultType,

  getSelectedRankingType: (state: CovidStateType): RankingType => state.selectedRankingType,

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

  getCovidGlobalTotals: (state: CovidStateType): CovidTotals => mapCovidTotals(state.covidGlobalData),

  getCovidCountryTotals: (state: CovidStateType): CovidTotals => {
    const data: CovidCountryData = state.selectedCovidCountryData
    return mapCovidTotals(data, { country: data.country })
  },

  getCovidStateTotals: (state: CovidStateType): CovidTotals => {
    const data: CovidStateData = state.selectedCovidStateData
    return mapCovidTotals(data, { state: data.state })
  },

  getCovidCountyTotals: (state: CovidStateType): CovidTotals => {
    const data: CovidCountyData = state.selectedCovidCountyData
    return mapCovidTotals(data, { county: data.county })
  },

  getCovidRankings: (state: CovidStateType): CovidRankings[] => {
    const result: CovidRankings[] = []
    const rankingSubtypes = [
      'cases',
      'deaths',
      'tests'
    ]

    rankingSubtypes.forEach((subtypes: string): void => {
      let data: CovidRankingData[] = []
      let label = subtypes.slice(0, 1).toUpperCase() + subtypes.slice(1)

      if (state.selectedRankingType.value === 'worldwide') {
        label = `Worldwide ${label}`
        data = rankCovidData([...state.covidCountryData], 'country', subtypes)
      } else if (state.selectedRankingType.value === 'nationwide') {
        label = `USA ${label}`
        data = rankCovidData([...state.covidStateData], 'state', subtypes)
      }

      result.push({
        label: label,
        data: data
      })
    })

    return result
  },
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
  }
}
