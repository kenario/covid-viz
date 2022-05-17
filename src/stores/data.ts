import { defineStore } from "pinia"
import { useFiltersStore } from "./filters"
import { mapCovidTotals, rankCovidData, findCovidData } from "./covid/helpers"

import { 
  CountryInfo,
  SelectItem,
  DataScale
} from "@/types"

import {
  CovidTotals,
  CovidRankings,
  CovidStateData,
  CovidCountyData,
  CovidGlobalData,
  CovidRankingData,
  CovidCountryData,
  CovidHistoricalData,
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
        .map((rankingType: DataScale): string => rankingType.value)
        .includes('countywide')

      if (containsCountywide) {
        result.splice(result.findIndex((rankingType: DataScale): boolean => rankingType.value === 'countywide'))
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
  
      rankingSubtypes.forEach((subtypes: string): void => {
        let data: CovidRankingData[] = []
        let label = subtypes.slice(0, 1).toUpperCase() + subtypes.slice(1)
  
        /*
         * Assign the ranking label and map the data based on the ranking type selected. */
        if (filtersStore.selectedRankingDataScale.value === 'worldwide') {
          label = `Worldwide ${label}`
          data = rankCovidData([...s.covidCountryData], 'country', subtypes)
        } else if (filtersStore.selectedRankingDataScale.value === 'nationwide') {
          label = `USA ${label}`
          data = rankCovidData([...s.covidStateData], 's', subtypes)
        } else {
          /*
           * County data does not currently contain test and vaccinations, so we skip making rankings
           * for this. */
          if (subtypes === 'tests' || subtypes === 'vaccinated') return
          const countyData: CovidCountyData[] = s.covidCountyData
            .filter((county: CovidCountyData): boolean => county.state === filtersStore.selectedState)
          label = `${filtersStore.selectedState} ${label}`
          data = rankCovidData(countyData, 'county', subtypes)
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
  }
})