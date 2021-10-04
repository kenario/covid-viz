import {
  DateRange,
  GraphType,
  DataScale,
  MeasurementType,
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
  selectedRankingMeasurementType: MeasurementType;
  selectedGraphMeasurementType: MeasurementType;
  selectedRankingDataScale: DataScale;
  selectedGraphDataScale: DataScale;
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
  dataScales: DataScale[];
  isLoading: boolean;
  hasError: boolean;
}
