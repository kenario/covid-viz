import { expect } from 'chai'
import { DateValue } from '@/types'
import { state } from '@/store/covid/state'
import { CovidLineChart } from '@/types/covid'
import { getters } from '@/store/covid/getters'
import { CovidStateType } from '@/store/covid/CovidStateType'
import { covidConstants, covidStateMocks } from '../../covidMocks'

const {
  getCovidRankings,
  getStatesAffectedCounties,
  getAllAffectedCountries,
  getCovidCountryTotals,
  getCovidChartLabels,
  getCovidChartData
} = getters

let covidState: CovidStateType = state()

describe('CovidStoreGetters', (): void => {
  afterEach((): void => {
    covidState = state()
  })

  it('gets all affected countries', (): void => {
    covidState.covidCountryData = covidStateMocks.generateCovidDataAllCountries()
    expect(getAllAffectedCountries(covidState)).to.eql(covidConstants.affectedCountries)
  })

  it('gets all affected counties', (): void => {
    covidState.covidCountyData = covidStateMocks.generateCovidDataAllCounties()
    covidState.selectedState = covidConstants.affectedCountries[0].name
    expect(getStatesAffectedCounties(covidState)).to.eql([{
      name: covidConstants.affectedCountries[0].name,
      value: covidConstants.affectedCountries[0].name.toLowerCase()
    }])
  })

  it('gets chart labels needed for covid chart', (): void => {
    covidState.covidHistoricalCountryData = covidStateMocks.generateCovidHistoricalCountryData()
    covidState.selectedGraphDataScale = { name: 'Nationwide', value: 'nationwide' }
    expect(getCovidChartLabels(covidState)).to
      .eql(covidConstants.datesAndValues().map((d: DateValue): string => d.date))
  })

  it('gets covid country totals', (): void => {
    covidState.selectedCovidCountryData = covidStateMocks.generateCovidDataAllCountries()[0]
    covidState.selectedCovidCountryData.country = covidConstants.covidGlobalTotals.country
    covidState.selectedCovidCountryData.baseData.cases = covidConstants.covidGlobalTotals.cases
    covidState.selectedCovidCountryData.baseData.recovered = covidConstants.covidGlobalTotals.recovered
    covidState.selectedCovidCountryData.baseData.deaths = covidConstants.covidGlobalTotals.deaths
    covidState.selectedCovidCountryData.baseData.tests = covidConstants.covidGlobalTotals.tests
    covidState.selectedCovidCountryData.baseData.vaccinated = covidConstants.covidGlobalTotals.vaccinated
    covidState.selectedCovidCountryData.baseData.updated = covidConstants.covidGlobalTotals.updated
    expect(getCovidCountryTotals(covidState)).to.eql(covidConstants.covidGlobalTotals)
  })

  it('gets covid chart data that are overall totals', (): void => {
    covidState.covidHistoricalCountryData = covidStateMocks.generateCovidHistoricalCountryData()
    covidState.selectedCovidDataType = [{ name: 'Cases', value: 'cases' }]
    covidState.selectedGraphMeasurementType = { name: 'Total', value: 'total' }
    covidState.selectedGraphDataScale = { name: 'Nationwide', value: 'nationwide' }

    const expected: CovidLineChart = {
      label: 'Cases',
      data: covidConstants.datesAndValues().map((dv: DateValue): number => dv.value)
    }

    expect(getCovidChartData(covidState)).to.eql([expected])
  })

  it('gets covid chart data that are totalPerDay', (): void => {
    covidState.covidHistoricalCountryData = covidStateMocks.generateCovidHistoricalCountryData()
    covidState.selectedCovidDataType = [{ name: 'Cases', value: 'cases' }]
    covidState.selectedGraphMeasurementType = { name: 'Total Per Day', value: 'totalPerDay' }
    covidState.selectedGraphDataScale = { name: 'Nationwide', value: 'nationwide' }

    const expected: CovidLineChart = {
      label: 'Cases',
      data: [1, 1, 1, 1]
    }

    expect(getCovidChartData(covidState)).to.eql([expected])
  })

  it('gets the top five countries with the most casesPerOneMillion in descending order', (): void => {
    covidState.covidCountryData = [
      ...covidStateMocks.generateCovidDataAllCountries(),
      ...covidStateMocks.generateCovidDataAllCountries()
    ]
    covidState.selectedRankingDataScale = { name: 'Worldwide', value: 'worldwide' }
    const countriesWithHighestCases = getCovidRankings(covidState)[0].data
    let isDescendingOrder = true
    /*
     * Iterate through result and make sure that the totals are in descending order.  Loop stops
     * when index is out of bounds or when a total is found to not be in descending order. */
    for (let x = 0; x < countriesWithHighestCases.length; x++) {
      if (!countriesWithHighestCases[x + 1]) {
        break
      } else {
        isDescendingOrder = countriesWithHighestCases[x].total > countriesWithHighestCases[x + 1].total
      }

      if (!isDescendingOrder) {
        break
      }
    }

    expect(isDescendingOrder).to.be.true
    expect(countriesWithHighestCases.length).to.equal(10)
  })
})
