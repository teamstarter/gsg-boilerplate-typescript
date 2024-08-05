import { gql } from '@apollo/client'

export const TASK_UPDATED = gql`
  subscription OnTaskAdded {
    taskUpdated {
      id
      name
      active
    }
  }
`
