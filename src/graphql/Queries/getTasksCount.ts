import { gql } from '@apollo/client'

export const GET_TASKS_COUNT = gql`
  query GetTasksCount($where: SequelizeJSON) {
    taskCount(where: $where)
  }
`
