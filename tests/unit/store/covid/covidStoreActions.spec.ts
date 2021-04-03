import axios from 'axios'
import sinon from 'sinon'
import moment from 'moment'
import { expect } from 'chai'
import { ActionContext } from 'vuex'

import { RS } from '@/store/RS'
import { state } from '@/store/covid/state'
import { actions } from '@/store/covid/actions'
import { covidStateMocks } from '../../covidMocks'
import { CovidStateType } from '@/store/covid/CovidStateType'
import { CovidCountryData, CovidHistoricalData } from '@/types/covid'

const { getCovidCountryData, getHistoricalCountryData } = actions

describe('CovidStoreActions', (): void => {
  const actionObject: ActionContext<CovidStateType, RS> = {
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
    axiosGetStub.resolves({ data: covidDataAllCountries })

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
