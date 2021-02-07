import { expect } from 'chai'
import { covidConstants, covidStateMocks } from './covidMocks'
import { CovidState, DateValue, CovidLineChart } from '@/types'
import { state, getters } from '@/store/covid'

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

  it('can get covid general info', (): void => {
    covidState.selectedCovidData = covidStateMocks.generateCovidDataAllCountries()[0]
    covidState.selectedCovidData.country = covidConstants.generalInfo.country
    covidState.selectedCovidData.cases = covidConstants.generalInfo.cases
    covidState.selectedCovidData.deaths = covidConstants.generalInfo.deaths
    covidState.selectedCovidData.recovered = covidConstants.generalInfo.recovered
    covidState.selectedCovidData.tests = covidConstants.generalInfo.tests
    covidState.selectedCovidData.updated = covidConstants.generalInfo.updated
    covidState.selectedCovidData.todayCases = covidConstants.generalInfo.casesToday

    expect(getCovidGeneralInfo(covidState)).to.eql(covidConstants.generalInfo)
  })

  it('can get covid chart data that are overall totals', (): void => {
    covidState.covidHistoricalCountryData = covidStateMocks.generateCovidHistoricalCountryData()
    covidState.selectedCovidDataType = [{ name: 'Cases', value: 'cases' }]
    covidState.selectedResultType = { name: 'Total', value: 'total' }

    const expected: CovidLineChart = {
      label: 'cases',
      data: covidConstants.datesAndValues().map((dv: DateValue): number => dv.value)
    }

    expect(getCovidChartData(covidState)).to.eql([expected])
  })

  it('can get covid chart data that are totalPerDay', (): void => {
    covidState.covidHistoricalCountryData = covidStateMocks.generateCovidHistoricalCountryData()
    covidState.selectedCovidDataType = [{ name: 'Cases', value: 'cases' }]
    covidState.selectedResultType = { name: 'Total Per Day', value: 'totalPerDay' }

    const expected: CovidLineChart = {
      label: 'cases',
      data: [1, 1, 1, 1]
    }

    expect(getCovidChartData(covidState)).to.eql([expected])
  })
})
