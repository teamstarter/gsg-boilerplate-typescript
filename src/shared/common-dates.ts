import { addDays } from './add-days'

export const CURRENT_DATE = new Date().toISOString().substring(0, 10)

export const TOMOROW_DATE = addDays(CURRENT_DATE, 1)
  .toISOString()
  .substring(0, 10)
