import React, { KeyboardEvent } from 'react'
import { useMutation } from '@apollo/client'
import { ADD_TASK } from '../graphql/task/mutation'

export default function Form() {
  const [taskCreate] = useMutation(ADD_TASK)

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && /\S/.test(e.currentTarget.value)) {
      e.preventDefault()
      taskCreate({
        variables: { task: { name: e.currentTarget.value, active: true } }
      })
      e.currentTarget.value = ''
    }
  }

  return (
    <div id="todoMenu1" className="todo-menu-1">
      <button
        id="toggleAll"
        className="toggle-all"
        aria-label="Toggle all to do tasks"
      >
        <span className="rotate">❯</span>
      </button>
      <input
        id="addTodoTextInput"
        className="add-todo-text-input"
        type="text"
        placeholder="What do you need to do?"
        aria-label="Enter to do text"
        autoFocus={false}
        onKeyDown={handleKeyDown}
      />
    </div>
  )
}
