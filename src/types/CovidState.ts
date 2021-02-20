import {
  DateRange,
  GraphType,
  ResultType,
  SelectItem,
  CovidWorldData,
  CovidStateData,
  CovidCountryData,
  CovidHistoricalData
} from './'

export interface CovidState {
  selectedCountry: string;
  selectedDates: DateRange;
  selectedCovidCountryData: CovidCountryData;
  selectedGraphType: GraphType;
  selectedResultType: ResultType;
  selectedCovidDataType: SelectItem[];
  covidGlobalTotals: CovidWorldData;
  covidCountryTotals: CovidCountryData[];
  covidStateTotals: CovidStateData[];
  covidHistoricalCountryData: CovidHistoricalData;
}
