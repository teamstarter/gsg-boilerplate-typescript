import React, { useEffect } from 'react'
import { useQuery, useSubscription } from '@apollo/client'
import TaskElement from './taskElement'
import { Task } from '../../customTypes'
import { GET_TASKS } from '../../graphql/Queries/getTasks'
import { TASK_ADDED } from '../../graphql/Subscriptions/onTaskAdded'
import { TASK_DELETED } from '../../graphql/Subscriptions/onTaskDeleted'

export default function TaskList({ status }: { status: string }) {
  function isActive(status: string) {
    if (status === 'active') return true
    else if (status === 'completed') return false
    else return undefined
  }

  const { loading, error, data, refetch } = useQuery(GET_TASKS, {
    variables: {
      order: 'date',
      where: {
        active: isActive(status)
      }
    }
  })

  useEffect(() => {
    refetch()
  }, [refetch, status])

  useSubscription(TASK_ADDED, {
    onSubscriptionData: () => {
      refetch()
    }
  })

  useSubscription(TASK_DELETED, {
    onSubscriptionData: () => {
      refetch()
    }
  })

  if (loading) return <p>Loading ...</p>

  if (error) return <p>An error occured while loading the tasks !</p>

  return (
    <ul id="todos" className="todos" aria-label="List of to do tasks">
      {data.task.map((task: Task) => (
        <TaskElement task={task} key={task.id} reloadList={refetch} />
      ))}
    </ul>
  )
}
