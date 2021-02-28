import moment from 'moment'
import {
  CovidCountryData,
  CovidCountyData,
  CovidHistoricalData,
  DateValue
} from '@/types'
import { randomInteger } from '@/shared/randomInteger'

export const covidConstants = {
  affectedCountries: [
    { name: 'Redania', countryCode: 'RE' },
    { name: 'Temeria', countryCode: 'TE' },
    { name: 'Nilfgaard', countryCode: 'NI' },
    { name: 'Toussaint', countryCode: 'TO' },
    { name: 'Zerrikania', countryCode: 'ZE' }
  ],

  datesAndValues: () => {
    const datesAndValues: DateValue[] = []

    for (let x = 0; x < 5; x++) {
      datesAndValues.push({
        date: moment.utc().subtract(x, 'days').toString(),
        value: x
      })
    }

    return datesAndValues
  },

  covidGlobalTotals: {
    country: 'Skellige',
    cases: 0,
    deaths: 1,
    tests: 2,
    vaccinated: 3,
    updated: 4
  },

  vaccinatedData: [
    ['redania', 1],
    ['temeria', 2],
    ['nilfgaard', 3],
    ['toussaint', 4],
    ['zerrikania', 5]
  ]
}

export const covidStateMocks = {
  generateCovidDataAllCountries: (): CovidCountryData[] => {
    const result: CovidCountryData[] = []
    const min = 0
    const max = 5000

    for (let x = 0; x < 5; x++) {
      result.push({
        country: covidConstants.affectedCountries[x].name,
        countryInfo: {
          _id: randomInteger(min, max),
          iso2: covidConstants.affectedCountries[x].countryCode,
          iso3: `${randomInteger(min, max)}`,
          lat: randomInteger(min, max),
          long: randomInteger(min, max),
          flag: `${randomInteger(min, max)}`
        },
        recovered: randomInteger(min, max),
        todayRecovered: randomInteger(min, max),
        critical: randomInteger(min, max),
        continent: `${randomInteger(min, max)}`,
        oneCasePerPeople: randomInteger(min, max),
        oneTestPerPeople: randomInteger(min, max),
        activePerOneMillion: randomInteger(min, max),
        recoveredPerOneMillion: randomInteger(min, max),
        criticalPerOneMillion: randomInteger(min, max),
        affectedCountries: randomInteger(min, max),
        baseData: {
          updated: randomInteger(min, max),
          cases: randomInteger(min, max),
          todayCases: randomInteger(min, max),
          deaths: randomInteger(min, max),
          todayDeaths: randomInteger(min, max),
          active: randomInteger(min, max),
          casesPerOneMillion: randomInteger(min, max),
          deathsPerOneMillion: randomInteger(min, max),
          tests: randomInteger(min, max),
          testsPerOneMillion: randomInteger(min, max),
          population: randomInteger(min, max)
        }
      })
    }

    return result
  },

  generateCovidDataAllCounties: (): CovidCountyData[] => {
    const result: CovidCountyData[] = []
    const min = 0
    const max = 5000

    for (let x = 0; x < 5; x++) {
      result.push({
        country: covidConstants.affectedCountries[x].name,
        state: covidConstants.affectedCountries[x].name,
        county: covidConstants.affectedCountries[x].name,
        cases: randomInteger(min, max),
        deaths: randomInteger(min, max),
        recovered: randomInteger(min, max),
        updated: randomInteger(min, max)
      })
    }

    return result
  },

  generateCovidHistoricalCountryData: (): CovidHistoricalData => {
    const datesAndValues: DateValue[] = covidConstants.datesAndValues()

    return {
      country: 'Gondor',
      province: [
        'Shire',
        'Prancing Pony'
      ],
      timeline: {
        cases: datesAndValues,
        deaths: datesAndValues,
        recovered: datesAndValues
      }
    }
  },

  generateVaccinatedCountryMap: (): Map<string, number> =>
    new Map<string, number>([
      ['redania', 1],
      ['temeria', 2],
      ['nilfgaard', 3],
      ['toussaint', 4],
      ['zerrikania', 5]
    ])
}
