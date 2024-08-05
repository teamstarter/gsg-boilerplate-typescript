import React, { ChangeEvent, MouseEvent } from 'react'
import { useMutation } from '@apollo/client'
import { useDebouncedCallback } from 'use-debounce'
import { UPDATE_TASK } from '../../graphql/Mutations/updateTask'
import { DELETE_TASK } from '../../graphql/Mutations/deleteTask'

import './taskElement.css'
import { Task } from '../../customTypes'

export default function TaskElement({
  task,
  reloadList
}: {
  task: Task
  reloadList: () => void
}) {
  const { id, name, active, date, color } = task

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
    <li className="todo" style={{ background: color }}>
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
      <div className="todo-content">
        <input
          className={`todo-text ${!active && 'todo-checked-text'}`}
          onChange={e => debouncedHandleUpdate(e.currentTarget.value)}
          defaultValue={name}
        ></input>
        <div className="todo-date">{new Date(date).toLocaleDateString()}</div>
      </div>
      <button className="delete-button" onClick={handleDelete}>
        ×
      </button>
    </li>
  )
}
