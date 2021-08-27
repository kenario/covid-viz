import axios from 'axios'
import sinon from 'sinon'
import moment from 'moment'
import { expect } from 'chai'
import { ActionContext } from 'vuex'

import { RS } from '@/store/RS'
import { state } from '@/store/covid/state'
import { covidEP } from '@/shared/constants'
import { actions } from '@/store/covid/actions'
import { covidStateMocks } from '../../covidMocks'
import { CovidStateType } from '@/store/covid/CovidStateType'
import { CovidCountryData, CovidHistoricalData } from '@/types/covid'

const { getCovidCountryData, getHistoricalCountryData } = actions

const generateActionObject = (): ActionContext<CovidStateType, RS> => {
  return {
    commit: (type: string): string => type,
    state: state(),
    dispatch: () => Promise.resolve(),
    getters: {},
    rootGetters: {},
    rootState: { value: '' }
  }
}

describe('CovidStoreActions', (): void => {
  let actionObject: ActionContext<CovidStateType, RS>
  let axiosGetStub: sinon.SinonStub
  let commitSpy: sinon.SinonSpy

  beforeEach((): void => {
    actionObject = generateActionObject()
    commitSpy = sinon.spy(actionObject, 'commit')
    axiosGetStub = sinon.stub(axios, 'get')
  })

  afterEach((): void => {
    commitSpy.restore()
    axiosGetStub.restore()
  })

  describe('getCovidCountryData', (): void => {
    it('fetches covid data for all countries', async (): Promise<void> => {
      const covidDataAllCountries: CovidCountryData[] = covidStateMocks.generateCovidDataAllCountries()
      axiosGetStub.resolves({ data: covidDataAllCountries })

      await getCovidCountryData(actionObject)
      expect(commitSpy.called).to.be.true
    })
  })

  describe('getHistoricalCountryData', (): void => {
    it('fetches historical covid data within a date range ', async (): Promise<void> => {
      const rawCovidHistoricalCountryData: any = covidStateMocks.generateRawCovidHistoricalCountryData()
      const rawCovidHistoricalVaccineCountryData: any = covidStateMocks.generateRawCovidHistoricalVaccineCountryData()
      const covidHistoricalCountryData: CovidHistoricalData = covidStateMocks.generateCovidHistoricalCountryData()
      const mockDates: Date[] = [moment.utc().subtract(3, 'days').toDate(), moment.utc().subtract(1, 'days').toDate()]
      const expectedPathCountryQuery = 'USA'
      const expectedPathLastDayQuery = 'lastdays=3'
      const baseDataPath = covidEP.COVID_API_HISTORICAL_COUNTRY_DATES
        .replace('country', expectedPathCountryQuery)
        .replace('numOfDays', '3')
      const vaccineDataPath = covidEP.COVID_API_HISTORICAL_COUNTRY_VACCINE
        .replace('country', expectedPathCountryQuery)
        .replace('numOfDays', '3')

      /*
       * Two http get requests are made so we have to stub the specific requests and have them resolve
       * their own specific data. */
      axiosGetStub
        .withArgs(covidEP.COVID_API_BASE_URL + baseDataPath)
        .resolves({ data: rawCovidHistoricalCountryData })
      axiosGetStub
        .withArgs(covidEP.COVID_API_BASE_URL + vaccineDataPath)
        .resolves({ data: rawCovidHistoricalVaccineCountryData })
      actionObject.state.selectedDates = { startDate: mockDates[0], endDate: mockDates[1] }
      actionObject.state.selectedCountry = 'USA'
      await getHistoricalCountryData(actionObject)

      /*
       * Some string manipulations happen to the historical data endpoint, so we test to make sure that those
       * manipulations did take place. */
      expect((axiosGetStub.getCall(0).args[0] as string).includes(expectedPathCountryQuery)).to.be.true
      expect((axiosGetStub.getCall(0).args[0] as string).includes(expectedPathLastDayQuery)).to.be.true

      /*
       * We remove the 1st and last elements in the cases, deaths, recovered, vaccinated arrays.
       * Since the array assigned to cases, deaths, recovered, and vaccinated are all the same reference,
       * we only have to call pop once. */
      covidHistoricalCountryData.timeline.cases.pop()
      covidHistoricalCountryData.timeline.cases = covidHistoricalCountryData.timeline.cases.slice(1)
      covidHistoricalCountryData.timeline.deaths = covidHistoricalCountryData.timeline.deaths.slice(1)
      covidHistoricalCountryData.timeline.recovered = covidHistoricalCountryData.timeline.recovered.slice(1)
      covidHistoricalCountryData.timeline.vaccinated = covidHistoricalCountryData.timeline.vaccinated.slice(1)
      
      expect(commitSpy.getCall(0).args[1]).to.deep.equal(covidHistoricalCountryData)
    })
  })
})
