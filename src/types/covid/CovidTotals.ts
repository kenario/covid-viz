/**
 * Type for the covid totals section of covid visualization page.
 */
export interface CovidTotals {
  country?: string;
  state?: string;
  county?: string;
  cases: number;
  deaths: number;
  recovered?: number;
  tests?: number;
  vaccinated?: number;
  updated: number;
}
