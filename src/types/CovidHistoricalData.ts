import { DateValue } from './DateValue'

/**
 * Historical Country Data for specific country and default or specified number of days from the
 * NovelCOVID API.
 */

export interface CovidHistoricalData {
  country: string;
  province: string[];
  timeline: HistoricalDataCategories;
}

interface HistoricalDataCategories {
  [key: string]: DateValue[];
  cases: DateValue[];
  deaths: DateValue[];
  recovered: DateValue[];
}
