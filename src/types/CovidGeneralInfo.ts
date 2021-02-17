/**
 * Type for the general info section of covid visualization page.
 */
export interface CovidGeneralInfo {
  country?: string;
  cases: number;
  casesToday: number;
  deaths: number;
  recovered: number;
  tests: number;
  updated: number;
}
