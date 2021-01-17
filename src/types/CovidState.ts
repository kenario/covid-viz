import {
  DateRange,
  CovidData,
  GraphType,
  ResultType,
  CovidHistoricalData
} from './'

export interface CovidState {
  selectedCountry: string;
  selectedDates: DateRange;
  selectedCovidData: CovidData;
  selectedGraphType: GraphType;
  selectedResultType: ResultType;
  selectedCovidDataType: string[];
  covidDataAllCountries: CovidData[];
  covidHistoricalCountryData: CovidHistoricalData;
}
