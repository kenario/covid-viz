import sinon from 'sinon'
import { expect } from 'chai'
import { covidEP } from '@/shared/constants'
import { ActionContext } from 'vuex'
import { CovidData, CovidState } from '@/types'
import { state, actions } from '@/store/covid'
import { covidStateMocks } from './covidMocks'
import axios from 'axios'

interface RS {
  value: string;
}

const { getCovidDataAllCountries, getHistoricalCountryData } = actions

describe('Covid Store actions', (): void => {
  const actionObject: ActionContext<CovidState, RS> = {
    commit: (type: string): string => type,
    state: state(),
    dispatch: () => Promise.resolve(),
    getters: {},
    rootGetters: {},
    rootState: { value: '' }
  }
  const commitSpy: sinon.SinonSpy = sinon.spy(actionObject, 'commit')
  const axiosGetStub: sinon.SinonStub = sinon.stub(axios, 'get')

  after((): void => {
    axiosGetStub.restore()
  })

  it('can fetch covid data for all countries', async (): Promise<void> => {
    const covidDataAllCountries: CovidData[] = covidStateMocks.generateCovidDataAllCountries()
    axiosGetStub.resolves(covidDataAllCountries)

    await getCovidDataAllCountries(actionObject)
    expect(commitSpy.called).to.be.true
  })
})
