/*
 * Maps the raw covid data to covid data for specific scales: worldwide, countrywide, statewide, countywide */

export class CovidDataMapper {
  private static readonly covidDataFields = [
    'tests',
    'cases',
    'deaths',
    'active',
    'updated',
    'recovered',
    'vaccinated',
    'population',
    'todayCases',
    'todayDeaths',
    'todayRecovered',
    'casesPerOneMillion',
    'testsPerOneMillion',
    'deathsPerOneMillion'
  ]

  // eslint-disable-next-line
  public static map<T>(data: any): T {
    const result = {
      ...JSON.parse(JSON.stringify(data)),
      ...{ baseData: {} }
    }

    Object.keys(result).forEach((key: string): void => {
      if (this.covidDataFields.includes(key)) {
        result.baseData[key] = result[key]
        delete result[key]
      }
    })

    return result as T
  }
}
