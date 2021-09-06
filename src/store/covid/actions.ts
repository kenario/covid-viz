import moment from 'moment'
import axios, { AxiosResponse } from 'axios'

import { RS } from '../RS'
import { ActionContext } from 'vuex'
import { covidEP } from '@/shared/constants'
import { CovidStateType } from './CovidStateType'
import { CovidDataMapper } from '@/shared/CovidDataMapper'
import { transformVaccineDataToMap, processHistoricalData } from './helpers'

import {
  CovidData,
  CovidStateData,
  CovidGlobalData,
  CovidCountyData,
  CovidCountryData,
  CovidCountyDataRaw,
  CovidRawHistoricalData
} from '@/types/covid'

export const actions = {
  getCovidGlobalData: async ({ commit }: ActionContext<CovidStateType, RS>): Promise<void> => {
    const covidGlobalDataEP = covidEP.COVID_API_BASE_URL + covidEP.COVID_API_GLOBAL_TOTALS
    const baseDataRes: AxiosResponse<CovidData> = await axios.get(covidGlobalDataEP)
    baseDataRes.data.updated = moment(baseDataRes.data.updated).format('MMM D, YYYY, h:mm:ss a')
    commit('setCovidGlobalData', CovidDataMapper.map<CovidGlobalData>(baseDataRes.data))
  },

  getCovidCountryData: async ({ commit }: ActionContext<CovidStateType, RS>): Promise<void> => {
    const covidCountryDataEP = covidEP.COVID_API_BASE_URL + covidEP.COVID_API_ALL_COUNTRIES
    const baseDataRes: AxiosResponse<CovidData[]> = await axios.get(covidCountryDataEP)
    const data: CovidCountryData[] = baseDataRes.data.map((data: CovidData): CovidCountryData => {
      data.updated = moment(data.updated).format('MMM D, YYYY, h:mm:ss a')
      return CovidDataMapper.map<CovidCountryData>(data)
    })
    commit('setCovidCountryData', data)
  },

  getCovidStateData: async ({ commit }: ActionContext<CovidStateType, RS>): Promise<void> => {
    const covidStateDataEP = covidEP.COVID_API_BASE_URL + covidEP.COVID_API_STATE_TOTALS
    const baseDataRes: AxiosResponse<CovidData[]> = await axios.get(covidStateDataEP)
    const data: CovidStateData[] = baseDataRes.data.map((data: CovidData): CovidStateData => {
      data.updated = moment(data.updated).format('MMM D, YYYY, h:mm:ss a')
      return CovidDataMapper.map<CovidStateData>(data)
    })
    commit('setCovidStateData', data)
  },

  /* County data needs to be cleaned since it is the most different from the rest of the data. */
  getCovidCountyData: async ({ commit }: ActionContext<CovidStateType, RS>): Promise<void> => {
    const covidCountyDataEP = covidEP.COVID_API_BASE_URL + covidEP.COVID_API_COUNTY_TOTALS
    const baseDataRes: AxiosResponse<CovidCountyDataRaw[]> = await axios.get(covidCountyDataEP)
    const covidCountyData: CovidCountyData[] = baseDataRes.data.map((data: CovidCountyDataRaw): CovidCountyData => {
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
    const baseDataRes = await axios.get(vaccineGlobalDataEP)
    Object.keys(baseDataRes.data).forEach((key: string): void => {
      commit('setCovidVaccineGlobalData', baseDataRes.data[key])
    })
  },

  /*
   * Process vaccination data into a map with the country it belongs to as the key and the vaccination
   * count as the value.  This will make for an easier merge with the main country covid data structure. */
  getCovidVaccineCountryData: async ({ commit }: ActionContext<CovidStateType, RS>): Promise<void> => {
    const vaccineCountryDataEP = covidEP.COVID_API_BASE_URL + covidEP.COVID_API_VACCINE_ALL_COUNTRIES
    const baseDataRes = await axios.get(vaccineCountryDataEP)
    const countryVaccinatedData: Map<string, number> = transformVaccineDataToMap(baseDataRes.data, 'country')

    commit('setCovidVaccineCountryData', countryVaccinatedData)
  },

  /*
   * Process vaccination data into a map with the state it belongs to as the key and the vaccination
   * count as the value.  This will make for an easier merge with the main state covid data structure. */
  getCovidVaccineStateData: async ({ commit }: ActionContext<CovidStateType, RS>): Promise<void> => {
    const vaccineStateDataEP = covidEP.COVID_API_BASE_URL + covidEP.COVID_API_VACCINE_ALL_STATES
    const baseDataRes = await axios.get(vaccineStateDataEP)
    const stateVaccinatedData: Map<string, number> = transformVaccineDataToMap(baseDataRes.data, 'state')

    commit('setCovidVaccineStateData', stateVaccinatedData)
  },

  getHistoricalCountryData: async ({ commit, state }: ActionContext<CovidStateType, RS>): Promise<void> => {
    let numOfDays = ''

    const today = moment.utc()
    const startDate = moment.utc(state.selectedDates.startDate)
    const endDate = moment.utc(state.selectedDates.endDate)
    const hasSpecificDates = Object.values(state.selectedDates).length === 2

    /*
     * Without specific dates, the number of days default is 30, which is initialized in the entry point
     * but should probably be moved into this function. */
    if (hasSpecificDates) {
      numOfDays = today.diff(startDate, 'days').toString()
    }

    const baseDataPath = covidEP.COVID_API_HISTORICAL_COUNTRY_DATA
      .replace('country', state.selectedCountry)
      .replace('numOfDays', numOfDays)
    const vaccineDataPath = covidEP.COVID_API_HISTORICAL_COUNTRY_VACCINE
      .replace('country', state.selectedCountry)
      .replace('numOfDays', numOfDays)
    const [baseDataRes, vaccineDataRes] = await Promise.all([
      axios.get(covidEP.COVID_API_BASE_URL + baseDataPath),
      axios.get(covidEP.COVID_API_BASE_URL + vaccineDataPath)
    ])

    const rawData: CovidRawHistoricalData = {
      country: baseDataRes.data.country,
      timeline: baseDataRes.data.timeline
    }
    rawData.timeline.vaccinated = vaccineDataRes.data.timeline

    commit('setHistoricalCountryData', processHistoricalData(rawData, startDate, endDate))
  },

  // getHistoricalStateData: async ({ commit, state }: ActionContext<CovidStateType, RS>): Promise<void> => {
  //   let numOfDays = ''

  //   const today = moment.utc()
  //   const vaccineStartDate = moment.utc('12/1/2020', 'M/D/YY')
  //   const startDate = moment.utc(state.selectedDates.startDate)
  //   const endDate = moment.utc(state.selectedDates.endDate)
  //   const endDateNotToday = !today.isSame(endDate, 'day')
  //   const hasSpecificDates = Object.values(state.selectedDates).length === 2

  //   if (hasSpecificDates) {
  //     numOfDays = today.diff(startDate, 'days').toString()
  //   }

  //   const baseDataPath = covidEP.COVID_API_HISTORICAL_STATE_DATA
  //     .replace('state', state.selectedState)
  //     .replace('numOfDays', numOfDays)
  //   const vaccineDataPath = covidEP.COVID_API_HISTORICAL_STATE_VACCINE
  //     .replace('state', state.selectedState)
  //     .replace('numOfDays', numOfDays)
  //   const [baseDataRes, vaccineDataRes] = await Promise.all([
  //     axios.get(covidEP.COVID_API_BASE_URL + baseDataPath),
  //     axios.get(covidEP.COVID_API_BASE_URL + vaccineDataPath)
  //   ])

  //   /*
  //    * Vaccine related data does not exist before 12/1/2020, so when we query for historical data
  //    * before that time, we get a longer array of cases, deaths, and recoveries.  When the chart
  //    * is created using that data, vaccine data is joined with earliest dates of cases, deaths,
  //    * and recoveries. In this case, we have to perform some processing on vaccine data. */
  //   if (startDate.isBefore(vaccineStartDate)) {
  //     const cleanVaccineData: any = {}
  //     const dirtyVaccineData: any = vaccineDataRes.data.timeline
  //     const dates = Object.keys(baseDataRes.data.timeline.cases)

  //     /*
  //      * Removes dates on or after 12/1/2020 and creates new vaccine data with any
  //      * queried dates before 12/1/2020. */
  //     dates.length = dates.indexOf('12/1/20')
  //     dates.forEach((date: string): void => {
  //       cleanVaccineData[date] = 0
  //     })

  //     /*
  //      * Using custom process of merging data since merging using spread operator seems
  //      * to eliminate all days 1 through 12 of any given month. */
  //     Object.keys(dirtyVaccineData).forEach((key: string): void => {
  //       cleanVaccineData[key] = dirtyVaccineData[key]
  //     })
  //     vaccineDataRes.data.timeline = cleanVaccineData
  //   }
  // }
}
