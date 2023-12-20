import React, { useState } from 'react'

import Form from './components/form'
import Tasklist from './components/taskList'
import Foot from './components/foot'
import ReminderModal from './components/ReminderModal'
import './App.css'
import { reminderDateUpdaterType } from './customTypes'

function App() {
  const [status, setStatus] = useState('all')
  const [showReminderModal, setShowReminderModal] = useState<boolean>(false);
  const [reminderDate, setReminderDate] = useState<string>('')
  const [reminderDateUpdater, setReminderDateUpdater] = useState<reminderDateUpdaterType | null>(null)

  const openReminderModal = (_reminderDate: string, _reminderDateUpdater:reminderDateUpdaterType) => {
    setReminderDate(_reminderDate);
    setReminderDateUpdater(() => _reminderDateUpdater);
    setShowReminderModal(true);
  };
  const closeReminderModal = () => setShowReminderModal(false);

  return (
    <div id="hero" className="hero">
      <h1 className="title">To Do List</h1>
      <div id="todoApp" className="todo-app">
        <Form openReminderModal={openReminderModal} />
        <Tasklist status={status} openReminderModal={openReminderModal} />
        <ReminderModal show={showReminderModal} reminderDateUpdater={reminderDateUpdater} onClose={closeReminderModal} reminderDate={reminderDate} />
        <Foot select={setStatus} currentStatus={status} />
      </div>
    </div>
  )
}

export default App
