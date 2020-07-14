import { constants } from '../shared/constants'
import { ActionContext } from 'vuex'
import { CovidCountryData } from '../types/'

interface RootState {
  value: string;
}

interface CovidState {
  countries: CovidCountryData;
}

export const covid = {
  state: () => ({
    countries: {} as CovidCountryData
  }),
  getters: {
    getCountries: (state: CovidState) => state.countries
  },
  mutations: {
    setCovidData: (state: CovidState, data: CovidCountryData): void => {
      state.countries = data
    }
  },
  actions: {
    getCovidData: async ({ commit }: ActionContext<RootState, RootState>): Promise<void> => {
      const res = await fetch(constants.COVID_API_BASE_URL + constants.COVID_API_COUNTRIES)
      const data = await res.json()
      const countries = data.data.rows
      commit('setCovidData', countries)
    }
  }
}
