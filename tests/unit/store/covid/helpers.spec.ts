import {
  rankCovidData,
  mapCovidTotals,
  determineCovidChartData,
  trimToSpecificDateRange,
  mapHistoricalDataToDateValue
} from '@/store/covid/helpers'

import { expect } from 'chai'
import moment, { deprecationHandler } from 'moment'

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
})
