import React, { useEffect, useState } from 'react'
import { gql, useQuery, useSubscription } from '@apollo/client'
import './TaskList.css'

import TaskElement from '../TaskElement/TaskElement'
import { Task } from '../../customTypes'

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

enum titleTaskFrame {
  TODAY = 'Today',
  THIS_WEEK = 'This week',
  LATER = 'Later',
  EXCEEDED = 'Exceeded'
}

const TaskFrame = ({ title, children }: { title: string; children: any }) => {
  const [open, setOpen] = useState(title === 'Today' ? true : false)

  return (
    <div className="task-frame">
      <div>
        <button
          id="toggleAll"
          className="toggle-all"
          aria-label="Toggle all to do tasks"
          style={{ transform: `rotate(${open ? 0 : -90}deg)` }}
          onClick={() => setOpen(!open)}
        >
          <span className="rotate">❯</span>
        </button>
        <h3>{title}</h3>
      </div>
      {open && children}
    </div>
  )
}

interface TaskListProps {
  title: string
  content: Task[]
}

export default function TaskList({
  status,
  sortMode
}: {
  status: string
  sortMode: boolean
}) {
  const [taskList, setTaskList] = useState<TaskListProps[]>([])

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
      let dataTmp = [...data.task]
      if (sortMode) dataTmp.sort(recentSort)
      else dataTmp.sort(oldSort)
      dataTmp.forEach((task: Task) => {
        const taskTime = task.date * 1000
        if (taskTime < actualTime) exceededTasks.push(task)
        else if (taskTime < actualTime + 86400000) todayTasks.push(task)
        else if (taskTime < actualTime + 604800000) thisWeekTasks.push(task)
        else laterTasks.push(task)
      })
    }
    setTaskList([
      { title: titleTaskFrame.TODAY, content: todayTasks },
      { title: titleTaskFrame.THIS_WEEK, content: thisWeekTasks },
      { title: titleTaskFrame.LATER, content: laterTasks },
      { title: titleTaskFrame.EXCEEDED, content: exceededTasks }
    ])
  }, [data, sortMode])

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
    <div>
      {taskList.map((taskList: TaskListProps) => (
        <TaskFrame title={taskList.title} key={taskList.title}>
          {taskList.content.map((task: Task) => (
            <TaskElement task={task} key={task.id} reloadList={refetch} />
          ))}
        </TaskFrame>
      ))}
    </div>
  )
}
