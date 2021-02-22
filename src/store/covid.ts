import axios, { AxiosResponse } from 'axios'
import moment from 'moment'
import { ActionContext } from 'vuex'
import { covidEP } from '../shared/constants/'
import {
  DateValue,
  DateRange,
  CovidData,
  GraphType,
  CovidState,
  SelectItem,
  ResultType,
  CountryInfo,
  CovidLineChart,
  CovidCountryData,
  CovidGlobalData,
  CovidStateData,
  CovidCountyData,
  CovidGeneralInfo,
  CovidCountyDataRaw,
  CovidHistoricalData
} from '../types/'

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
  covidGlobalTotals: {} as CovidGlobalData,
  covidCountryTotals: [] as CovidCountryData[],
  covidStateTotals: [] as CovidStateData[],
  covidCountyTotals: [] as CovidCountyData[],
  covidHistoricalCountryData: {} as CovidHistoricalData
})

export const getters = {
  getSelectedCountry: (state: CovidState): string => state.selectedCountry,

  getSelectedState: (state: CovidState): string => state.selectedState,

  getSelectedCounty: (state: CovidState): string => state.selectedCounty,

  getSelectedGraphType: (state: CovidState): GraphType => state.selectedGraphType,

  getSelectedResultType: (state: CovidState): ResultType => state.selectedResultType,

  getNumberOfSelectedCovidDataTypes: (state: CovidState): string =>
    `(${state.selectedCovidDataType.length}) data types selected`,
  /*
   * Map all affected countries names and country codes.
   */
  getAllAffectedCountries: (state: CovidState): CountryInfo[] =>
    state.covidCountryTotals.map((data: CovidCountryData): CountryInfo => {
      return { name: data.country!, countryCode: data.countryInfo?.iso2! }
    }),
  /*  Map all affected state names. */
  getAllAffectedStates: (state: CovidState): SelectItem[] =>
    state.covidStateTotals.map((data: CovidStateData): SelectItem => {
      return { name: data.state, value: data.state.toLowerCase() }
    }),
  /* Map all affected counties of the selected state. */
  getStatesAffectedCounties: (state: CovidState): SelectItem[] =>
    state.covidCountyTotals
      .filter((data: CovidCountyData): boolean => data.state === state.selectedState)
      .map((data: CovidCountyData): SelectItem => {
        return { name: data.county, value: data.county.toLowerCase() }
      }),
  /*
   * Map the dates provided by the selected countries historical data.
   */
  getCovidChartLabels: (state: CovidState): string[] =>
    state.covidHistoricalCountryData.timeline?.cases.map((x: DateValue): string => x.date),

  getCovidGlobalGeneralInfo: (state: CovidState): CovidGeneralInfo => {
    const data: CovidGlobalData = state.covidGlobalTotals

    return {
      cases: data.cases,
      deaths: data.deaths,
      recovered: data.recovered,
      tests: data.tests,
      updated: data.updated
    }
  },

  getCovidCountryGeneralInfo: (state: CovidState): CovidGeneralInfo => {
    const data: CovidCountryData = state.selectedCovidCountryData

    return {
      country: data.country,
      cases: data.cases,
      deaths: data.deaths,
      recovered: data.recovered,
      tests: data.tests,
      updated: data.updated
    }
  },

  getCovidStateGeneralInfo: (state: CovidState): CovidGeneralInfo => {
    const data: CovidStateData = state.selectedCovidStateData

    return {
      state: data.state,
      cases: data.cases,
      deaths: data.deaths,
      tests: data.tests,
      updated: data.updated
    }
  },

  getCovidCountyGeneralInfo: (state: CovidState): CovidGeneralInfo => {
    const data: CovidCountyData = state.selectedCovidCountyData

    return {
      county: data.county,
      cases: data.cases,
      deaths: data.deaths,
      recovered: data.recovered,
      updated: data.updated
    }
  },
  /*
   * Map historical data values for the chosen data types: cases, deaths, and recovered to
   * CovidLineChart data structure.
   */
  getCovidChartData: (state: CovidState): CovidLineChart[] => {
    const covidChartData: CovidLineChart[] = []

    if (state.covidHistoricalCountryData.timeline) {
      state.selectedCovidDataType.forEach((type: SelectItem): void => {
        covidChartData.push({
          label: type.name,
          data: determineCovidChartData(state.covidHistoricalCountryData.timeline[type.value], state.selectedResultType)
        })
      })
    }

    return covidChartData
  }
}

