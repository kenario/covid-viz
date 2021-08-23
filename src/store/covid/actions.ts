import moment from 'moment'
import axios, { AxiosResponse } from 'axios'

import { RS } from '../RS'
import { ActionContext } from 'vuex'
import { covidEP } from '@/shared/constants'
import { CovidStateType } from './CovidStateType'
import { CovidDataMapper } from '@/shared/CovidDataMapper'
import { trimToSpecificDateRange, mapHistoricalDataToDateValue, transformVaccineDataToMap } from './helpers'

import {
  CovidData,
  CovidStateData,
  CovidGlobalData,
  CovidCountyData,
  CovidCountryData,
  CovidCountyDataRaw,
  CovidHistoricalData
} from '@/types/covid'

export const actions = {
  getCovidGlobalData: async ({ commit }: ActionContext<CovidStateType, RS>): Promise<void> => {
    const covidGlobalDataEP = covidEP.COVID_API_BASE_URL + covidEP.COVID_API_GLOBAL_TOTALS
    const res: AxiosResponse<CovidData> = await axios.get(covidGlobalDataEP)
    res.data.updated = moment(res.data.updated).format('MMM D, YYYY, h:mm:ss a')
    commit('setCovidGlobalData', CovidDataMapper.map<CovidGlobalData>(res.data))
  },

  getCovidCountryData: async ({ commit }: ActionContext<CovidStateType, RS>): Promise<void> => {
    const covidCountryDataEP = covidEP.COVID_API_BASE_URL + covidEP.COVID_API_ALL_COUNTRIES
    const res: AxiosResponse<CovidData[]> = await axios.get(covidCountryDataEP)
    const data: CovidCountryData[] = res.data.map((data: CovidData): CovidCountryData => {
      data.updated = moment(data.updated).format('MMM D, YYYY, h:mm:ss a')
      return CovidDataMapper.map<CovidCountryData>(data)
    })
    commit('setCovidCountryData', data)
  },

  getCovidStateData: async ({ commit }: ActionContext<CovidStateType, RS>): Promise<void> => {
    const covidStateDataEP = covidEP.COVID_API_BASE_URL + covidEP.COVID_API_STATE_TOTALS
    const res: AxiosResponse<CovidData[]> = await axios.get(covidStateDataEP)
    const data: CovidStateData[] = res.data.map((data: CovidData): CovidStateData => {
      data.updated = moment(data.updated).format('MMM D, YYYY, h:mm:ss a')
      return CovidDataMapper.map<CovidStateData>(data)
    })
    commit('setCovidStateData', data)
  },

  /* County data needs to be cleaned since it is the most different from the rest of the data. */
  getCovidCountyData: async ({ commit }: ActionContext<CovidStateType, RS>): Promise<void> => {
    const covidCountyDataEP = covidEP.COVID_API_BASE_URL + covidEP.COVID_API_COUNTY_TOTALS
    const res: AxiosResponse<CovidCountyDataRaw[]> = await axios.get(covidCountyDataEP)
    const covidCountyData: CovidCountyData[] = res.data.map((data: CovidCountyDataRaw): CovidCountyData => {
      return CovidDataMapper.map<CovidCountyData>({
        country: data.country,
        state: data.province,
        county: data.county,
        updated: moment(data.updatedAt).format('MMM D, YYYY, h:mm:ss a'),
        cases: data.stats.confirmed,
        recovered: data.stats.recovered,
        deaths: data.stats.deaths
      })
    })
    commit('setCovidCountyData', covidCountyData)
  },

  /* Vaccine data is queried just for the latest date but it is returned as a single key value pair with
   * the key being a date string in the format of 'xx/xx/xxxx', so we just loop over for simplicity
   * instead of declaring an interface with an index signature or getting the current date. */
  getCovidVaccineGlobalData: async ({ commit }: ActionContext<CovidStateType, RS>): Promise<void> => {
    const vaccineGlobalDataEP = covidEP.COVID_API_BASE_URL + covidEP.COVID_API_VACCINE_GLOBAL_TOTALS
    const res = await axios.get(vaccineGlobalDataEP)
    Object.keys(res.data).forEach((key: string): void => {
      commit('setCovidVaccineGlobalData', res.data[key])
    })
  },

  /*
   * Process vaccination data into a map with the country it belongs to as the key and the vaccination
   * count as the value.  This will make for an easier merge with the main country covid data structure. */
  getCovidVaccineCountryData: async ({ commit }: ActionContext<CovidStateType, RS>): Promise<void> => {
    const vaccineCountryDataEP = covidEP.COVID_API_BASE_URL + covidEP.COVID_API_VACCINE_ALL_COUNTRIES
    const res = await axios.get(vaccineCountryDataEP)
    const countryVaccinatedData: Map<string, number> = transformVaccineDataToMap(res.data, 'country')

    commit('setCovidVaccineCountryData', countryVaccinatedData)
  },

  /*
   * Process vaccination data into a map with the state it belongs to as the key and the vaccination
   * count as the value.  This will make for an easier merge with the main state covid data structure. */
  getCovidVaccineStateData: async ({ commit }: ActionContext<CovidStateType, RS>): Promise<void> => {
    const vaccineStateDataEP = covidEP.COVID_API_BASE_URL + covidEP.COVID_API_VACCINE_ALL_STATES
    const res = await axios.get(vaccineStateDataEP)
    const stateVaccinatedData: Map<string, number> = transformVaccineDataToMap(res.data, 'state')

    commit('setCovidVaccineStateData', stateVaccinatedData)
  },

  /*
   * Gets historical covid data for specific country.  Goes back to a default of 30 days unless otherwise
   * specified.
   */
  getHistoricalCountryData: async ({ commit, state }: ActionContext<CovidStateType, RS>): Promise<void> => {
    let numOfDays = ''

    const today = moment.utc()
    const startDate = moment.utc(state.selectedDates.startDate)
    const endDate = moment.utc(state.selectedDates.endDate)
    const endDateNotToday = !today.isSame(endDate, 'day')
    const hasSpecificDates = Object.values(state.selectedDates).length === 2

    /*
     * If we have specific dates we calculate how many days to query. */
    if (hasSpecificDates) {
      numOfDays = today.diff(startDate, 'days').toString()
    }

    const path = covidEP.COVID_API_HISTORICAL_COUNTRY_DATES
      .replace('country', state.selectedCountry)
      .replace('numOfDays', numOfDays)
    const res = await axios.get(covidEP.COVID_API_BASE_URL + path)

    /*
     * If the specified dates end date is not today, we calculate which dates to include. */
    if (endDateNotToday) {
      trimToSpecificDateRange(res.data.timeline.cases, startDate, endDate)
      trimToSpecificDateRange(res.data.timeline.deaths, startDate, endDate)
      trimToSpecificDateRange(res.data.timeline.recovered, startDate, endDate)
    }

    /*
     * Map cases, deaths, and recovered into CovidHistoricalData timeline type. */
    const formattedData: CovidHistoricalData = {
      country: res.data.country,
      province: res.data.province,
      timeline: {
        cases: mapHistoricalDataToDateValue(res.data.timeline.cases),
        deaths: mapHistoricalDataToDateValue(res.data.timeline.deaths),
        recovered: mapHistoricalDataToDateValue(res.data.timeline.recovered)
      }
    }

    commit('setSelectedHistoricalCovidData', formattedData)
  }

  // getHistoricalCountryVaccineData: async ({ commit, state }: ActionContext<CovidStateType, RS>): Promise<void> => {

  // }
}
