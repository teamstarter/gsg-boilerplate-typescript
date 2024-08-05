import { gql } from '@apollo/client'

export const UPDATE_TASK = gql`
  mutation UpdateTask($task: taskInput!) {
    taskUpdate(task: $task) {
      id
      name
      active
      date
      color
    }
  }
`
