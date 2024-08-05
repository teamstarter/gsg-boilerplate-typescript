import { gql } from '@apollo/client'

export const ADD_TASK = gql`
  mutation AddTask($task: taskInput!) {
    taskCreate(task: $task) {
      id
      name
      date
    }
  }
`
