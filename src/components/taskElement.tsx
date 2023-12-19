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
        date
      }
    }
  `
  const DELETE_TASK = gql`
    mutation DeleteTask($id: Int!) {
      taskDelete(id: $id)
    }
  `

  const { id, name, active, date } = task

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

  const { callback: debouncedHandleUpdateForName }: any = useDebouncedCallback(
    (value: any) => {
      taskUpdate({
        variables: {
          task: { id: id, name: value }
        }
      })
    },
    1000
  )

  const { callback: debouncedHandleUpdateForDate }: any = useDebouncedCallback(
    (value: any) => {
      taskUpdate({
        variables: {
          task: { id: id, date: new Date(value) }
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
        onChange={e => debouncedHandleUpdateForName(e.currentTarget.value)}
        defaultValue={name}
      ></input>
      <input
        className={`todo-text ${!active && 'todo-checked-text'}`}
        type="date"
        onChange={e => debouncedHandleUpdateForDate(e.currentTarget.value)}
        defaultValue={date?.split('T')[0]}
      ></input>
      <button className="delete-button" onClick={handleDelete}>
        ×
      </button>
    </li>
  )
}
