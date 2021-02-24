import { expect } from 'chai'
import { CovidState } from '@/types'
import { state, mutations } from '@/store/covid'
import { covidStateMocks, covidConstants } from './covidMocks'

const { setSelectedCovidCountryData } = mutations

let covidState: CovidState = state()

describe('Covid Store mutations', (): void => {
  afterEach((): void => {
    covidState = state()
  })

  it('will set selected covid country data to appropriate country covid data when selectedCountry is mutated', (): void => {
    covidState.covidCountryData = covidStateMocks.generateCovidDataAllCountries()
    covidState.selectedCountry = covidConstants.affectedCountries[0].name

    setSelectedCovidCountryData(covidState)
    expect(covidState.selectedCovidCountryData).to.eql(covidState.covidCountryData[0])
  })
})
