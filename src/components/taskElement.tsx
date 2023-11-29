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
        reminder
      }
    }
  `
  const DELETE_TASK = gql`
    mutation DeleteTask($id: Int!) {
      taskDelete(id: $id)
    }
  `

  const { id, name, active, reminder } = task

  const [taskUpdate] = useMutation(UPDATE_TASK)

  const [taskDelete] = useMutation(DELETE_TASK)

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
    (values: { newName: string; newReminder: Date }) => {
      taskUpdate({
        variables: {
          task: { id: id, name: values.newName, reminder: values.newReminder }
        }
      })
    },
    1000
  )

  const { callback: updateReminder }: any = useDebouncedCallback(
    (values: { newReminder: Date }) => {
      console.log('Debounced update triggered:', values)

      taskUpdate({
        variables: {
          task: { id: id, reminder: values.newReminder }
        }
      })
    },
    1000
  )

  return (
    <li className="todo">
      <div className="flex-row flex-left">
        <div>
          <input
            type="checkbox"
            className="checkbox"
            checked={!active}
            onChange={handleCheck}
          />
        </div>
        <input
          className={`todo-text ${!active && 'todo-checked-text'}`}
          onChange={e =>
            debouncedHandleUpdate({ newName: e.currentTarget.value })
          }
          defaultValue={name}
        ></input>
      </div>

      <div className="flex-row flex-right">
        <input
          className={
            reminder && new Date(reminder) < new Date() ? 'reminder-late' : ''
          }
          type="date"
          onChange={e =>
            updateReminder({
              newReminder: new Date(e.currentTarget.value)
            })
          }
          defaultValue={reminder ? reminder.split('T')[0] : ''}
        ></input>

        <div>
          <button className="delete-button" onClick={handleDelete}>
            ×
          </button>
        </div>
      </div>
    </li>
  )
}
