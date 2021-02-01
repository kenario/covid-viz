import sinon from 'sinon'
import { expect } from 'chai'
import { ActionContext } from 'vuex'
import { CovidData, CovidHistoricalData, CovidState } from '@/types'
import { state, actions } from '@/store/covid'
import { covidStateMocks } from './covidMocks'
import moment from 'moment'
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
  let axiosGetStub: sinon.SinonStub
  let commitSpy: sinon.SinonSpy

  beforeEach((): void => {
    commitSpy = sinon.spy(actionObject, 'commit')
    axiosGetStub = sinon.stub(axios, 'get')
  })

  afterEach((): void => {
    commitSpy.restore()
    axiosGetStub.restore()
  })

  it('can fetch covid data for all countries', async (): Promise<void> => {
    const covidDataAllCountries: CovidData[] = covidStateMocks.generateCovidDataAllCountries()
    axiosGetStub.resolves(covidDataAllCountries)

    await getCovidDataAllCountries(actionObject)
    expect(commitSpy.called).to.be.true
  })

  it('can fetch historical covid data within a date range ', async (): Promise<void> => {
    const covidHistoricalCountryData: CovidHistoricalData = covidStateMocks.generateCovidHistoricalCountryData()
    const mockDates: Date[] = [moment.utc().subtract(1, 'days').toDate(), moment.utc().toDate()]
    const expected = '1'

    axiosGetStub.resolves({ data: covidHistoricalCountryData })
    actionObject.state.selectedDates = { startDate: mockDates[0], endDate: mockDates[1] }

    await getHistoricalCountryData(actionObject)
    expect((axiosGetStub.getCall(0).args[0] as string).includes(expected)).to.be.true
  })
})
