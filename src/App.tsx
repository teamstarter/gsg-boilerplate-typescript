import React, { useState } from 'react'

import Form from './components/Form/Form'
import Tasklist from './components/TaskList/TaskList'
import Foot from './components/Foot/Foot'
import './App.css'

function App() {
  const [status, setStatus] = useState('all')
  const [sortMode, setSortMode] = useState(true)

  return (
    <div id="hero" className="hero">
      <h1 className="title">To Do List</h1>
      <div id="todoApp" className="todo-app">
        <Form />
        <Tasklist status={status} sortMode={sortMode} />
        <Foot
          select={setStatus}
          currentStatus={status}
          sortMode={sortMode}
          setSortMode={setSortMode}
        />
      </div>
    </div>
  )
}

export default App
