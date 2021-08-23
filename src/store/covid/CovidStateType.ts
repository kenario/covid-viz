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
  selectedRankingType: RankingType;
  selectedCovidDataType: SelectItem[];
  selectedCovidStateData: CovidStateData;
  selectedCovidCountyData: CovidCountyData;
  selectedCovidCountryData: CovidCountryData;
  selectedCovidHistoricalData: CovidHistoricalData
  covidGlobalData: CovidGlobalData;
  covidStateData: CovidStateData[];
  covidCountyData: CovidCountyData[];
  covidCountryData: CovidCountryData[];
  covidHistoricalCountryData: CovidHistoricalData[];
}
