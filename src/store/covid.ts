import moment from 'moment'
import { ActionContext } from 'vuex'
import { covidEP } from '../shared/constants/'
import {
  DateValue,
  DateRange,
  CovidData,
  CovidLineChart,
  CovidGeneralInfo,
  CovidHistoricalData
} from '../types/'

export const covid = {
  state: () => ({
    selectedCountry: '',
    selectedDates: {} as DateRange,
    selectedCovidData: {} as CovidData,
    covidDataAllCountries: [] as CovidData[],
    covidHistoricalCountryData: {} as CovidHistoricalData
  }),
  getters: {
    getSelectedCountry: (state: CovidState): string => state.selectedCountry,

    getAllAffectedCountries: (state: CovidState): string[] =>
      state.covidDataAllCountries.map((data: CovidData): string => data.country!),

    getCovidChartLabels: (state: CovidState): string[] =>
      state.covidHistoricalCountryData.timeline?.cases.map((x: DateValue): string => x.date),

    /**
     * Map covid data into CovidGeneralInfo type.
     */
    getCovidGeneralInfo: (state: CovidState): CovidGeneralInfo => {
      const data: CovidData = state.selectedCovidData

      return {
        country: data.country,
        cases: data.cases,
        deaths: data.deaths,
        recovered: data.recovered,
        tests: data.tests,
        updated: data.updated,
        casesToday: data.todayCases
      }
    },

    /**
     * Map historical data values for cases, deaths, and recovered to CovidLineChart data structure.
     */
    getCovidChartData: (state: CovidState): CovidLineChart[] => {
      const covidChartData: CovidLineChart[] = []

      if (state.covidHistoricalCountryData.timeline) {
        Object.keys(state.covidHistoricalCountryData.timeline).forEach((key: string): void => {
          covidChartData.push({
            label: key,
            data: state.covidHistoricalCountryData.timeline[key].map(x => x.value)
          })
        })
      }

      return covidChartData
    }
  },
  mutations: {
    setSelectedCountry: (state: CovidState, country: string): void => {
      state.selectedCountry = country
    },

    setSelectedDates: (state: CovidState, dates: DateRange): void => {
      state.selectedDates = dates
    },

    /**
     * Iterates through all countries, converts countries and country to lowercase, and assigns to
     * selectedCovidData state.  Asserts that country is not null, since country comes from the Covid
     * API and is sure to exist.
     */
    setSelectedCovidData: (state: CovidState): void => {
      state.selectedCovidData = state.covidDataAllCountries
        .find((data: CovidData): boolean => data.country!.toLowerCase().includes(state.selectedCountry.toLowerCase()))!
    },

    setCovidDataAllCountries: (state: CovidState, data: CovidData[]): void => {
      state.covidDataAllCountries = data
    },

    setHistoricalCountryData: (state: CovidState, data: CovidHistoricalData): void => {
      state.covidHistoricalCountryData = data
    }
  },
  actions: {
    /**
     * Gets covid data for all countries and sets the default selected covid data.  Should be prior choice or
     * location, respectively.  Currently set to USA, will change.
     */
    getCovidDataAllCountries: async ({ commit }: ActionContext<RS, RS>): Promise<void> => {
      const res = await fetch(covidEP.COVID_API_BASE_URL + covidEP.COVID_API_ALL_COUNTRIES)
      const data = await res.json()
      commit('setCovidDataAllCountries', data)
      commit('setSelectedCovidData')
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
      const specificDates = Object.values(state.selectedDates).length === 2

      /**
       * If we have specific dates we calculate how many days to query.
       */
      if (specificDates) {
        numOfDays = today.diff(startDate, 'days').toString()
      }

      const path = covidEP.COVID_API_HISTORICAL_COUNTRY_DATES
        .replace('country', state.selectedCountry)
        .replace('numOfDays', numOfDays)
      const res = await fetch(covidEP.COVID_API_BASE_URL + path)
      const data = await res.json()

      /**
       * If the specified dates end date is not today, we calculate which dates to include.
       */
      if (endDateNotToday) {
        trimToSpecificDateRange(data.timeline.cases, startDate, endDate)
        trimToSpecificDateRange(data.timeline.deaths, startDate, endDate)
        trimToSpecificDateRange(data.timeline.recovered, startDate, endDate)
      }

      /**
       * Map cases, deaths, and recovered into CovidHistoricalData timeline type.
       */
      const formattedData: CovidHistoricalData = {
        country: data.country,
        province: data.province,
        timeline: {
          cases: mapHistoricaDataToDateValue(data.timeline.cases),
          deaths: mapHistoricaDataToDateValue(data.timeline.deaths),
          recovered: mapHistoricaDataToDateValue(data.timeline.recovered)
        }
      }

      commit('setHistoricalCountryData', formattedData)
    }
  }
}

// RootState
interface RS {
  value: string;
}

interface CovidState {
  selectedCountry: string;
  selectedDates: DateRange;
  selectedCovidData: CovidData;
  covidDataAllCountries: CovidData[];
  covidHistoricalCountryData: CovidHistoricalData;
}

/**
 * Helper function that trims the queried dates to a specific range.
 */
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
const mapHistoricaDataToDateValue = (data: any): DateValue[] =>
  Object.entries(data).map((x: unknown[]): DateValue => {
    return {
      date: x[0] as string,
      value: x[1] as number
    }
  })
