export type Task = {
  id: number
  name: string
  active: boolean
  reminderDate: string
}

export type reminderDateUpdaterType = (date: string) => void;
export type reminderDateModalOpenerType = (date: string,func: reminderDateUpdaterType) => void;

