import {
  DateRange,
  CovidData,
  GraphType,
  ResultType,
  SelectItem,
  CovidHistoricalData
} from './'

export interface CovidState {
  selectedCountry: string;
  selectedDates: DateRange;
  selectedCovidData: CovidData;
  selectedGraphType: GraphType;
  selectedResultType: ResultType;
  selectedCovidDataType: SelectItem[];
  covidDataAllCountries: CovidData[];
  covidHistoricalCountryData: CovidHistoricalData;
}
