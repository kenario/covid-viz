import {
  CovidGlobalData,
  CovidCountryData,
  CovidStateData,
  CovidRankingData,
  CovidCountyData,
  CovidTotals,
  CovidHistoricalData,
  CovidRawHistoricalData
} from '@/types/covid'
import { MeasurementType, DateValue } from '@/types'
import moment from 'moment'

/**
 * The New York Times historical state covid API uses a different date format from
 * the Johny Hopkins historical covid API, which is the baseline used for covid data
 * in this application.
 *
 * @param date - date in string format the uses '-'
 * @returns - date in string format that uses '/'
 */
export const transformDashDateToSlashDate = (date: string): string => {
  /*
   * Parse each portion of the date to remove any leading zeroes since the baseline
   * only uses single digits when possible for month and day. */
  let result = date.split('-').map(d => parseInt(d, 10).toString())
  const year = result[0].substring(2)

  /*
   * Remove the year from the front and add to the back since the baseline is of the format
   * 'x-x-xxxx' */
  // result.splice(0, 1).push(year)
  result = result.slice(1)
  result.push(year)
  return result.join('/')
}

export const generateEmptyCovidRawHistoricalData = (): CovidRawHistoricalData => {
  return {
    timeline: {
      cases: {},
      deaths: {},
      recovered: {},
      vaccinated: {}
    }
  }
}

/**
 * This is used to process historical data for any countries, for any state in the USA, and for any
 * counties within a state of the USA.
 *
 * @param data - raw historical data
 * @param startDate - starting date of historical data
 * @param endDate - ending date of historical data
 * @returns - CovidHistoricalData
 */
export const processHistoricalData = (data: CovidRawHistoricalData, startDate: moment.Moment, endDate: moment.Moment): CovidHistoricalData => {
  const today = moment.utc()
  const vaccineStartDate = moment.utc('12/1/2020', 'M/D/YY')
  const endDateNotToday = !today.isSame(endDate, 'day')

  /*
   * Vaccine related data does not exist before 12/1/2020, so when we query for historical data
   * before that time, we get a longer array of cases, deaths, and recoveries.  When the chart
   * is created using that data, vaccine data is joined with earliest dates of cases, deaths,
   * and recoveries. In this case, we have to perform some processing on vaccine data. */
  if (startDate.isBefore(vaccineStartDate)) {
    const cleanVaccineData: any = {}
    const dirtyVaccineData: any = data.timeline.vaccinated
    const dates = Object.keys(data.timeline.cases)

    /*
     * Removes dates on or after 12/1/2020 and creates new vaccine data with any
     * queried dates before 12/1/2020. */
    dates.length = dates.indexOf('12/1/20')
    dates.forEach((date: string): void => {
      cleanVaccineData[date] = 0
    })

    /*
     * Using custom process of merging data since merging using spread operator seems
     * to eliminate all days 1 through 12 of any given month. */
    Object.keys(dirtyVaccineData).forEach((key: string): void => {
      cleanVaccineData[key] = dirtyVaccineData[key]
    })
    data.timeline.vaccinated = cleanVaccineData
  }

  if (endDateNotToday) {
    trimToSpecificDateRange(data.timeline.cases, startDate, endDate)
    trimToSpecificDateRange(data.timeline.deaths, startDate, endDate)
    trimToSpecificDateRange(data.timeline.recovered, startDate, endDate)
    trimToSpecificDateRange(data.timeline.vaccinated, startDate, endDate)
  }

  const result: CovidHistoricalData = {
    country: data.country,
    state: data.state,
    timeline: {
      /*
       * Historical data is mapped into the following: [{ date: '12/1/20', value: 0 }] */
      cases: mapHistoricalDataToDateValue(data.timeline.cases),
      deaths: mapHistoricalDataToDateValue(data.timeline.deaths),
      recovered: mapHistoricalDataToDateValue(data.timeline.recovered),
      vaccinated: mapHistoricalDataToDateValue(data.timeline.vaccinated)
    }
  }

  return result
}

/**
 * Helper function that trims the queried dates to a specific range.
 *
 * @param data - example: { '7/23/21': 305050 }
 * @param startDate
 * @param endDate
 */
export const trimToSpecificDateRange = (data: any, startDate: moment.Moment, endDate: moment.Moment): any => {
  Object.keys(data).forEach((key: string): void => {
    const date = moment.utc(new Date(key))

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
export const determineCovidChartData = (data: any, measurement: MeasurementType): number[] => {
  let result: number[] = []

  if (measurement.value === 'total') {
    /*
     * Return the value if it is greater than 0, otherwise we return 0 instead. This is a case for
     * negative values that are skewing the chart for the recovered data type.  Recovered has also
     * seemed to have stopped being recorded after a specific date. */
    result = data.map((d: any) => parseInt(d.value) > 0 ? parseInt(d.value) : 0)
  } else if (measurement.value === 'totalPerDay') {
    /**
     * next element - current element, gives us the data for the current day.  This excludes
     * the very last day.
     */
    for (let x = 0; x < data.length; x++) {
      if (x + 1 < data.length) {
        /*
         * If the data for the next and the current element is valid. */
        if (parseInt(data[x + 1].value) >= 0 && parseInt(data[x].value) >= 0) {
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
export const searchForSelectedData = (selectedData: string, data: any[], type: string): CovidDataType =>

  data.find((d: any): boolean =>
    selectedData !== '' && d[type]!.toLowerCase().includes(selectedData.toLowerCase())
  )! || {}

/**
 * Transforms vaccination data to a map that contains the 'country' or 'state' as the key
 * and the current vaccination coverage as the value.
 *
 * @param data - example: { 'state': 'Alabama', 'timeline': { '8/21/21': 715503 } }
 * @returns - Map<string, number>
 */
export const transformVaccineDataToMap = (data: any, type: string): Map<string, number> => {
  const result: Map<string, number> = new Map<string, number>()

  data.forEach((d: any): void => {
    result.set(d[type].toLowerCase(), Object.values(d.timeline)[0] as number)
  })

  return result
}

type CovidDataType = CovidGlobalData | CovidCountryData | CovidStateData | CovidCountyData
