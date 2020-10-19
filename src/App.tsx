import React, { useState } from 'react'

import Form from './components/form'
import Tasklist from './components/taskList'
import Foot from './components/foot'
import './App.css'

function App() {
  const [status, setStatus] = useState('all')

  return (
    <div id="hero" className="hero">
      <h1 className="title">To Do List</h1>
      <div id="todoApp" className="todo-app">
        <Form />
        <Tasklist status={status} />
        <Foot select={setStatus} currentStatus={status} />
      </div>
    </div>
  )
}

export default App
