import { expect } from 'chai'
import { covidConstants, covidStateMocks } from './covidMocks'
import { CovidState, DateValue, CovidLineChart } from '@/types'
import { state, getters } from '@/store/covid'

const {
  getAllAffectedCountries,
  getCovidChartLabels,
  getCovidCountryTotals,
  getCovidChartData
} = getters

let covidState: CovidState = state()

describe('Covid Store getters', (): void => {
  afterEach((): void => {
    covidState = state()
  })

  it('can get all affected countries', (): void => {
    covidState.covidCountryData = covidStateMocks.generateCovidDataAllCountries()

    expect(getAllAffectedCountries(covidState)).to.eql(covidConstants.affectedCountries)
  })

  it('can get chart labels needed for covid chart', (): void => {
    covidState.covidHistoricalCountryData = covidStateMocks.generateCovidHistoricalCountryData()

    expect(getCovidChartLabels(covidState)).to
      .eql(covidConstants.datesAndValues().map((d: DateValue): string => d.date))
  })

  it('can get covid country totals', (): void => {
    covidState.selectedCovidCountryData = covidStateMocks.generateCovidDataAllCountries()[0]
    covidState.selectedCovidCountryData.country = covidConstants.covidGlobalTotals.country
    covidState.selectedCovidCountryData.cases = covidConstants.covidGlobalTotals.cases
    covidState.selectedCovidCountryData.deaths = covidConstants.covidGlobalTotals.deaths
    covidState.selectedCovidCountryData.tests = covidConstants.covidGlobalTotals.tests
    covidState.selectedCovidCountryData.vaccinated = covidConstants.covidGlobalTotals.vaccinated
    covidState.selectedCovidCountryData.updated = covidConstants.covidGlobalTotals.updated
    expect(getCovidCountryTotals(covidState)).to.eql(covidConstants.covidGlobalTotals)
  })

  it('can get covid chart data that are overall totals', (): void => {
    covidState.covidHistoricalCountryData = covidStateMocks.generateCovidHistoricalCountryData()
    covidState.selectedCovidDataType = [{ name: 'Cases', value: 'cases' }]
    covidState.selectedResultType = { name: 'Total', value: 'total' }

    const expected: CovidLineChart = {
      label: 'Cases',
      data: covidConstants.datesAndValues().map((dv: DateValue): number => dv.value)
    }

    expect(getCovidChartData(covidState)).to.eql([expected])
  })

  it('can get covid chart data that are totalPerDay', (): void => {
    covidState.covidHistoricalCountryData = covidStateMocks.generateCovidHistoricalCountryData()
    covidState.selectedCovidDataType = [{ name: 'Cases', value: 'cases' }]
    covidState.selectedResultType = { name: 'Total Per Day', value: 'totalPerDay' }

    const expected: CovidLineChart = {
      label: 'Cases',
      data: [1, 1, 1, 1]
    }

    expect(getCovidChartData(covidState)).to.eql([expected])
  })
})
