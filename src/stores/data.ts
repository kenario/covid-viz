import moment from 'moment'
import { defineStore } from 'pinia'
import { useFiltersStore } from './filters'
import { covidEP } from '@/shared/constants'
import axios, { AxiosResponse } from 'axios'
import { CovidDataMapper } from '@/shared/CovidDataMapper'
import { 
  findCovidData,
  rankCovidData,
  mapCovidTotals,
  processHistoricalData,
  transformVaccineDataToMap,
  transformDashDateToSlashDate,
  generateEmptyCovidRawHistoricalData,
} from './helpers'

import { 
  DataScale,
  SelectItem,
  CountryInfo,
} from '@/types'

import {
  CovidData,
  CovidTotals,
  CovidRankings,
  CovidStateData,
  CovidCountyData,
  CovidGlobalData,
  CovidRankingData,
  CovidCountryData,
  CovidVaccineData,
  CovidCountyDataRaw,
  CovidHistoricalData,
  CovidRawHistoricalData,
} from '@/types/covid'

interface DataState {
  covidGlobalData: CovidGlobalData
  covidCountryData: CovidCountryData[]
  covidStateData: CovidStateData[]
  covidCountyData: CovidCountyData[]
  covidHistoricalCountryData: CovidHistoricalData
  covidHistoricalStateData: CovidHistoricalData
  covidHistoricalCountyData: CovidHistoricalData
  dataScales: DataScale[]
}

const filtersStore = useFiltersStore()

