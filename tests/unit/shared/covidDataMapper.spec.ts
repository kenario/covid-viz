import { expect } from 'chai'
import { CovidDataMapper } from '@/shared/CovidDataMapper'
import { CovidCountryData } from '@/types/covid'
import { covidStateMocks } from '../covidMocks'

describe('CovidDataMapper', (): void => {
  const rawData = covidStateMocks.generateRawCovidData()

  it('maps raw covid data to a specific scale of covid data', (): void => {
    const data: CovidCountryData = CovidDataMapper.map<CovidCountryData>(rawData)

    expect(Object.keys(data).includes('baseData')).to.be.true
    expect(Object.keys(data.baseData).includes('tests')).to.be.true
    expect(Object.keys(data.baseData).includes('cases')).to.be.true
    expect(Object.keys(data.baseData).includes('deaths')).to.be.true
    expect(Object.keys(data.baseData).includes('active')).to.be.true
    expect(Object.keys(data.baseData).includes('updated')).to.be.true
    expect(Object.keys(data.baseData).includes('population')).to.be.true
    expect(Object.keys(data.baseData).includes('todayCases')).to.be.true
    expect(Object.keys(data.baseData).includes('todayDeaths')).to.be.true
    expect(Object.keys(data.baseData).includes('casesPerOneMillion')).to.be.true
    expect(Object.keys(data.baseData).includes('testsPerOneMillion')).to.be.true
    expect(Object.keys(data.baseData).includes('deathsPerOneMillion')).to.be.true
  })

  it('mapped data should no longer exist in root object', (): void => {
    const data: CovidCountryData = CovidDataMapper.map<CovidCountryData>(rawData)

    expect(Object.keys(data).includes('tests')).to.be.false
    expect(Object.keys(data).includes('cases')).to.be.false
    expect(Object.keys(data).includes('deaths')).to.be.false
    expect(Object.keys(data).includes('active')).to.be.false
    expect(Object.keys(data).includes('updated')).to.be.false
    expect(Object.keys(data).includes('population')).to.be.false
    expect(Object.keys(data).includes('todayCases')).to.be.false
    expect(Object.keys(data).includes('todayDeaths')).to.be.false
    expect(Object.keys(data).includes('casesPerOneMillion')).to.be.false
    expect(Object.keys(data).includes('testsPerOneMillion')).to.be.false
    expect(Object.keys(data).includes('deathsPerOneMillion')).to.be.false
  })
})
