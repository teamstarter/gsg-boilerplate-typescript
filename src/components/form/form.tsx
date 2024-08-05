import React, { useState } from 'react'
import CreateTodoPopin from '../createTodoPopin/createTodoPopin'
import './form.css'

export default function Form() {
  const [showPopin, setShowPopin] = useState(false)

  const onClick = () => setShowPopin(true)
  const onClose = () => setShowPopin(false)

  return (
    <div id="todoMenu1" className="todo-menu-1">
      <button
        id="toggleAll"
        className="toggle-all"
        aria-label="Toggle all to do tasks"
      >
        <span className="rotate">❯</span>
      </button>
      <button className="createButton" onClick={onClick}>
        Create a TODO
      </button>
      {showPopin && <CreateTodoPopin onClose={onClose} />}
    </div>
  )
}
