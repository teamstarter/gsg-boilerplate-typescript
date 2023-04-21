import React, { useEffect, useState } from 'react'
import { gql, useQuery, useSubscription } from '@apollo/client'

import TaskElement from './taskElement'
import { Task } from '../customTypes'

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
      date
    }
  }
`

const TASK_DELETED = gql`
  subscription OnTaskDeleted {
    taskDeleted {
      id
      name
      active
      date
    }
  }
`

export default function TaskList({ status }: { status: string }) {
  const [sortedData, setSortedData] = useState<Task[]>([])

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

  /* SORT PART */
  const recentSort = (a: Task, b: Task) => {
    return a.date - b.date
  }

  const oldSort = (a: Task, b: Task) => {
    return b.date - a.date
  }

  useEffect(() => {
    const actualTime = Date.now()
    const todayTasks: Task[] = []
    const thisWeekTasks: Task[] = []
    const laterTasks: Task[] = []
    const exceededTasks: Task[] = []

    if (data && data.task) {
      data.task.forEach((task: Task) => {
        const taskTime = task.date * 1000
        if (taskTime < actualTime) exceededTasks.push(task)
        else if (taskTime < actualTime + 86400000) todayTasks.push(task)
        else if (taskTime < actualTime + 604800000) thisWeekTasks.push(task)
        else laterTasks.push(task)
      })
    }
    // const sortedData = [...data.task].sort(compareDate)
    // setSortedData(sortedData)
  }, [data])

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
