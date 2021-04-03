import moment from 'moment'
import axios, { AxiosResponse } from 'axios'

import { ActionContext } from 'vuex'
import { covidEP } from '@/shared/constants'
import { CovidStoreState } from './CovidStoreState'
import { CovidDataMapper } from '@/shared/CovidDataMapper'

import {
  DateValue,
  DateRange,
  GraphType,
  SelectItem,
  ResultType,
  CountryInfo
} from '@/types'

import {
  CovidData,
  CovidTotals,
  CovidLineChart,
  CovidStateData,
  CovidGlobalData,
  CovidCountyData,
  CovidRankingData,
  CovidCountryData,
  CovidCountyDataRaw,
  CovidHistoricalData
} from '@/types/covid'

// RootState
interface RS {
  value: string;
}

export const state = () => ({
  selectedCountry: '',
  selectedState: '',
  selectedCounty: '',
  selectedGraphType: {} as GraphType,
  selectedResultType: {} as ResultType,
  selectedDates: {} as DateRange,
  selectedCovidCountryData: {} as CovidCountryData,
  selectedCovidStateData: {} as CovidStateData,
  selectedCovidCountyData: {} as CovidCountyData,
  selectedCovidDataType: [] as SelectItem[],
  covidGlobalData: {} as CovidGlobalData,
  covidCountryData: [] as CovidCountryData[],
  covidStateData: [] as CovidStateData[],
  covidCountyData: [] as CovidCountyData[],
  covidHistoricalCountryData: {} as CovidHistoricalData
})

