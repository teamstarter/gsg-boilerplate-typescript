import React, { useEffect } from 'react'
import { gql, useQuery, useSubscription } from '@apollo/client'

import TaskElement from './taskElement'
import { Task } from '../customTypes'
import ReminderNotification from './reminderNotification'

const GET_TASKS = gql`
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

const TASK_ADDED = gql`
  subscription OnTaskAdded {
    taskCreated {
      id
      name
      active
    }
  }
`

const TASK_DELETED = gql`
  subscription OnTaskDeleted {
    taskDeleted {
      id
      name
      active
    }
  }
`

export default function TaskList({ status }: { status: string }) {
  function isActive(status: string) {
    if (status === 'active') return true
    else if (status === 'completed') return false
    else return undefined
  }

  const { loading, error, data, refetch } = useQuery(GET_TASKS, {
    variables: {
      order: 'reverse:createdAt',
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

  const today = new Date().toISOString().split('T')[0]

  const isReminderNotificationToBeDisplayed = (
    date: string,
    active: boolean
  ) => {
    if (date !== undefined && active) {
      const formattedDate = date?.split('T')[0]
      return today === formattedDate
    }
    return false
  }

  return (
    <ul id="todos" className="todos" aria-label="List of to do tasks">
      {data.task.map((task: Task) => (
        <>
          <TaskElement task={task} key={task.id} reloadList={refetch} />
          {isReminderNotificationToBeDisplayed(task.date, task.active) && (
            <ReminderNotification task={task} />
          )}
        </>
      ))}
    </ul>
  )
}
