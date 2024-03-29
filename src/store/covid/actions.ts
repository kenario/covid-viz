import moment from 'moment'
import axios, { AxiosResponse } from 'axios'

import { RS } from '../RS'
import { ActionContext } from 'vuex'
import { covidEP } from '@/shared/constants'
import { CovidStateType } from './CovidStateType'
import { CovidDataMapper } from '@/shared/CovidDataMapper'
import {
  processHistoricalData,
  transformVaccineDataToMap,
  transformDashDateToSlashDate,
  generateEmptyCovidRawHistoricalData
} from './helpers'

import {
  CovidData,
  CovidStateData,
  CovidGlobalData,
  CovidCountyData,
  CovidCountryData,
  CovidCountyDataRaw,
  CovidRawHistoricalData
} from '@/types/covid'
import { DataScale, SelectItem } from '@/types'

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
    const rawData: CovidRawHistoricalData = generateEmptyCovidRawHistoricalData()

    if (hasSpecificDates) {
      numOfDays = today.diff(startDate, 'days').toString()
    }

    const baseDataPath = covidEP.COVID_API_HISTORICAL_COUNTRY_DATA
      .replace('country', state.selectedCountry)
      .replace('numOfDays', numOfDays)
    const vaccineDataPath = covidEP.COVID_API_HISTORICAL_COUNTRY_VACCINE
      .replace('country', state.selectedCountry)
      .replace('numOfDays', numOfDays)

    commit('setIsLoading', true)
    const [baseDataRes, vaccineDataRes] = await Promise.all([
      axios.get(covidEP.COVID_API_BASE_URL + baseDataPath),
      axios.get(covidEP.COVID_API_BASE_URL + vaccineDataPath)
    ])
    commit('setIsLoading', false)

    rawData.country = baseDataRes.data.country
    rawData.timeline = baseDataRes.data.timeline
    rawData.timeline.vaccinated = vaccineDataRes.data.timeline

    commit('setHistoricalCountryData', processHistoricalData(rawData, startDate, endDate))
  },

  getHistoricalStateData: async ({ commit, state }: ActionContext<CovidStateType, RS>): Promise<void> => {
    let numOfDays = '30'

    const today = moment.utc()
    const startDate = moment.utc(state.selectedDates.startDate)
    const endDate = moment.utc(state.selectedDates.endDate)
    const hasSpecificDates = Object.values(state.selectedDates).length === 2
    const rawData: CovidRawHistoricalData = generateEmptyCovidRawHistoricalData()

    if (hasSpecificDates) {
      numOfDays = today.diff(startDate, 'days').toString()
    }

    const baseDataPath = covidEP.COVID_API_HISTORICAL_STATE_DATA
      .replace('{state}', state.selectedState)
      .replace('numOfDays', numOfDays)
    const vaccineDataPath = covidEP.COVID_API_HISTORICAL_STATE_VACCINE
      .replace('{state}', state.selectedState)
      .replace('numOfDays', numOfDays)

    commit('setIsLoading', true)
    const [baseDataRes, vaccineDataRes] = await Promise.all([
      axios.get(covidEP.COVID_API_BASE_URL + baseDataPath),
      axios.get(covidEP.COVID_API_BASE_URL + vaccineDataPath)
    ])
    commit('setIsLoading', false)

    baseDataRes.data.forEach((data: any) => {
      const date = transformDashDateToSlashDate(data.date)
      rawData.timeline.cases[date] = data.cases
      rawData.timeline.deaths[date] = data.deaths
      rawData.timeline.recovered[date] = 0
    })

    rawData.state = vaccineDataRes.data.state
    rawData.timeline.vaccinated = vaccineDataRes.data.timeline

    commit('setHistoricalStateData', processHistoricalData(rawData, startDate, endDate))
  },

  getHistoricalCountyData: async({ commit, state }: ActionContext<CovidStateType, RS>): Promise<void> => {
    let numOfDays = '30'

    const today = moment.utc()
    const startDate = moment.utc(state.selectedDates.startDate)
    const endDate = moment.utc(state.selectedDates.endDate)
    const hasSpecificDates = Object.values(state.selectedDates).length === 2
    const rawData: CovidRawHistoricalData = generateEmptyCovidRawHistoricalData()

    if (hasSpecificDates) {
      numOfDays = today.diff(startDate, 'days').toString()
    }

    const baseDataPath = covidEP.COVID_API_HISTORICAL_COUNTY_DATA
      .replace('{county}', state.selectedCounty)
      .replace('numOfDays', numOfDays)

    /*
     * We wrap the https request in a try catch for this specific action, since querying county data past 30 days
     * seems to produce a 504 from the end point. */
    try {
      commit('setIsLoading', true)
      const baseDataRes = await axios.get(covidEP.COVID_API_BASE_URL + baseDataPath)
      commit('setIsLoading', false)

      baseDataRes.data.forEach((data: any) => {
        const date = transformDashDateToSlashDate(data.date)
        rawData.timeline.cases[date] = data.cases
        rawData.timeline.deaths[date] = data.deaths
        rawData.timeline.recovered[date] = 0
        rawData.timeline.vaccinated[date] = 0
      })

      rawData.county = baseDataRes.data[0].county
      commit('setHistoricalCountyData', processHistoricalData(rawData, startDate, endDate))
    } catch (e) {
      commit('setIsLoading', false)
      commit('setHasError', true)
    }
  },

  setCountryDependents: ({ commit }: ActionContext<CovidStateType, RS>, country: SelectItem): void => {
    commit('setSelectedCountry', country)
    commit('setSelectedCovidCountryData', country)
  },

  setUsaStateDependents: async ({ commit, state, dispatch }: ActionContext<CovidStateType, RS>, usaState: SelectItem): Promise<void> => {
    const statewide: DataScale = { name: 'Statewide', value: 'statewide' }
    const containsStatewide = state.dataScales
      .map((scale: DataScale): string => scale.value)
      .includes(statewide.value)

    commit('setSelectedState', usaState)
    commit('setSelectedCovidStateData', usaState)

    if (state.selectedCountry.toLowerCase() === 'usa') {
      /*
       * Statewide scale should only be added if the array does not contain it. */
      if (!containsStatewide) {
        commit('addDataScale', statewide)
      }
    } else {
      commit('removeDataScale', statewide)
    }

    await dispatch('getHistoricalStateData')
  },

  setUsaCountyDependents: async ({ commit, state, dispatch }: ActionContext<CovidStateType, RS>, county: SelectItem): Promise<void> => {
    const countywide: DataScale = { name: 'Countywide', value: 'countywide' }
    const containsCountywide = state.dataScales
      .map((scale: DataScale): string => scale.value)
      .includes(countywide.value)

    commit('setSelectedCounty', county)
    commit('setSelectedCovidCountyData', county)

    if (state.selectedCountry.toLowerCase() === 'usa') {
      /*
       * Countywide scale should only be added if the array does not contain it. */
      if (!containsCountywide) {
        commit('addDataScale', countywide)
      }
    } else {
      commit('removeDataScale', countywide)
    }

    await dispatch('getHistoricalCountyData')
  }
}
