import { gql } from '@apollo/client'

export const ADD_TASK = gql`
  mutation AddTask($task: taskInput!) {
    taskCreate(task: $task) {
      id
      name
      reminderDate
    }
  }
`;

export const UPDATE_TASK = gql`
  mutation UpdateTask($task: taskInput!) {
    taskUpdate(task: $task) {
      id
      name
      active
      reminderDate
    }
  }
`
export const DELETE_TASK = gql`
  mutation DeleteTask($id: Int!) {
    taskDelete(id: $id)
  }
`