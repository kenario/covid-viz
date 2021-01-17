import { expect } from 'chai'
import { mockState } from './mockState'
import { CovidState, CountryInfo, CovidData } from '../../../../src/types'
import { state, getters } from '../../../../src/store/covid'

const {
  getAllAffectedCountries,
  getCovidChartLabels,
  getCovidGeneralInfo,
  getCovidChartData
} = getters

let covidState: CovidState = state()

describe('Covid Store getters', (): void => {
  beforeEach((): void => {
    covidState.covidDataAllCountries = mockState.generateCovidDataAllCountries()
  })

  afterEach((): void => {
    covidState = state()
  })

  it('can get all affected countries', (): void => {
    const expected: CountryInfo[] = covidState.covidDataAllCountries.map((data: CovidData): CountryInfo => {
      return { name: data.country!, countryCode: data.countryInfo?.iso2! }
    })
    expect(getAllAffectedCountries(covidState)).to.eql(expected)
  })
})
