import { gql } from '@apollo/client'

export const GET_TASKS = gql`
  query GetTasks($order: String, $where: SequelizeJSON) {
    task(order: $order, where: $where) {
      id
      name
      active
      color
      date
    }
  }
`
