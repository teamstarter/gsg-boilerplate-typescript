import React, { ChangeEvent, MouseEvent } from 'react'
import { gql, useMutation } from '@apollo/client'
import { useDebouncedCallback } from 'use-debounce'

import { Task } from '../customTypes'

export default function TaskElement({
  task,
  reloadList
}: {
  task: Task
  reloadList: () => void
}) {
  const UPDATE_TASK = gql`
    mutation UpdateTask($task: taskInput!) {
      taskUpdate(task: $task) {
        id
        name
        active
        reminderDate
      }
    }
  `
  const DELETE_TASK = gql`
    mutation DeleteTask($id: Int!) {
      taskDelete(id: $id)
    }
  `

  const { id, name, active, reminderDate } = task

  const [taskUpdate] = useMutation(UPDATE_TASK)

  const [taskDelete] = useMutation(DELETE_TASK)

  // Checks if task should be reminded
  function isTimeToRemind(date: any) {
    // console.log('typeof date : ', typeof date)
    // FIXME (PPDS) : reminderDate received is in string format but expected number
    if (Date.parse(date) <= new Date().setHours(0, 0, 0, 0)) {
      return true
    } else return false
  }

  // Toggles a reminder by changing date to null if existing or changing it to current date
  async function handleToggleReminder(e: MouseEvent<HTMLButtonElement>) {
    const todayDate = new Date().setHours(0, 0, 0, 0)
    await taskUpdate({
      variables: {
        task: {
          id: id,
          reminderDate: reminderDate ? null : todayDate
        }
      }
    })
    reloadList()
  }

  async function handleUpdateReminder(
    e: ChangeEvent<HTMLInputElement>
  ) {
    const newDate = Date.parse(e.currentTarget.value)

    await taskUpdate({
      variables: {
        task: {
          id: id,
          reminderDate: newDate
        }
      }
    })
    reloadList()
  }

  async function handleCheck(e: ChangeEvent<HTMLInputElement>) {
    await taskUpdate({
      variables: {
        task: { id: id, active: !e.currentTarget.checked }
      }
    })
    reloadList()
  }

  function handleDelete(e: MouseEvent<HTMLButtonElement>) {
    taskDelete({
      variables: {
        id: id
      }
    })
  }
  
  const { callback: debouncedHandleUpdate }: any = useDebouncedCallback(
    (value: any) => {
      taskUpdate({
        variables: {
          task: { id: id, name: value }
        }
      })
    },
    1000
  )

  return (
    <li className="todo">
      <div className="pretty p-icon p-round">
        <input
          type="checkbox"
          className="checkbox"
          checked={!active}
          onChange={handleCheck}
        />
        <div className="state">
          <i className="icon mdi mdi-check mdi-18px"></i>
          <label></label>
        </div>
      </div>
      <input
        className={`todo-text ${!active && 'todo-checked-text'}`}
        onChange={e => debouncedHandleUpdate(e.currentTarget.value)}
        defaultValue={name}
      ></input>

      {/* Date input that is hidden if reminder date not defined + highlighted if date current or past via CSS */}
      <input
        type="date"
        className={`todo-reminder${!reminderDate ? '-hidden' : ''} ${isTimeToRemind(
          reminderDate
        ) && 'todo-reminder-current'}`}
        onChange={handleUpdateReminder}
        value={new Date(reminderDate).toISOString().split('T')[0]}
      ></input>
      
       {/* Button icon that toggles date selection by adding or removing value for reminderDate */}
      <button className="set-reminder-button" onClick={handleToggleReminder}>
        {reminderDate ? <span>&#128277;</span> : <span>&#128276;</span>}
      </button>
      <button className="delete-button" onClick={handleDelete}>
        ×
      </button>
    </li>
  )
}
