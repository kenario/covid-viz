/**
 * Type for the general info section of covid visualization page.
 */
export interface CovidGeneralInfo {
  country?: string;
  state?: string;
  county?: string;
  cases: number;
  deaths: number;
  recovered?: number;
  tests?: number;
  updated: number;
}
