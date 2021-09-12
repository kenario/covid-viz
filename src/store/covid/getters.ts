import { CovidStateType } from './CovidStateType'
import { rankCovidData, determineCovidChartData, mapCovidTotals } from './helpers'

import {
  DateValue,
  GraphType,
  ResultType,
  SelectItem,
  CountryInfo,
  RankingType,
  DateRange
} from '@/types'

import {
  CovidTotals,
  CovidLineChart,
  CovidStateData,
  CovidCountyData,
  CovidCountryData,
  CovidRankingData,
  CovidHistoricalData
} from '@/types/covid'
import { CovidRankings } from '@/types/covid/CovidRankings'

export const getters = {
  getSelectedDates: (state: CovidStateType): DateRange => state.selectedDates,

  getSelectedCountry: (state: CovidStateType): string => state.selectedCountry,

  getSelectedState: (state: CovidStateType): string => state.selectedState,

  getSelectedCounty: (state: CovidStateType): string => state.selectedCounty,

  getSelectedGraphType: (state: CovidStateType): GraphType => state.selectedGraphType,

  getSelectedResultType: (state: CovidStateType): ResultType => state.selectedResultType,

  getSelectedRankingType: (state: CovidStateType): RankingType => state.selectedRankingType,

  getSelectedDataScale: (state: CovidStateType): RankingType => state.selectedDataScale,

  getNumberOfSelectedCovidDataTypes: (state: CovidStateType): string =>
    `(${state.selectedCovidDataType.length}) data types selected`,

  getSelectedCovidDataTypes: (state: CovidStateType): SelectItem[] =>
    state.selectedCovidDataType,

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

  /**
   * RankingTypes is pulled from the data scale data structure + an added worldwide scale.
   *
   * @returns - RankingType[]
   */
  getRankingTypes: (state: CovidStateType): RankingType[] => {
    let result: RankingType[] = [
      { name: 'Worldwide', value: 'worldwide' },
      ...state.dataScales
    ]
    /*
     * The data scales are determined by their own operations but in the case of RankingTypes, we
     * need to make sure worldwide is the only one present when the country is not USA since it is
     * not a part of the normal data scales. */
    if (state.selectedCountry.toLowerCase() !== 'usa') {
      result = [{ name: 'Worldwide', value: 'worldwide' }]
    }

    return result
  },

  getDataScales: (state: CovidStateType): RankingType[] => state.dataScales,

  getCovidRankings: (state: CovidStateType): CovidRankings[] => {
    const result: CovidRankings[] = []
    const rankingSubtypes = [
      'cases',
      'deaths',
      'tests',
      'vaccinated'
    ]

    rankingSubtypes.forEach((subtypes: string): void => {
      let data: CovidRankingData[] = []
      let label = subtypes.slice(0, 1).toUpperCase() + subtypes.slice(1)

      /*
       * Assign the ranking label and map the data based on the ranking type selected. */
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

  getCovidChartLabels: (state: CovidStateType): string[] => {
    let historicalData: CovidHistoricalData

    if (state.selectedDataScale.value === 'nationwide') {
      historicalData = state.covidHistoricalCountryData
    } else if (state.selectedDataScale.value === 'statewide') {
      historicalData = state.covidHistoricalStateData
    } else {
      historicalData = state.covidHistoricalCountyData
    }

    return historicalData.timeline?.cases.map((x: DateValue): string => x.date)
  },

  /**
   * Takes historical covid data and converts to a data structure to be used by a chart component.
   *
   * @param state
   * @returns - CovidLineChart[]
   */
  getCovidChartData: (state: CovidStateType): CovidLineChart[] => {
    const result: CovidLineChart[] = []
    let historicalData: CovidHistoricalData

    if (state.selectedDataScale.value === 'nationwide') {
      historicalData = state.covidHistoricalCountryData
    } else if (state.selectedDataScale.value === 'statewide') {
      historicalData = state.covidHistoricalStateData
    } else {
      historicalData = state.covidHistoricalCountyData
    }

    if (historicalData.timeline) {
      state.selectedCovidDataType.forEach((type: SelectItem): void => {
        result.push({
          label: type.name,
          data: determineCovidChartData(
            historicalData.timeline[type.value],
            state.selectedResultType
          )
        })
      })
    }

    return result
  }
}
