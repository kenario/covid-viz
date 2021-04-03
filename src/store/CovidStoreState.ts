import {
  DateRange,
  GraphType,
  ResultType,
  SelectItem,
  CovidStateData,
  CovidCountyData,
  CovidGlobalData,
  CovidCountryData,
  CovidHistoricalData
} from '@/types'

export interface CovidStoreState {
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
  covidGlobalData: CovidGlobalData;
  covidCountryData: CovidCountryData[];
  covidStateData: CovidStateData[];
  covidCountyData: CovidCountyData[];
  covidHistoricalCountryData: CovidHistoricalData;
}
