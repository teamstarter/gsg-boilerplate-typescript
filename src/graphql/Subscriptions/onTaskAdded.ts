import { gql } from '@apollo/client'

export const TASK_ADDED = gql`
  subscription OnTaskAdded {
    taskCreated {
      id
      name
      active
    }
  }
`
