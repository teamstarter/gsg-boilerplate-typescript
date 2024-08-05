import React, { useState } from 'react'
import './createTodoPopin.css'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { useMutation } from '@apollo/client'
import { HexColorPicker } from 'react-colorful'
import { ADD_TASK } from '../../graphql/Mutations/addTask'

export default function CreateTodoPopin({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState('')
  const [date, setDate] = useState(new Date())
  const [color, setColor] = useState('#FFFFFF')
  const [taskCreate] = useMutation(ADD_TASK)

  const handleSubmit = async () => {
    try {
      await taskCreate({
        variables: {
          task: {
            name,
            date: date,
            active: true,
            color
          }
        }
      })
      onClose()
    } catch (error) {
      console.error('Error when creating task: ', error)
    }
  }

  return (
    <div className="popin">
      <div className="content">
        <button className="close" onClick={onClose}>
          X
        </button>
        <h3 className="question">What do you want to do ?</h3>
        <input
          className="input"
          type="text"
          placeholder="Write here"
          value={name}
          onChange={e => setName(e.target.value)}
        />

        <h3 className="question">When do you need to do it ?</h3>
        <Calendar
          className="calendar"
          onChange={date => setDate(date as Date)}
          value={date}
        />

        <h3 className="question">
          What color do you want to assign to the task ?
        </h3>
        <HexColorPicker
          className="colorpicker"
          color={color}
          onChange={setColor}
        />

        <button className="button" onClick={handleSubmit}>
          Create
        </button>
      </div>
    </div>
  )
}
