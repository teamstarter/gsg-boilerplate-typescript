import React, { useEffect } from 'react'
import { useQuery, useSubscription } from '@apollo/client'

import TaskElement from './taskElement'
import { Task, reminderDateModalOpenerType } from '../customTypes'

import { GET_TASKS } from '../graphql/queries/taskQueries'
import { TASK_ADDED, TASK_DELETED, TASK_UPDATED } from '../graphql/subscriptions/taskSubscriptions'

interface TaskListProps {
  status: string;
  openReminderModal: reminderDateModalOpenerType;
}

const TaskList: React.FC<TaskListProps> = ({ status, openReminderModal}) => {
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

  useSubscription(TASK_UPDATED, {
    onSubscriptionData: () => {
      refetch()
    },
  })

  if (loading) return <p>Loading ...</p>

  if (error) return <p>An error occured while loading the tasks !</p>

  return (
    <ul id="todos" className="todos" aria-label="List of to do tasks">
      {data.task.map((task: Task) => (
        <TaskElement task={task} key={task.id} reloadList={refetch} openReminderModal={openReminderModal} />
      ))}
    </ul>
  )
}
export default TaskList;