export const getters = {
  getSelectedCountry: (state: CovidStoreState): string => state.selectedCountry,

  getSelectedState: (state: CovidStoreState): string => state.selectedState,

  getSelectedCounty: (state: CovidStoreState): string => state.selectedCounty,

  getSelectedGraphType: (state: CovidStoreState): GraphType => state.selectedGraphType,

  getSelectedResultType: (state: CovidStoreState): ResultType => state.selectedResultType,

  getNumberOfSelectedCovidDataTypes: (state: CovidStoreState): string =>
    `(${state.selectedCovidDataType.length}) data types selected`,
  /*
   * Map all affected countries names and country codes.
   */
  getAllAffectedCountries: (state: CovidStoreState): CountryInfo[] =>
    state.covidCountryData.map((data: CovidCountryData): CountryInfo => {
      return { name: data.country!, countryCode: data.countryInfo?.iso2! }
    }),
  /*  Map all affected state names. */
  getAllAffectedStates: (state: CovidStoreState): SelectItem[] =>
    state.covidStateData.map((data: CovidStateData): SelectItem => {
      return { name: data.state, value: data.state.toLowerCase() }
    }),
  /* Map all affected counties of the selected state. */
  getStatesAffectedCounties: (state: CovidStoreState): SelectItem[] =>
    state.covidCountyData
      .filter((data: CovidCountyData): boolean => data.state === state.selectedState)
      .map((data: CovidCountyData): SelectItem => {
        return { name: data.county, value: data.county.toLowerCase() }
      }),
  /*
   * Map the dates provided by the selected countries historical data.
   */
  getCovidChartLabels: (state: CovidStoreState): string[] =>
    state.covidHistoricalCountryData.timeline?.cases.map((x: DateValue): string => x.date),

  getCovidGlobalTotals: (state: CovidStoreState): CovidTotals => {
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

  getCovidCountryTotals: (state: CovidStoreState): CovidTotals => {
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

  getCovidStateTotals: (state: CovidStoreState): CovidTotals => {
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

  getCovidCountyTotals: (state: CovidStoreState): CovidTotals => {
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

  getWorldwideCaseRankings: (state: CovidStoreState): CovidRankingData[] =>
    rankCovidData([...state.covidCountryData], 'country', 'casesPerOneMillion'),

  getWorldwideDeathRankings: (state: CovidStoreState): CovidRankingData[] =>
    rankCovidData([...state.covidCountryData], 'country', 'deathsPerOneMillion'),

  getWorldwideTestRankings: (state: CovidStoreState): CovidRankingData[] =>
    rankCovidData([...state.covidCountryData], 'country', 'testsPerOneMillion'),
  /*
   * Map historical data values for the chosen data types: cases, deaths, and recovered to
   * CovidLineChart data structure.
   */
  getCovidChartData: (state: CovidStoreState): CovidLineChart[] => {
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
  renderStateTotals: (state: CovidStoreState): boolean =>
    state.selectedCountry === 'USA' && state.selectedState.length > 0,

  renderCountyTotals: (state: CovidStoreState): boolean => state.selectedCountry === 'USA'
    && state.selectedState.length > 0
    && state.selectedCovidCountyData.state === state.selectedState
}

export const mutations = {
  setSelectedCountry: (state: CovidStoreState, country: SelectItem): void => {
    state.selectedCountry = country.name
  },

  setSelectedState: (state: CovidStoreState, selectedState: SelectItem): void => {
    state.selectedState = selectedState.name
  },

  setSelectedCounty: (state: CovidStoreState, county: SelectItem): void => {
    state.selectedCounty = county.name
  },

  setSelectedDates: (state: CovidStoreState, dates: DateRange): void => {
    state.selectedDates = dates
  },
  /**
   * Iterates through all countries, converts countries and country to lowercase, and assigns to
   * selectedCovidCountryData state.  Asserts that country is not null, since country comes from the Covid
   * API and is sure to exist.  This is the same for the selected state data as well.
   */
  setSelectedCovidCountryData: (state: CovidStoreState): void => {
    state.selectedCovidCountryData = state.covidCountryData.find((data: CovidCountryData): boolean =>
      data.country!.toLowerCase().includes(state.selectedCountry.toLowerCase())
    )!
  },

  setSelectedCovidStateData: (state: CovidStoreState): void => {
    state.selectedCovidStateData = state.covidStateData.find((data: CovidStateData): boolean =>
      data.state!.toLowerCase().includes(state.selectedState.toLowerCase())
    )!
  },

  setSelectedCovidCountyData: (state: CovidStoreState): void => {
    state.selectedCovidCountyData = state.covidCountyData.find((data: CovidCountyData): boolean =>
      data.county!.toLowerCase().includes(state.selectedCounty.toLowerCase())
    )!
  },

  setCovidGlobalData: (state: CovidStoreState, data: CovidGlobalData): void => {
    state.covidGlobalData = data
  },

  setCovidCountryData: (state: CovidStoreState, data: CovidCountryData[]): void => {
    state.covidCountryData = data
  },

  setCovidStateData: (state: CovidStoreState, data: CovidStateData[]): void => {
    state.covidStateData = data
  },

  setCovidCountyData: (state: CovidStoreState, data: CovidCountyData[]): void => {
    state.covidCountyData = data
  },

  setCovidVaccineGlobalData: (state: CovidStoreState, data: number): void => {
    state.covidGlobalData.vaccinated = data
  },

  /* We loop through each country and get the maps value using the country name as the key */
  setCovidVaccineCountryData: (state: CovidStoreState, data: Map<string, number>) => {
    state.covidCountryData.forEach((countryTotal: CovidCountryData): void => {
      countryTotal.vaccinated = data.get(countryTotal.country.toLowerCase())
    })
  },

  setHistoricalCountryData: (state: CovidStoreState, data: CovidHistoricalData): void => {
    state.covidHistoricalCountryData = data
  },

  setSelectedCovidDataType: (state: CovidStoreState, dataType: SelectItem[]): void => {
    state.selectedCovidDataType = dataType
  },

  setSelectedResultType: (state: CovidStoreState, resultType: ResultType): void => {
    state.selectedResultType = resultType
  },

  setSelectedGraphType: (state: CovidStoreState, graphType: GraphType): void => {
    state.selectedGraphType = graphType
  }
}

export const actions = {
  getCovidGlobalData: async ({ commit }: ActionContext<CovidStoreState, RS>): Promise<void> => {
    const covidGlobalDataEP = covidEP.COVID_API_BASE_URL + covidEP.COVID_API_GLOBAL_TOTALS
    const res: AxiosResponse<CovidData> = await axios.get(covidGlobalDataEP)
    commit('setCovidGlobalData', CovidDataMapper.map<CovidGlobalData>(res.data))
  },

  getCovidCountryData: async ({ commit }: ActionContext<CovidStoreState, RS>): Promise<void> => {
    const covidCountryDataEP = covidEP.COVID_API_BASE_URL + covidEP.COVID_API_ALL_COUNTRIES
    const res: AxiosResponse<CovidData[]> = await axios.get(covidCountryDataEP)
    const data: CovidCountryData[] = res.data.map((data: CovidData): CovidCountryData =>
      CovidDataMapper.map<CovidCountryData>(data)
    )
    commit('setCovidCountryData', data)
  },

  getCovidStateData: async ({ commit }: ActionContext<CovidStoreState, RS>): Promise<void> => {
    const covidStateDataEP = covidEP.COVID_API_BASE_URL + covidEP.COVID_API_STATE_TOTALS
    const res: AxiosResponse<CovidData[]> = await axios.get(covidStateDataEP)
    const data: CovidStateData[] = res.data.map((data: CovidData): CovidStateData =>
      CovidDataMapper.map<CovidStateData>(data)
    )
    commit('setCovidStateData', data)
  },

  /* County data needs to be cleaned since it is the most different from the rest of the data. */
  getCovidCountyData: async ({ commit }: ActionContext<CovidStoreState, RS>): Promise<void> => {
    const covidCountyDataEP = covidEP.COVID_API_BASE_URL + covidEP.COVID_API_COUNTY_TOTALS
    const res: AxiosResponse<CovidCountyDataRaw[]> = await axios.get(covidCountyDataEP)
    const covidCountyData: CovidCountyData[] = res.data.map((d: CovidCountyDataRaw): CovidCountyData => {
      return {
        country: d.country,
        state: d.province,
        county: d.county,
        updated: parseInt(d.updatedAt),
        cases: d.stats.confirmed,
        recovered: d.stats.recovered,
        deaths: d.stats.deaths
      }
    })
    commit('setCovidCountyData', covidCountyData)
  },

  /* Vaccine data is queried just for the latest date but it is returned as a key value pair with the key
     being a date string in the format of 'xx/xx/xxxx', so we just loop over for simplicity instead of
     delcaring an interface with an index signature or getting the current date. */
  getCovidVaccineGlobalData: async ({ commit }: ActionContext<CovidStoreState, RS>): Promise<void> => {
    const vaccineGlobalDataEP = covidEP.COVID_API_BASE_URL + covidEP.COVID_API_VACCINE_GLOBAL_TOTALS
    const res = await axios.get(vaccineGlobalDataEP)
    Object.keys(res.data).forEach((key: string): void => {
      commit('setCovidVaccineGlobalData', res.data[key])
    })
  },

  /* We pre-process the vaccination data per country into a map that has the country name in lowercase as
     the key and the value as the total vaccinations */
  getCovidVaccineCountryData: async ({ commit }: ActionContext<CovidStoreState, RS>): Promise<void> => {
    const vaccineCountryDataEP = covidEP.COVID_API_BASE_URL + covidEP.COVID_API_VACCINE_ALL_COUNTRIES
    const res = await axios.get(vaccineCountryDataEP)
    const countryVaccinatedData: Map<string, number> = new Map<string, number>()

    // eslint-disable-next-line
    res.data.forEach((data: any) => {
      let vaccinated = 0
      Object.keys(data.timeline).forEach((key: string): void => { vaccinated = data.timeline[key] })
      countryVaccinatedData.set(data.country.toLowerCase(), vaccinated)
    })

    commit('setCovidVaccineCountryData', countryVaccinatedData)
  },
  /**
   * Gets historical covid data for specific country.  Goes back to a default of 30 days unless otherwise
   * specified.
   */
  getHistoricalCountryData: async ({ commit, state }: ActionContext<CovidStoreState, RS>): Promise<void> => {
    let numOfDays = ''

    const today = moment.utc()
    const startDate = moment.utc(state.selectedDates.startDate)
    const endDate = moment.utc(state.selectedDates.endDate)
    const endDateNotToday = !today.isSame(endDate, 'day')
    const hasSpecificDates = Object.values(state.selectedDates).length === 2
    /**
     * If we have specific dates we calculate how many days to query.
     */
    if (hasSpecificDates) {
      numOfDays = today.diff(startDate, 'days').toString()
    }

    const path = covidEP.COVID_API_HISTORICAL_COUNTRY_DATES
      .replace('country', state.selectedCountry)
      .replace('numOfDays', numOfDays)
    const res = await axios.get(covidEP.COVID_API_BASE_URL + path)
    /**
     * If the specified dates end date is not today, we calculate which dates to include.
     */
    if (endDateNotToday) {
      trimToSpecificDateRange(res.data.timeline.cases, startDate, endDate)
      trimToSpecificDateRange(res.data.timeline.deaths, startDate, endDate)
      trimToSpecificDateRange(res.data.timeline.recovered, startDate, endDate)
    }
    /**
     * Map cases, deaths, and recovered into CovidHistoricalData timeline type.
     */
    const formattedData: CovidHistoricalData = {
      country: res.data.country,
      province: res.data.province,
      timeline: {
        cases: mapHistoricalDataToDateValue(res.data.timeline.cases),
        deaths: mapHistoricalDataToDateValue(res.data.timeline.deaths),
        recovered: mapHistoricalDataToDateValue(res.data.timeline.recovered)
      }
    }

    commit('setHistoricalCountryData', formattedData)
  }
}

/**
 * Helper function that trims the queried dates to a specific range.
 */
// eslint-disable-next-line
const trimToSpecificDateRange = (data: any, startDate: moment.Moment, endDate: moment.Moment): any => {
  Object.keys(data).forEach((key: string): void => {
    const date = moment.utc(key)

    if (date.isBefore(startDate, 'day') || date.isAfter(endDate, 'day')) {
      delete data[key]
    }
  })
}
/**
 * Helper function for mapping historical data.
 */
// eslint-disable-next-line
const mapHistoricalDataToDateValue = (data: any): DateValue[] =>
  Object.entries(data).map((x: unknown[]): DateValue => {
    return {
      date: x[0] as string,
      value: x[1] as number
    }
  })
/**
 * Creates covid chart data based on the selected result type.
 */
// eslint-disable-next-line
const determineCovidChartData = (data: any, resultType: ResultType): number[] => {
  let result: number[] = []

  if (resultType.value === 'total') {
    // eslint-disable-next-line
    result = data.map((d: any) => d.value)
  } else if (resultType.value === 'totalPerDay') {
    /**
     * next element - current element, gives us the data for the current day.  This excludes
     * the very last day.
     */
    for (let x = 0; x < data.length; x++) {
      if (x + 1 < data.length) {
        result.push((data[x + 1].value - data[x].value))
      }
    }
  }

  return result
}
/**
 * Sorts the data in descending order, returns the top x amount, and returns the data name and data total
 * @param covidData - Any data that has baseData field
 * @param covidDataScale - country, state
 * @param covidDataType - casesPerOneMillion, deathsPerOneMillion, testsPerOneMillion
 */
function rankCovidData(covidData: CovidDataType[], covidDataScale: string, covidDataType: string): CovidRankingData[] {
  const sortAscending = (current: CovidDataType, next: CovidDataType): number =>
    next.baseData[covidDataType] - current.baseData[covidDataType]
  const nameAndTotal = (data: CovidDataType): CovidRankingData => {
    return {
      // eslint-disable-next-line
      name: (data as any)[covidDataScale], 
      total: data.baseData[covidDataType]
    }
  }

  return covidData
    .sort(sortAscending)
    .slice(0, 10)
    .map(nameAndTotal)
}

type CovidDataType = CovidCountryData | CovidStateData

export const covid = {
  state: state,
  getters: getters,
  mutations: mutations,
  actions: actions
}
