import { ActionContext } from 'vuex'
import { covidEP } from '../shared/constants/'
import { CovidData, CovidGeneralInfo } from '../types/'

interface RootState {
  value: string;
}

interface CovidState {
  covidData: CovidData;
  covidDataAllCountries: CovidData[];
}

export const covid = {
  state: () => ({
    covidData: {} as CovidData,
    covidDataAllCountries: [] as CovidData[]
  }),
  getters: {
    getCovidGeneralInfo: (state: CovidState): CovidGeneralInfo => {
      const data: CovidData = state.covidData

      return {
        country: data.country,
        cases: data.cases,
        deaths: data.deaths,
        recovered: data.recovered,
        tests: data.tests,
        updated: data.updated,
        casesToday: data.todayCases
      }
    },
    getAllAffectedCountries: (state: CovidState): string[] =>
      state.covidDataAllCountries.map((data: CovidData): string => data.country!)
  },
  mutations: {
    setCovidData: (state: CovidState, data: CovidData): void => {
      state.covidData = data
    },
    setCovidDataAllCountries: (state: CovidState, data: CovidData[]): void => {
      state.covidDataAllCountries = data
    }
  },
  actions: {
    getCovidData: async ({ commit }: ActionContext<RootState, RootState>): Promise<void> => {
      const res = await fetch(covidEP.COVID_API_BASE_URL + covidEP.COVID_API_COUNTRY)
      const data = await res.json()
      commit('setCovidData', data)
    },
    getCovidDataAllCountries: async ({ commit }: ActionContext<RootState, RootState>): Promise<void> => {
      const res = await fetch(covidEP.COVID_API_BASE_URL + covidEP.COVID_API_ALL_COUNTRIES)
      const data = await res.json()
      commit('setCovidDataAllCountries', data)
    }
  }
}
