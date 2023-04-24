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

export const TASK_UPDATED = gql`
  subscription OnTaskAdded {
    taskUpdated {
      id
      name
      active
    }
  }
`

export const TASK_DELETED = gql`
  subscription OnTaskDeleted {
    taskDeleted {
      id
      name
      active
    }
  }
`
