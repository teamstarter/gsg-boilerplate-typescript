import React from 'react'

interface ReminderNotificationProps {
  name: string
  date: string
}

export default function ReminderNotification({
  name,
  date
}: ReminderNotificationProps) {
  return (
    <div className="reminder-notification-container">
      <h1 className="reminder-notification-title">Task reminder</h1>
      <div className="reminder-notification-content">
        <p>{name}</p>
        <p>{`Due ${date.split('T')[0]}`}</p>
      </div>
    </div>
  )
}
