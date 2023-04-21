import { gql, useQuery, useSubscription } from '@apollo/client'
import React from 'react'
import './Foot.css'
/* Ressources */
import arrow from './Ressources/arrow.svg'

const GET_TASKS_COUNT = gql`
  query GetTasksCount($where: SequelizeJSON) {
    taskCount(where: $where)
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

const TASK_UPDATED = gql`
  subscription OnTaskAdded {
    taskUpdated {
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

interface FootProps {
  select: (status: string) => void
  currentStatus: string
  sortMode: boolean
  setSortMode: (sortMode: boolean) => void
}

export default function Foot({
  select,
  currentStatus,
  sortMode,
  setSortMode
}: FootProps) {
  const { loading, data, refetch } = useQuery(GET_TASKS_COUNT, {
    variables: {
      where: {
        active: true
      }
    }
  })

  useSubscription(TASK_ADDED, {
    onSubscriptionData: () => {
      refetch()
    }
  })

  useSubscription(TASK_UPDATED, {
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

  return (
    <div id="todoMenu2" className="todo-menu-2">
      <div id="todoMenu2LeftPart" className="todo-meny-2-left-part">
        <label
          id="todosLeft"
          className="todos-left"
          aria-label="Number of to do tasks left to complete"
        >
          Todos left: {data.taskCount}
        </label>
        <img
          className={
            sortMode ? 'recent-sort-arrow active' : 'recent-sort-arrow'
          }
          src={arrow}
          alt="recent-arrow"
          onClick={() => {
            setSortMode(true)
          }}
        />
        <img
          className={sortMode ? 'old-sort-arrow' : 'old-sort-arrow active'}
          src={arrow}
          alt="old-arrow"
          onClick={() => {
            setSortMode(false)
          }}
        />
      </div>
      <div id="todoMenu2Buttons" className="todo-menu-2-buttons">
        <button
          id="showAllTodos"
          className={`menu-2-button ${currentStatus === 'all' && 'active'}`}
          aria-label="Show all to do tasks"
          onClick={() => select('all')}
        >
          All
        </button>
        <button
          id="showUncompletedTodos"
          className={`menu-2-button ${currentStatus === 'active' && 'active'}`}
          aria-label="Show active to do tasks"
          onClick={() => select('active')}
        >
          Active
        </button>
        <button
          id="showCompletedTodos"
          className={`menu-2-button ${currentStatus === 'completed' &&
            'active'}`}
          aria-label="Show completed to do tasks"
          onClick={() => select('completed')}
        >
          Completed
        </button>
      </div>
      <button
        id="deleteCompletedButton"
        className="delete-completed-button"
        aria-label="Clear completed to do tasks"
        style={{ display: 'none' }}
      >
        Clear completed
      </button>
    </div>
  )
}
