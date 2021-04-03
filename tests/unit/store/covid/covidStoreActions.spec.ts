import sinon from 'sinon'
import { expect } from 'chai'
import { ActionContext } from 'vuex'
import { CovidCountryData, CovidHistoricalData } from '@/types'
import { state, actions } from '@/store/covid'
import { CovidStoreState } from '@/store/CovidStoreState'
import { covidStateMocks } from '../../covidMocks'
import moment from 'moment'
import axios from 'axios'

interface RS {
  value: string;
}

const { getCovidCountryData, getHistoricalCountryData } = actions

describe('CovidStoreActions', (): void => {
  const actionObject: ActionContext<CovidStoreState, RS> = {
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

  it('fetches covid data for all countries', async (): Promise<void> => {
    const covidDataAllCountries: CovidCountryData[] = covidStateMocks.generateCovidDataAllCountries()
    axiosGetStub.resolves(covidDataAllCountries)

    await getCovidCountryData(actionObject)
    expect(commitSpy.called).to.be.true
  })

  it('fetches historical covid data within a date range ', async (): Promise<void> => {
    const covidHistoricalCountryData: CovidHistoricalData = covidStateMocks.generateCovidHistoricalCountryData()
    const mockDates: Date[] = [moment.utc().subtract(1, 'days').toDate(), moment.utc().toDate()]
    const expected = '1'

    axiosGetStub.resolves({ data: covidHistoricalCountryData })
    actionObject.state.selectedDates = { startDate: mockDates[0], endDate: mockDates[1] }

    await getHistoricalCountryData(actionObject)
    expect((axiosGetStub.getCall(0).args[0] as string).includes(expected)).to.be.true
  })
})
