export const covidEP = {
  COVID_API_BASE_URL: 'https://disease.sh',
  COVID_API_GLOBAL_TOTALS: '/v3/covid-19/all',
  COVID_API_ALL_COUNTRIES: '/v3/covid-19/countries',
  COVID_API_STATE_TOTALS: '/v3/covid-19/states',
  COVID_API_COUNTY_TOTALS: '/v3/covid-19/jhucsse/counties',
  COVID_API_VACCINE_GLOBAL_TOTALS: '/v3/covid-19/vaccine/coverage?lastdays=1',
  COVID_API_VACCINE_ALL_COUNTRIES: '/v3/covid-19/vaccine/coverage/countries?lastdays=1',
  COVID_API_VACCINE_ALL_STATES: '/v3/covid-19/vaccine/coverage/states?lastdays=1',
  COVID_API_HISTORICAL_COUNTRY_DATA: '/v3/covid-19/historical/country?lastdays=numOfDays',
  COVID_API_HISTORICAL_COUNTRY_VACCINE: '/v3/covid-19/vaccine/coverage/countries/country?lastdays=numOfDays',
  COVID_API_HISTORICAL_STATE_DATA: '/v3/covid-19/nyt/states/{state}?lastdays=numOfDays',
  COVID_API_HISTORICAL_STATE_VACCINE: '/v3/covid-19/vaccine/coverage/states/{state}?lastdays=numOfDays'
}
