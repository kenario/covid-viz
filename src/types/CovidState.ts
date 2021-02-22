import {
  DateRange,
  GraphType,
  ResultType,
  SelectItem,
  CovidGlobalData,
  CovidStateData,
  CovidCountyData,
  CovidCountryData,
  CovidHistoricalData
} from './'

export interface CovidState {
  selectedCountry: string;
  selectedState: string;
  selectedCounty: string;
  selectedDates: DateRange;
  selectedGraphType: GraphType;
  selectedResultType: ResultType;
  selectedCovidDataType: SelectItem[];
  selectedCovidCountryData: CovidCountryData;
  selectedCovidStateData: CovidStateData;
  selectedCovidCountyData: CovidCountyData;
  covidGlobalTotals: CovidGlobalData;
  covidCountryTotals: CovidCountryData[];
  covidStateTotals: CovidStateData[];
  covidCountyTotals: CovidCountyData[];
  covidHistoricalCountryData: CovidHistoricalData;
}
