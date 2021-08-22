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
 *
 * @param data - example: { '7/23/21': 305050 }
 * @param startDate
 * @param endDate
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
 *
 * @param data - example: { '7/23/21': 305050 }
 * @returns
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
    /*
     * Return the value if it is greater than 0, otherwise we return 0 instead. This is a case for
     * negative values that are skewing the chart for the recovered data type.  Recovered has also
     * seemed to have stopped being recorded after a specific date. */
    // eslint-disable-next-line
    result = data.map((d: any) => parseInt(d.value) > 0 ? parseInt(d.value) : 0)
  } else if (resultType.value === 'totalPerDay') {
    /**
     * next element - current element, gives us the data for the current day.  This excludes
     * the very last day.
     */
    for (let x = 0; x < data.length; x++) {
      if (x + 1 < data.length) {
        /*
         * If the data for the next and the current element is valid. */
        if (parseInt(data[x + 1].value) > 0 && parseInt(data[x].value) > 0) {
          result.push((parseInt(data[x + 1].value) - parseInt(data[x].value)))
        }
      }
    }
  }

  return result
}
/**
 * Sorts the data in descending order, takes the first 10, and maps the data name and data total
 * @param covidData - Any data that has baseData field
 * @param scope - country, state
 * @param covidDataType - cases, deaths, tests
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

/**
 * Iterate through the data and find a match.  If the selected data is an empty string then the search will
 * return undefined.  If undefined is returned, then the function will return an empty object.
 *
 * @param selectedData - state.selectedCountry | state.selectedState | state.selectedCounty
 * @param data - state.selectedCovidCountryData | state.selectedCovidStateData | state.selectedCovidCountyData
 * @param type - 'country' | 'state' | 'county'
 * @returns - CovidCountryData | CovidStateData | CovidCountyData | {}
 */
// eslint-disable-next-line
export const searchForSelectedData = (selectedData: string, data: any[], type: string): CovidDataType =>
  // eslint-disable-next-line
  data.find((d: any): boolean =>
    selectedData !== '' && d[type]!.toLowerCase().includes(selectedData.toLowerCase())
  )! || {}

type CovidDataType = CovidGlobalData | CovidCountryData | CovidStateData | CovidCountyData
