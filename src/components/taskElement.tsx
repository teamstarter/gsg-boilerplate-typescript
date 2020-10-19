import React, { ChangeEvent, MouseEvent } from 'react'
import { gql, useMutation } from '@apollo/client'
import { useDebouncedCallback } from 'use-debounce'

import { Task } from '../customTypes'

export default function TaskElement({ id, name, active }: Task) {
  const UPDATE_TASK = gql`
    mutation UpdateTask($task: taskInput!) {
      taskUpdate(task: $task) {
        id
        name
      }
    }
  `
  const DELETE_TASK = gql`
    mutation DeleteTask($id: Int!) {
      taskDelete(id: $id)
    }
  `

  const [taskUpdate] = useMutation(UPDATE_TASK)

  const [taskDelete] = useMutation(DELETE_TASK)

  function handleCheck(e: ChangeEvent<HTMLInputElement>) {
    taskUpdate({
      variables: {
        task: { id: id, active: !e.currentTarget.checked },
      },
    })
  }

  function handleDelete(e: MouseEvent<HTMLButtonElement>) {
    taskDelete({
      variables: {
        id: id,
      },
    })
  }

  const { callback: debouncedHandleUpdate }: any = useDebouncedCallback(
    (value: any) => {
      taskUpdate({
        variables: {
          task: { id: id, name: value },
        },
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
        onChange={(e) => debouncedHandleUpdate(e.currentTarget.value)}
        defaultValue={name}
      ></input>
      <button className="delete-button" onClick={handleDelete}>
        ×
      </button>
    </li>
  )
}
