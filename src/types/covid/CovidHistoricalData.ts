import { DateValue } from '../'

export interface CovidHistoricalData {
  country?: string;
  state?: string;
  timeline: HistoricalDataCategories;
}

interface HistoricalDataCategories {
  [key: string]: DateValue[];
  cases: DateValue[];
  deaths: DateValue[];
  recovered: DateValue[];
  vaccinated: DateValue[];
}
