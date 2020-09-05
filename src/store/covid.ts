import { ActionContext } from 'vuex'
import { covidEP } from '../shared/constants/'
import {
  CovidData,
  CovidGeneralInfo,
  CovidHistoricalData,
  CovidHistoricalDataParams
} from '../types/'

export const covid = {
  state: () => ({
    selectedCountry: '',
    selectedCovidData: {} as CovidData,
    covidDataAllCountries: [] as CovidData[],
    covidHistoricalCountryData: {} as CovidHistoricalData
  }),
  getters: {
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

    getAllAffectedCountries: (state: CovidState): string[] =>
      state.covidDataAllCountries.map((data: CovidData): string => data.country!)
  },
  mutations: {
    /**
     * Iterates through all countries, converts countries and country to lowercase, and assigns to
     * selectedCovidData state.  Asserts that country is not null, since country comes from the Covid
     * API and is sure to exist.
     */
    setSelectedCountry: (state: CovidState, country: string): void => {
      state.selectedCountry = country
      state.selectedCovidData = state.covidDataAllCountries
        .find((data: CovidData): boolean => data.country!.toLowerCase().includes(country.toLowerCase()))!
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
      commit('setSelectedCountry', 'USA')
    },

    /**
     * Gets historical covid data for specific country.  Goes back to a default of 30 days unless otherwise
     * specified.
     */
    getHistoricalCountryData: async ({ commit }: ActionContext<RS, RS>, payload: CovidHistoricalDataParams): Promise<void> => {
      const path = covidEP.COVID_API_HISTORICAL_COUNTRY_DATES
        .replace('country', payload.country)
        .replace('numOfDays', payload.numOfDays || '')

      const res = await fetch(covidEP.COVID_API_BASE_URL + path)
      const data = await res.json()

      /**
       * Map cases, deaths, and recovered into CovidHistoricalData timeline type.
       */
      const formattedData: CovidHistoricalData = {
        country: data.country,
        province: data.province,
        timeline: {
          cases: Object.entries(data.timeline.cases).map(x => { return { date: x[0], value: x[1] as number } }),
          deaths: Object.entries(data.timeline.deaths).map(x => { return { date: x[0], value: x[1] as number } }),
          recovered: Object.entries(data.timeline.recovered).map(x => { return { date: x[0], value: x[1] as number } })
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
  selectedCovidData: CovidData;
  covidDataAllCountries: CovidData[];
  covidHistoricalCountryData: CovidHistoricalData;
}
