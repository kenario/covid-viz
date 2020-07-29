import { covidEP } from '../shared/constants/'
import { ActionContext } from 'vuex'
import { CovidData } from '../types/'

interface RootState {
  value: string;
}

interface CovidState {
  covidData: CovidData;
}

export const covid = {
  state: () => ({
    covidData: {} as CovidData
  }),
  getters: {
    getCovidData: (state: CovidState): CovidData => state.covidData
  },
  mutations: {
    setCovidData: (state: CovidState, data: CovidData): void => {
      state.covidData = data
    }
  },
  actions: {
    getCovidData: async ({ commit }: ActionContext<RootState, RootState>): Promise<void> => {
      const res = await fetch(covidEP.COVID_API_BASE_URL + covidEP.COVID_API_COUNTRY)
      const data = await res.json()
      commit('setCovidData', data)
    }
  }
}
