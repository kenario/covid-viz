import {
  CovidGlobalData,
  CovidCountryData,
  CovidStateData,
  CovidRankingData,
  CovidCountyData,
  CovidTotals
} from '@/types/covid'
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
 * @param scope - country, state
 * @param covidDataType - casesPerOneMillion, deathsPerOneMillion, testsPerOneMillion
 */
export function rankCovidData(covidData: CovidDataType[], scope: string, covidDataType: string): CovidRankingData[] {
  const sortDescending = (current: CovidDataType, next: CovidDataType): number =>
    (next.baseData[covidDataType] as number) - (current.baseData[covidDataType] as number)
  const nameAndTotal = (data: CovidDataType): CovidRankingData => {
    return {
      // eslint-disable-next-line
      name: (data as any)[scope], 
      total: data.baseData[covidDataType] as number
    }
  }

  return covidData
    .sort(sortDescending)
    .slice(0, 10)
    .map(nameAndTotal)
}
/**
 * Maps the given covid data into an object of type CovidTotals.
 * @param data - Any data that has the baseData field
 * @param scopeTotals - Any additional object of type CovidTotals that should be added to the mapped object.
 */
export const mapCovidTotals = (data: CovidDataType, scopeTotals?: CovidTotals): CovidTotals => {
  const isPopulated = Object.keys(data).length > 0
  let result: CovidTotals

  if (isPopulated) {
    result = {
      cases: data.baseData.cases,
      recovered: data.baseData.recovered,
      deaths: data.baseData.deaths,
      tests: data.baseData.tests,
      vaccinated: data.baseData.vaccinated,
      updated: data.baseData.updated
    }

    if (scopeTotals) {
      result = { ...scopeTotals, ...result }
    }
  } else {
    result = {}
  }

  return result
}

type CovidDataType = CovidGlobalData | CovidCountryData | CovidStateData | CovidCountyData
