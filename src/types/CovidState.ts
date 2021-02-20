import {
  DateRange,
  GraphType,
  ResultType,
  SelectItem,
  CovidGlobalData,
  CovidStateData,
  CovidCountryData,
  CovidHistoricalData
} from './'

export interface CovidState {
  selectedCountry: string;
  selectedState: string;
  selectedDates: DateRange;
  selectedGraphType: GraphType;
  selectedResultType: ResultType;
  selectedCovidDataType: SelectItem[];
  selectedCovidCountryData: CovidCountryData;
  selectedCovidStateData: CovidStateData;
  covidGlobalTotals: CovidGlobalData;
  covidCountryTotals: CovidCountryData[];
  covidStateTotals: CovidStateData[];
  covidHistoricalCountryData: CovidHistoricalData;
}
