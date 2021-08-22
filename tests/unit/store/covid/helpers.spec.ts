import {
  rankCovidData,
  mapCovidTotals,
  determineCovidChartData,
  trimToSpecificDateRange,
  mapHistoricalDataToDateValue,
  transformVaccineDataToMap
} from '@/store/covid/helpers'

import moment from 'moment'
import { expect } from 'chai'
import { SelectItem } from '@/types'
import { CovidCountryData, CovidRankingData, CovidTotals } from '@/types/covid'
import { covidStateMocks, covidConstants } from '../../covidMocks'

describe('CovidStoreHelpers', (): void => {
  const data = {
    '2020-01-25': 1,
    '2020-01-26': 2,
    '2020-01-27': 3,
    '2020-01-28': 4
  }

  describe('trimToSpecificDateRange', (): void => {
    it('removes any date not within the given start and end range', (): void => {
      const dates = { ...data }
      const startDate = moment.utc(Object.keys(dates)[0])
      const endDate = moment.utc(Object.keys(dates)[2])

      trimToSpecificDateRange(dates, startDate, endDate)
      expect(Object.keys(dates).length).to.equal(3)
    })
  })

  describe('mapHistoricalDataToDateValue', (): void => {
    it('returns an array of DateValue objects', (): void => {
      const expected = [
        { date: '2020-01-25', value: 1 },
        { date: '2020-01-26', value: 2 },
        { date: '2020-01-27', value: 3 },
        { date: '2020-01-28', value: 4 }
      ]
      expect(mapHistoricalDataToDateValue(data)).to.deep.equal(expected)
    })
  })

  describe('determineCovidChartData', (): void => {
    const values: SelectItem[] = [
      { name: 'Midoriya', value: '300' },
      { name: 'Ashido', value: '260' },
      { name: 'Bakugo', value: '119' },
      { name: 'Mineta', value: '3894' },
      { name: 'Ochaco', value: '99' }
    ]

    it('returns total values when ResultType is total', (): void => {
      const expected: number[] = values.map((v: SelectItem): number => parseInt(v.value))
      expect(determineCovidChartData(values, { name: 'Total', value: 'total' })).to.deep.equal(expected)
    })

    it('returns total values per day when ResultType is total per day', (): void => {
      const expected = [-40, -141, 3775, -3795]
      expect(determineCovidChartData(values, { name: 'Total Per Day', value: 'totalPerDay' })).to.deep.equal(expected)
    })
  })

  describe('rankCovidData', (): void => {
    it('returns ranking that is in descending order', (): void => {
      const covidCountryData: CovidCountryData[] = covidStateMocks.generateCovidDataAllCountries()
      const totals: number[] = rankCovidData(covidCountryData, 'country', 'casesPerOneMillion')
        .map((data: CovidRankingData): number => data.total)
      const isDescended: boolean = totals.every((current: number, index: number): boolean =>
        index === totals.length - 1 ? true : current > totals[index + 1]
      )
      expect(isDescended).to.be.true
    })
  })

  describe('mapCovidTotals', (): void => {
    it('returns totals for cases, recovered, deaths, tests, vaccinated, and updated date', (): void => {
      const data: CovidCountryData = covidStateMocks.generateCovidDataAllCountries()[0]
      const covidCountryTotals: CovidTotals = mapCovidTotals(data)

      expect(covidCountryTotals.cases).to.equal(data.baseData.cases)
      expect(covidCountryTotals.recovered).to.equal(data.baseData.recovered)
      expect(covidCountryTotals.deaths).to.equal(data.baseData.deaths)
      expect(covidCountryTotals.tests).to.equal(data.baseData.tests)
      expect(covidCountryTotals.vaccinated).to.equal(data.baseData.vaccinated)
      expect(covidCountryTotals.updated).to.equal(data.baseData.updated)
    })
  })

  describe('transformVaccineDataToMap', (): void => {
    it('transforms a vaccine object into a map of vaccine data', (): void => {
      const vaccineDataMap = transformVaccineDataToMap(covidConstants.rawVaccinatedData, 'state')
      const keys = vaccineDataMap.keys()
      const values = vaccineDataMap.values()
      const actual = []

      for (let x = 0; x < vaccineDataMap.size; x++) {
        actual.push([keys.next().value, values.next().value])
      }

      expect(actual).to.deep.equal(covidConstants.vaccinatedData)
    })
  })
})
