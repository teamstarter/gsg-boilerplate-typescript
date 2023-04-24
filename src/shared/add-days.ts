export function addDays(date: string, days: number) {
  var result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}
