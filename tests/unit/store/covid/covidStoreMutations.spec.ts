import { expect } from 'chai'
import { state } from '@/store/covid/state'
import { CovidCountryData } from '@/types/covid'
import { mutations } from '@/store/covid/mutations'
import { CovidStateType } from '@/store/covid/CovidStateType'
import { covidStateMocks, covidConstants } from '../../covidMocks'

const { setCovidVaccineCountryData } = mutations

let covidState: CovidStateType = state()

describe('CovidStoreMutations', (): void => {
  afterEach((): void => {
    covidState = state()
  })

  it('sets covid vaccinated data for each country', (): void => {
    const countryVaccinated = covidStateMocks.generateVaccinatedCountryMap()
    covidState.covidCountryData = covidStateMocks.generateCovidDataAllCountries()
    setCovidVaccineCountryData(covidState, countryVaccinated)

    const expected = covidState.covidCountryData.map((data: CovidCountryData): number => data.baseData.vaccinated as number)
    const actual = [...countryVaccinated.values()]
    expect(expected).to.eql(actual)
  })
})
