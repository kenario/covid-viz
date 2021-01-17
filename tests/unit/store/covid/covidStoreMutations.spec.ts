import { expect } from 'chai'
import { CovidState } from '@/types'
import { state, mutations } from '@/store/covid'
import { covidStateMocks, covidConstants } from './covidMocks'

const { setSelectedCovidData } = mutations

let covidState: CovidState = state()

describe('Covid Store mutations', (): void => {
  afterEach((): void => {
    covidState = state()
  })

  it('will set selectedCovidData to appropriate country covid data when selectedCountry is mutated', (): void => {
    covidState.covidDataAllCountries = covidStateMocks.generateCovidDataAllCountries()
    covidState.selectedCountry = covidConstants.affectedCountries[0].name

    setSelectedCovidData(covidState)
    expect(covidState.selectedCovidData).to.eql(covidState.covidDataAllCountries[0])
  })
})
