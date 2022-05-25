export interface CovidVaccineData {
  country?: string;
  state?: string;
  timeline: Timeline;
}

interface Timeline {
  [key: string]: number
}
