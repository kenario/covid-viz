import { CovidCountryData, CovidStateData, CovidRankingData } from '@/types/covid'
import { ResultType, DateValue } from '@/types'
import moment from 'moment'

/**
 * Helper function that trims the queried dates to a specific range.
 */
// eslint-disable-next-line
export const trimToSpecificDateRange = (data: any, startDate: moment.Moment, endDate: moment.Moment): any => {
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
export const mapHistoricalDataToDateValue = (data: any): DateValue[] =>
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
export const determineCovidChartData = (data: any, resultType: ResultType): number[] => {
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
/**
 * Sorts the data in descending order, takes the first 10, and maps the data name and data total
 * @param covidData - Any data that has baseData field
 * @param covidDataScale - country, state
 * @param covidDataType - casesPerOneMillion, deathsPerOneMillion, testsPerOneMillion
 */
export function rankCovidData(covidData: CovidDataType[], covidDataScale: string, covidDataType: string): CovidRankingData[] {
  const sortDescending = (current: CovidDataType, next: CovidDataType): number =>
    next.baseData[covidDataType] - current.baseData[covidDataType]
  const nameAndTotal = (data: CovidDataType): CovidRankingData => {
    return {
      // eslint-disable-next-line
      name: (data as any)[covidDataScale], 
      total: data.baseData[covidDataType]
    }
  }

  return covidData
    .sort(sortDescending)
    .slice(0, 10)
    .map(nameAndTotal)
}

type CovidDataType = CovidCountryData | CovidStateData
