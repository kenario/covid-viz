export interface CovidRawHistoricalData {
  country?: string;
  state?: string;
  county?: string;
  timeline: RawHistoricalDataCategories;
}

interface RawHistoricalDataCategories {
  [key: string]: RawDateValue;
  cases: RawDateValue;
  deaths: RawDateValue;
  recovered: RawDateValue;
  vaccinated: RawDateValue;
}

interface RawDateValue {
  [key: string]: number;
}