export const useDataStore = defineStore('d', {
  state: (): DataState => ({
    covidGlobalData: {} as CovidGlobalData,
    covidCountryData: [] as CovidCountryData[],
    covidStateData: [] as CovidStateData[],
    covidCountyData: [] as CovidCountyData[],
    covidHistoricalCountryData: {} as CovidHistoricalData,
    covidHistoricalStateData: {} as CovidHistoricalData,
    covidHistoricalCountyData: {} as CovidHistoricalData,
    dataScales: [] as DataScale[],
  }),

  getters: {
    allAffectedCountries: (s: DataState): CountryInfo[] =>
      s.covidCountryData.map((d: CovidCountryData): CountryInfo => {
        return { name: d.country!, countryCode: d.countryInfo?.iso2! }
      }),
    allAffectedStates: (s: DataState): SelectItem[] =>
      s.covidStateData.map((d: CovidStateData): SelectItem => {
        return { name: d.state, value: d.state.toLowerCase() }
      }),
    statesAffectedCounties: (s: DataState): SelectItem[] => {
      return s.covidCountyData
        .filter((d: CovidCountyData): boolean => d.state === filtersStore.selectedState)
        .map((d: CovidCountyData): SelectItem => {
          return { name: d.county, value: d.county.toLowerCase() }
        })
    },
    globalTotals: (s: DataState): CovidTotals => mapCovidTotals(s.covidGlobalData),

    countryTotals: (): CovidTotals => {
      return mapCovidTotals(
        filtersStore.selectedCovidCountryData, 
        { country: filtersStore.selectedCovidCountryData.country }
      )
    },
    stateTotals: (): CovidTotals => {
      return mapCovidTotals(
        filtersStore.selectedCovidStateData, 
        { state: filtersStore.selectedCovidStateData.state }
      )
    },
    countyTotals: (): CovidTotals => {
      return mapCovidTotals(
        filtersStore.selectedCovidCountyData, 
        { county: filtersStore.selectedCovidCountyData.county }
      )
    },
    /**
     * RankingTypes is pulled from the data scale data structure + an added worldwide scale.
     *
     * @returns - DataScale[]
     */
    rankingDataScales: (s: DataState): DataScale[] => {
      let result: DataScale[] = [
        { name: 'Worldwide', value: 'worldwide' },
        ...s.dataScales
      ]
      /*
       * The data scales are determined by their own operations but in the case of RankingTypes, we
       * need to make sure worldwide is the only one present when the country is not USA since it is
       * not a part of the normal data scales. */
      if (filtersStore.selectedCountry.toLowerCase() !== 'usa') {
        result = [{ name: 'Worldwide', value: 'worldwide' }]
      }
      /*
       * Remove the option for county wide since that type of ranking belongs to s wide. */
      const containsCountywide = result
        .map((t: DataScale): string => t.value)
        .includes('countywide')

      if (containsCountywide) {
        result.splice(result.findIndex((t: DataScale): boolean => t.value === 'countywide'))
      }

      return result
    },
    covidRankings: (s: DataState): CovidRankings[] => {
      const result: CovidRankings[] = []
      const rankingSubtypes = [
        'cases',
        'deaths',
        'tests',
        'vaccinated'
      ]
  
      rankingSubtypes.forEach((t: string): void => {
        let data: CovidRankingData[] = []
        let label = t.slice(0, 1).toUpperCase() + t.slice(1)
  
        /*
         * Assign the ranking label and map the data based on the ranking type selected. */
        if (filtersStore.selectedRankingDataScale.value === 'worldwide') {
          label = `Worldwide ${label}`
          data = rankCovidData([...s.covidCountryData], 'country', t)
        } else if (filtersStore.selectedRankingDataScale.value === 'nationwide') {
          label = `USA ${label}`
          data = rankCovidData([...s.covidStateData], 's', t)
        } else {
          /*
           * County data does not currently contain test and vaccinations, so we skip making rankings
           * for this. */
          if (t === 'tests' || t === 'vaccinated') return
          const countyData: CovidCountyData[] = s.covidCountyData
            .filter((county: CovidCountyData): boolean => county.state === filtersStore.selectedState)
          label = `${filtersStore.selectedState} ${label}`
          data = rankCovidData(countyData, 'county', t)
        }
  
        result.push({
          label: label,
          data: data
        })
      })
  
      return result
    },
  },

  actions: {
    setSelectedCovidCountryData(country: SelectItem): void {
      filtersStore.selectedCovidCountryData = findCovidData<CovidCountryData>(country.name, this.covidCountryData)
    },
    setSelectedCovidStateData(usaState: SelectItem): void  {
      filtersStore.selectedCovidStateData = findCovidData<CovidStateData>(usaState.name, this.covidStateData)
    },
    setSelectedCovidCountyData(county: SelectItem): void {
      filtersStore.selectedCovidCountyData = findCovidData<CovidCountyData>(county.name, this.covidCountyData)
    },
    setCovidVaccineCountryData(data: Map<string, number>): void {
      this.covidCountryData.forEach((d: CovidCountryData): void => {
        d.baseData.vaccinated = data.get(d.country.toLowerCase())
      })
    },
    setCovidVaccineStateData(data: Map<string, number>): void {
      this.covidStateData.forEach((d: CovidStateData): void => {
        d.baseData.vaccinated = data.get(d.state.toLowerCase())
      })
    },
    addDataScale(scale: DataScale): void {
      this.dataScales.push(scale)
    },
    removeDataScale(scale: DataScale): void  {
      this.dataScales.splice(this.dataScales.findIndex((data: DataScale): boolean => data.value === scale.value), 1)
    },
    async fetchCovidGlobalData(): Promise<void> {
      const covidGlobalDataEP = covidEP.COVID_API_BASE_URL + covidEP.COVID_API_GLOBAL_TOTALS
      const res: AxiosResponse<CovidData> = await axios.get(covidGlobalDataEP)
      res.data.updated = moment(res.data.updated).format('MMM D, YYYY, h:mm:ss a')
      this.covidGlobalData = CovidDataMapper.map<CovidGlobalData>(res.data)
    },
    async fetchCovidCountryData(): Promise<void> {
      const covidCountryDataEP = covidEP.COVID_API_BASE_URL + covidEP.COVID_API_ALL_COUNTRIES
      const res: AxiosResponse<CovidData[]> = await axios.get(covidCountryDataEP)
      this.covidCountryData = res.data.map((d: CovidData): CovidCountryData => {
        d.updated = moment(d.updated).format('MMM D, YYYY, h:mm:ss a')
        return CovidDataMapper.map<CovidCountryData>(d)
      })
    },
    async fetchCovidStateData(): Promise<void> {
      const covidStateDataEP = covidEP.COVID_API_BASE_URL + covidEP.COVID_API_STATE_TOTALS
      const res: AxiosResponse<CovidData[]> = await axios.get(covidStateDataEP)
      this.covidStateData = res.data.map((d: CovidData): CovidStateData => {
        d.updated = moment(d.updated).format('MMM D, YYYY, h:mm:ss a')
        return CovidDataMapper.map<CovidStateData>(d)
      })
    },
    async fetchCovidCountyData(): Promise<void> {
      const covidCountyDataEP = covidEP.COVID_API_BASE_URL + covidEP.COVID_API_COUNTY_TOTALS
      const res: AxiosResponse<CovidCountyDataRaw[]> = await axios.get(covidCountyDataEP)
      this.covidCountyData = res.data.map((d: CovidCountyDataRaw): CovidCountyData => {
        return CovidDataMapper.map<CovidCountyData>({
          country: d.country,
          state: d.province,
          county: d.county,
          updated: moment(d.updatedAt).format('MMM D, YYYY, h:mm:ss a'),
          cases: d.stats.confirmed,
          recovered: d.stats.recovered,
          deaths: d.stats.deaths
        })
      })
    },
    // Vaccine data is queried just for the latest date but it is returned as a single key value pair with
    // the key being a date string in the format of 'xx/xx/xxxx', so we just loop over for simplicity
    // instead of declaring an interface with an index signature or getting the current date. */
    async fetchCovidVaccineGlobalData(): Promise<void> {
      const vaccineGlobalDataEP = covidEP.COVID_API_BASE_URL + covidEP.COVID_API_VACCINE_GLOBAL_TOTALS
      const res = await axios.get(vaccineGlobalDataEP)
      Object.keys(res.data).forEach((key: string): void => {
        this.covidGlobalData.baseData.vaccinated = res.data[key]      
      })
    },
    // Process vaccination data into a map with the country or state it belongs to as the key and the vaccination
    // count as the value.  This will make for an easier merge with the main country covid data structure. */
    async fetchCovidVaccineCountryData():Promise<void> {
      const vaccineCountryDataEP = covidEP.COVID_API_BASE_URL + covidEP.COVID_API_VACCINE_ALL_COUNTRIES
      const res: AxiosResponse<CovidVaccineData[]> = await axios.get(vaccineCountryDataEP)
      this.setCovidVaccineCountryData(transformVaccineDataToMap(res.data))
    },
    async fetchCovidVaccineStateData(): Promise<void> {
      const vaccineStateDataEP = covidEP.COVID_API_BASE_URL + covidEP.COVID_API_VACCINE_ALL_STATES      
      const res: AxiosResponse<CovidVaccineData[]> = await axios.get(vaccineStateDataEP)
      this.setCovidVaccineStateData(transformVaccineDataToMap(res.data))
    },
    async fetchHistoricalCountryData(): Promise<void> {
      let numOfDays = ''
  
      const today = moment.utc()
      const startDate = moment.utc(filtersStore.selectedDates.startDate)
      const endDate = moment.utc(filtersStore.selectedDates.endDate)
      const hasSpecificDates = Object.values(filtersStore.selectedDates).length === 2
      const rawData: CovidRawHistoricalData = generateEmptyCovidRawHistoricalData()
  
      if (hasSpecificDates) {
        numOfDays = today.diff(startDate, 'days').toString()
      }
  
      const baseDataPath = covidEP.COVID_API_HISTORICAL_COUNTRY_DATA
        .replace('country', filtersStore.selectedCountry)
        .replace('numOfDays', numOfDays)
      const vaccineDataPath = covidEP.COVID_API_HISTORICAL_COUNTRY_VACCINE
        .replace('country', filtersStore.selectedCountry)
        .replace('numOfDays', numOfDays)
  
      // commit('setIsLoading', true)
      const [baseDataRes, vaccineDataRes] = await Promise.all([
        axios.get(covidEP.COVID_API_BASE_URL + baseDataPath),
        axios.get(covidEP.COVID_API_BASE_URL + vaccineDataPath)
      ])
      // commit('setIsLoading', false)
  
      rawData.country = baseDataRes.data.country
      rawData.timeline = baseDataRes.data.timeline
      rawData.timeline.vaccinated = vaccineDataRes.data.timeline
      this.covidHistoricalCountryData = processHistoricalData(rawData, startDate, endDate)
    },
    async fetchHistoricalStateData(): Promise<void> {
      let numOfDays = '30'
  
      const today = moment.utc()
      const startDate = moment.utc(filtersStore.selectedDates.startDate)
      const endDate = moment.utc(filtersStore.selectedDates.endDate)
      const hasSpecificDates = Object.values(filtersStore.selectedDates).length === 2
      const rawData: CovidRawHistoricalData = generateEmptyCovidRawHistoricalData()
  
      if (hasSpecificDates) {
        numOfDays = today.diff(startDate, 'days').toString()
      }
  
      const baseDataPath = covidEP.COVID_API_HISTORICAL_STATE_DATA
        .replace('{state}', filtersStore.selectedState)
        .replace('numOfDays', numOfDays)
      const vaccineDataPath = covidEP.COVID_API_HISTORICAL_STATE_VACCINE
        .replace('{state}', filtersStore.selectedState)
        .replace('numOfDays', numOfDays)
  
      // commit('setIsLoading', true)
      const [baseDataRes, vaccineDataRes] = await Promise.all([
        axios.get(covidEP.COVID_API_BASE_URL + baseDataPath),
        axios.get(covidEP.COVID_API_BASE_URL + vaccineDataPath)
      ])
      // commit('setIsLoading', false)
  
      baseDataRes.data.forEach((data: any) => {
        const date = transformDashDateToSlashDate(data.date)
        rawData.timeline.cases[date] = data.cases
        rawData.timeline.deaths[date] = data.deaths
        rawData.timeline.recovered[date] = 0
      })
  
      rawData.state = vaccineDataRes.data.state
      rawData.timeline.vaccinated = vaccineDataRes.data.timeline
      this.covidHistoricalStateData = processHistoricalData(rawData, startDate, endDate)
    },
    async fetchHistoricalCountyData(): Promise<void> {
      let numOfDays = '30'
  
      const today = moment.utc()
      const startDate = moment.utc(filtersStore.selectedDates.startDate)
      const endDate = moment.utc(filtersStore.selectedDates.endDate)
      const hasSpecificDates = Object.values(filtersStore.selectedDates).length === 2
      const rawData: CovidRawHistoricalData = generateEmptyCovidRawHistoricalData()
  
      if (hasSpecificDates) {
        numOfDays = today.diff(startDate, 'days').toString()
      }
  
      const baseDataPath = covidEP.COVID_API_HISTORICAL_COUNTY_DATA
        .replace('{county}', filtersStore.selectedCounty)
        .replace('numOfDays', numOfDays)
        
      // We wrap the https request in a try catch for this specific action, since querying county data past 30 days
      // seems to produce a 504 from the end point.
      try {
        // commit('setIsLoading', true)
        const baseDataRes = await axios.get(covidEP.COVID_API_BASE_URL + baseDataPath)
        // commit('setIsLoading', false)
  
        baseDataRes.data.forEach((data: any) => {
          const date = transformDashDateToSlashDate(data.date)
          rawData.timeline.cases[date] = data.cases
          rawData.timeline.deaths[date] = data.deaths
          rawData.timeline.recovered[date] = 0
          rawData.timeline.vaccinated[date] = 0
        })
  
        rawData.county = baseDataRes.data[0].county
        this.covidHistoricalCountyData = processHistoricalData(rawData, startDate, endDate)
      } catch (e) {
        // commit('setIsLoading', false)
        // commit('setHasError', true)
      }
    },
    setCountryDependents(country: SelectItem): void {
      filtersStore.selectedCountry = country.name
      this.setSelectedCovidCountryData(country)
    },
    async setUsaStateDependents(usaState: SelectItem): Promise<void> {
      const statewide: DataScale = { name: 'Statewide', value: 'statewide' }
      const containsStatewide = this.dataScales
        .map((scale: DataScale): string => scale.value)
        .includes(statewide.value)
  
      filtersStore.selectedState = usaState.name
      this.setSelectedCovidStateData(usaState)
  
      if (filtersStore.selectedCountry.toLowerCase() === 'usa') {
         // Statewide scale should only be added if the array does not contain it.
        if (!containsStatewide) this.addDataScale(statewide)
      } else {
        this.removeDataScale(statewide)
      }
  
      await this.fetchHistoricalStateData()
    },
    async setUsaCountyDependents(county: SelectItem): Promise<void> {
      const countywide: DataScale = { name: 'Countywide', value: 'countywide' }
      const containsCountywide = this.dataScales
        .map((scale: DataScale): string => scale.value)
        .includes(countywide.value)
  
      filtersStore.selectedCounty = county.name
      this.setSelectedCovidCountyData(county)
  
      if (filtersStore.selectedCountry.toLowerCase() === 'usa') {
         // Countywide scale should only be added if the array does not contain it.
        if (!containsCountywide) this.addDataScale(countywide)
      } else {
        this.removeDataScale(countywide)
      }
  
      await this.fetchHistoricalCountyData()
    }
  }
})