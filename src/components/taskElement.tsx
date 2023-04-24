import React, { ChangeEvent, MouseEvent, useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'
import { useDebouncedCallback } from 'use-debounce'

import { Task } from '../shared/custom-types'
import { TOMOROW_DATE } from '../shared/common-dates'
import { DELETE_TASK, UPDATE_TASK } from '../graphql/task/mutation'

export default function TaskElement({
  task,
  reloadList
}: {
  task: Task
  reloadList: () => void
}) {
  const [reminder, setRemind] = useState(false)

  const { id, name, active, memoDate, memoSent } = task

  useEffect(() => {
    setRemind(task.memoDate !== null)
  }, [task])

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

  async function handleMemo(value?: any) {
    if (value < TOMOROW_DATE) {
      //hack => value can be smaller than now() with input ?!
      await taskUpdate({
        variables: {
          task: {
            id,
            memoDate: value === '' ? null : TOMOROW_DATE,
            memoSent: false
          }
        }
      })
    } else {
      await taskUpdate({
        variables: {
          task: {
            id,
            memoDate: value === '' ? null : new Date(value),
            memoSent: false
          }
        }
      })
    }

    reloadList()
  }

  function addReminder(value?: any) {
    setRemind(true)
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
      {memoDate || reminder ? (
        <input
          type="date"
          className={`${!!memoSent && active && 'memo-sent'}`}
          disabled={!active}
          onChange={e => handleMemo(e.currentTarget.value)}
          min={TOMOROW_DATE}
          value={memoDate ? memoDate.substring(0, 10) : ''}
        />
      ) : (
        <button
          disabled={!active}
          className={`memo-button ${!active && 'memo-hidden'}`}
          onClick={e => addReminder()}
        >
          reminder
        </button>
      )}

      <button className="delete-button" onClick={handleDelete}>
        ×
      </button>
    </li>
  )
}
