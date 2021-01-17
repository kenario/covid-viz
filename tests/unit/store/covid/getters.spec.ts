import { expect } from 'chai'
import { covidConstants, covidStateMocks } from './covidMocks'
import { CovidState, CountryInfo, CovidData, DateValue } from '../../../../src/types'
import { state, getters } from '../../../../src/store/covid'

const {
  getAllAffectedCountries,
  getCovidChartLabels,
  getCovidGeneralInfo,
  getCovidChartData
} = getters

let covidState: CovidState = state()

describe('Covid Store getters', (): void => {
  afterEach((): void => {
    covidState = state()
  })

  it('can get all affected countries', (): void => {
    covidState.covidDataAllCountries = covidStateMocks.generateCovidDataAllCountries()

    expect(getAllAffectedCountries(covidState)).to.eql(covidConstants.affectedCountries)
  })

  it('can get chart labels needed for covid chart', (): void => {
    covidState.covidHistoricalCountryData = covidStateMocks.generateCovidHistoricalCountryData()

    expect(getCovidChartLabels(covidState)).to
      .eql(covidConstants.datesAndValues().map((d: DateValue): string => d.date))
  })
})
