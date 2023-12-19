import React, { useState } from 'react'
import { Task } from '../customTypes'

export default function ReminderNotification({ task }: { task: Task }) {
  const [isActive, setIsActive] = useState(task.active)

  return (
    <>
      {isActive && (
        <div className="reminder-notification-container">
          <div className="reminder-notification-header">
            <h1 className="reminder-notification-title">Task reminder</h1>
            <button
              className="reminder-notification-delete-button"
              onClick={() => setIsActive(false)}
            >
              ×
            </button>
          </div>
          <div className="reminder-notification-content">
            <p>{task.name}</p>
            <p>{`Due ${task.date.split('T')[0]}`}</p>
          </div>
        </div>
      )}
    </>
  )
}
