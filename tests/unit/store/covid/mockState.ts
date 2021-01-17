import { CovidData } from '../../../../src/types'
import { randomInteger } from '../../../../src/shared/randomInteger'

export const mockState = {
  generateCovidDataAllCountries: (): CovidData[] => {
    const result: CovidData[] = []
    const min = 0
    const max = 5000

    for (let x = 0; x < 5; x++) {
      result.push({
        updated: randomInteger(min, max),
        country: `${randomInteger(min, max)}`,
        countryInfo: {
          _id: randomInteger(min, max),
          iso2: `${randomInteger(min, max)}`,
          iso3: `${randomInteger(min, max)}`,
          lat: randomInteger(min, max),
          long: randomInteger(min, max),
          flag: `${randomInteger(min, max)}`
        },
        cases: randomInteger(min, max),
        todayCases: randomInteger(min, max),
        deaths: randomInteger(min, max),
        todayDeaths: randomInteger(min, max),
        recovered: randomInteger(min, max),
        todayRecovered: randomInteger(min, max),
        active: randomInteger(min, max),
        critical: randomInteger(min, max),
        casesPerOneMillion: randomInteger(min, max),
        deathsPerOneMillion: randomInteger(min, max),
        tests: randomInteger(min, max),
        testsPerOneMillion: randomInteger(min, max),
        population: randomInteger(min, max),
        continent: `${randomInteger(min, max)}`,
        oneCasePerPeople: randomInteger(min, max),
        oneTestPerPeople: randomInteger(min, max),
        activePerOneMillion: randomInteger(min, max),
        recoveredPerOneMillion: randomInteger(min, max),
        criticalPerOneMillion: randomInteger(min, max),
        affectedCountries: randomInteger(min, max)
      })
    }

    return result
  }
}
