import { gql } from '@apollo/client'

export const TASK_DELETED = gql`
  subscription OnTaskDeleted {
    taskDeleted {
      id
      name
      active
    }
  }
`
