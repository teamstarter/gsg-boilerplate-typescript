import React, { ChangeEvent, MouseEvent, useState } from 'react'
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
      }
    }
  `
  const DELETE_TASK = gql`
    mutation DeleteTask($id: Int!) {
      taskDelete(id: $id)
    }
  `

  const { id, name, active, date } = task
  const dateString = new Date(date * 1000).toLocaleString()

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
      <p>{dateString}</p>
      <button className="delete-button" onClick={handleDelete}>
        ×
      </button>
    </li>
  )
}
