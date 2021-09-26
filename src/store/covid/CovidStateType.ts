import {
  DateRange,
  GraphType,
  RankingType,
  ResultType,
  SelectItem
} from '@/types'

import {
  CovidStateData,
  CovidGlobalData,
  CovidCountyData,
  CovidCountryData,
  CovidHistoricalData
} from '@/types/covid'

export interface CovidStateType {
  selectedCountry: string;
  selectedState: string;
  selectedCounty: string;
  selectedDates: DateRange;
  selectedGraphType: GraphType;
  selectedResultType: ResultType;
  selectedRankingDataScale: RankingType;
  selectedGraphDataScale: RankingType;
  selectedCovidDataType: SelectItem[];
  selectedCovidCountryData: CovidCountryData;
  selectedCovidStateData: CovidStateData;
  selectedCovidCountyData: CovidCountyData;
  covidGlobalData: CovidGlobalData;
  covidCountryData: CovidCountryData[];
  covidStateData: CovidStateData[];
  covidCountyData: CovidCountyData[];
  covidHistoricalCountryData: CovidHistoricalData;
  covidHistoricalStateData: CovidHistoricalData;
  covidHistoricalCountyData: CovidHistoricalData;
  dataScales: RankingType[];
  isLoading: boolean;
  hasError: boolean;
}