export const mutations = {
  setSelectedCountry: (state: CovidState, country: SelectItem): void => {
    state.selectedCountry = country.name
  },

  setSelectedState: (state: CovidState, selectedState: SelectItem): void => {
    state.selectedState = selectedState.name
  },

  setSelectedCounty: (state: CovidState, county: SelectItem): void => {
    state.selectedCounty = county.name
  },

  setSelectedDates: (state: CovidState, dates: DateRange): void => {
    state.selectedDates = dates
  },
  /**
   * Iterates through all countries, converts countries and country to lowercase, and assigns to
   * selectedCovidCountryData state.  Asserts that country is not null, since country comes from the Covid
   * API and is sure to exist.  This is the same for the selected state data as well.
   */
  setSelectedCovidCountryData: (state: CovidState): void => {
    state.selectedCovidCountryData = state.covidCountryTotals
      .find((data: CovidCountryData): boolean => data.country!.toLowerCase().includes(state.selectedCountry.toLowerCase()))!
  },

  setSelectedCovidStateData: (state: CovidState): void => {
    state.selectedCovidStateData = state.covidStateTotals
      .find((data: CovidStateData): boolean => data.state!.toLowerCase().includes(state.selectedState.toLowerCase()))!
  },

  setSelectedCovidCountyData: (state: CovidState): void => {
    state.selectedCovidCountyData = state.covidCountyTotals
      .find((data: CovidCountyData): boolean => data.county!.toLowerCase().includes(state.selectedCounty.toLowerCase()))!
  },

  setCovidGlobalTotals: (state: CovidState, data: CovidGlobalData): void => {
    state.covidGlobalTotals = data
  },

  setCovidCountryTotals: (state: CovidState, data: CovidCountryData[]): void => {
    state.covidCountryTotals = data
  },

  setCovidStateTotals: (state: CovidState, data: CovidStateData[]): void => {
    state.covidStateTotals = data
  },

  setCovidCountyTotals: (state: CovidState, data: CovidCountyData[]): void => {
    state.covidCountyTotals = data
  },

  setHistoricalCountryData: (state: CovidState, data: CovidHistoricalData): void => {
    state.covidHistoricalCountryData = data
  },

  setSelectedCovidDataType: (state: CovidState, dataType: SelectItem[]): void => {
    state.selectedCovidDataType = dataType
  },

  setSelectedResultType: (state: CovidState, resultType: ResultType): void => {
    state.selectedResultType = resultType
  },

  setSelectedGraphType: (state: CovidState, graphType: GraphType): void => {
    state.selectedGraphType = graphType
  }
}

export const actions = {
  getCovidGlobalTotals: async ({ commit }: ActionContext<CovidState, RS>): Promise<void> => {
    const res: AxiosResponse<CovidData> = await axios.get(covidEP.COVID_API_BASE_URL + covidEP.COVID_API_GLOBAL_TOTALS)
    commit('setCovidGlobalTotals', res.data)
  },

  getCovidCountryTotals: async ({ commit }: ActionContext<CovidState, RS>): Promise<void> => {
    const res: AxiosResponse<CovidData[]> = await axios.get(covidEP.COVID_API_BASE_URL + covidEP.COVID_API_ALL_COUNTRIES)
    commit('setCovidCountryTotals', res.data)
  },

  getCovidStateTotals: async ({ commit }: ActionContext<CovidState, RS>): Promise<void> => {
    const res: AxiosResponse<CovidData[]> = await axios.get(covidEP.COVID_API_BASE_URL + covidEP.COVID_API_STATE_TOTALS)
    commit('setCovidStateTotals', res.data)
  },
  /* County data needs to be cleaned since it is the most different from the rest of the data. */
  getCovidCountyTotals: async ({ commit }: ActionContext<CovidState, RS>): Promise<void> => {
    const res: AxiosResponse<CovidCountyDataRaw[]> = await axios.get(covidEP.COVID_API_BASE_URL + covidEP.COVID_API_COUNTY_TOTALS)
    const covidCountyTotals: CovidCountyData[] = res.data.map((d: CovidCountyDataRaw): CovidCountyData => {
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
    commit('setCovidCountyTotals', covidCountyTotals)
  },
  /**
   * Gets historical covid data for specific country.  Goes back to a default of 30 days unless otherwise
   * specified.
   */
  getHistoricalCountryData: async ({ commit, state }: ActionContext<CovidState, RS>): Promise<void> => {
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

export const covid = {
  state: state,
  getters: getters,
  mutations: mutations,
  actions: actions
}
