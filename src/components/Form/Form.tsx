import React, { KeyboardEvent, useEffect, useState } from 'react'
import { gql, useMutation } from '@apollo/client'
import './Form.css'

interface PriorityProps {
  title: string
  color: string
  setTogglePriority: React.Dispatch<React.SetStateAction<boolean>>
  setPriorityColor: React.Dispatch<React.SetStateAction<string>>
}

const Priority = ({
  title,
  color,
  setTogglePriority,
  setPriorityColor
}: PriorityProps) => {
  return (
    <div
      className={'priority'}
      onClick={() => {
        setPriorityColor(color)
        setTogglePriority(false)
      }}
    >
      <div className="color-square" style={{ backgroundColor: color }}></div>
      <p className="text-content">{title}</p>
    </div>
  )
}

export default function Form() {
  const GMT = 2
  const [dateNow, setDateNow] = React.useState('')
  const [togglePriority, setTogglePriority] = useState(false)
  const [priorityColor, setPriorityColor] = useState('#2ecc71')

  /* GRAPHQL MUTATION */
  const ADD_TASK = gql`
    mutation AddTask($task: taskInput!) {
      taskCreate(task: $task) {
        id
        name
        date
      }
    }
  `
  const [taskCreate] = useMutation(ADD_TASK)

  const setDateInput = () => {
    const inputDate = document.querySelector(
      '#todoMenu1 .add-todo-datetime-input'
    )
    const actualDate = new Date()
    actualDate.setTime(Date.now() + GMT * 60 * 60 * 1000)
    const formattedDate = actualDate.toISOString().slice(0, 16)
    if (inputDate) inputDate.setAttribute('value', formattedDate)
    setDateNow(formattedDate)
  }

  useEffect(() => {
    setDateInput()
  }, [])

  const queryDate = (input: HTMLInputElement) => {
    let seconds = 0

    if (input.value) {
      const dateObject = new Date(input.value)
      const timestamp = dateObject.getTime()
      seconds = Math.floor(timestamp / 1000)
    }
    return seconds
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && /\S/.test(e.currentTarget.value)) {
      e.preventDefault()
      const inputDate = e.currentTarget.nextSibling as HTMLInputElement
      const seconds: number = queryDate(inputDate)
      if (!Number.isNaN(seconds) && seconds !== 0)
        taskCreate({
          variables: {
            task: {
              name: e.currentTarget.value,
              active: true,
              date: seconds,
              color: priorityColor
            }
          }
        })
      setDateInput()
      e.currentTarget.value = ''
    }
  }

  return (
    <div id="todoMenu1" className="todo-menu-1">
      <button
        id="toggleAll"
        className="toggle-all"
        aria-label="Toggle all to do tasks"
        style={{ transform: `rotate(${togglePriority ? 0 : -90}deg)` }}
        onClick={() => setTogglePriority(!togglePriority)}
      >
        <span className="rotate">❯</span>
      </button>
      <div
        className="select-priority"
        style={{ display: `${togglePriority ? 'block' : 'none'}` }}
      >
        <Priority
          title="Urgent"
          color="#8967d0"
          setTogglePriority={setTogglePriority}
          setPriorityColor={setPriorityColor}
        />
        <Priority
          title="High"
          color="#e74c3c"
          setTogglePriority={setTogglePriority}
          setPriorityColor={setPriorityColor}
        />
        <Priority
          title="Medium"
          color="#2ecc71"
          setTogglePriority={setTogglePriority}
          setPriorityColor={setPriorityColor}
        />
        <Priority
          title="Low"
          color="#3498db"
          setTogglePriority={setTogglePriority}
          setPriorityColor={setPriorityColor}
        />
      </div>
      <input
        id="addTodoTextInput"
        className="add-todo-text-input"
        type="text"
        placeholder="What do you need to do?"
        aria-label="Enter to do text"
        autoFocus={false}
        onKeyDown={handleKeyDown}
        style={{ color: priorityColor }}
      />
      <input
        type="datetime-local"
        className="add-todo-datetime-input"
        min={dateNow}
        max="2027-01-01T00:00"
      />
    </div>
  )
}
