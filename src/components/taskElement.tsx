import React, { ChangeEvent, MouseEvent } from 'react'
import { useMutation } from '@apollo/client'
import { useDebouncedCallback } from 'use-debounce'

import { Task, reminderDateModalOpenerType } from '../customTypes'
import SvgButton from './ui/SvgButton'
import {ReactComponent as ReminderIcon} from '../assets/reminderIcon.svg'
import { UPDATE_TASK, DELETE_TASK } from '../graphql/mutations/taskMutations'

export default function TaskElement({
  task,
  reloadList,
  openReminderModal
}: {
  task: Task
  reloadList: () => void
  openReminderModal: reminderDateModalOpenerType
}) {
  const [taskUpdate] = useMutation(UPDATE_TASK)
  const [taskDelete] = useMutation(DELETE_TASK)
  const { id, name, active, reminderDate } = task

  async function handleCheck(e: ChangeEvent<HTMLInputElement>) {
    await taskUpdate({
      variables: {
        task: { id: id, active: !e.currentTarget.checked },
      },
    })
    reloadList()
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

  function updateReminderDate(newDate: string) {
    taskUpdate({
      variables: {
        task: { id: id, reminderDate: newDate },
      },
    })
  }

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
      <SvgButton
        svgSource={<ReminderIcon />}
        onClick={() => {openReminderModal(reminderDate,updateReminderDate);}}
        className={reminderDate ? 'activated' : ''}
        disabled={!active}
        tooltip={reminderDate}
      />
      <button className="delete-button" onClick={handleDelete}>
        ×
      </button>
    </li>
  )
}
