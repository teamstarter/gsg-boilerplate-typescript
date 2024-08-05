import { gql } from '@apollo/client'

export const DELETE_TASK = gql`
  mutation DeleteTask($id: Int!) {
    taskDelete(id: $id)
  }
`
