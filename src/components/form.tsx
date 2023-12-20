import React, { useState } from 'react'
import { useMutation } from '@apollo/client'
import { ADD_TASK } from '../graphql/mutations/taskMutations';
import SvgButton from './ui/SvgButton';
import { ReactComponent as ReminderIcon } from '../assets/reminderIcon.svg';
import { reminderDateModalOpenerType } from '../customTypes';

interface FormProps {
  openReminderModal: reminderDateModalOpenerType;
}

const Form : React.FC<FormProps> = ({openReminderModal}) => {
  const [name, setName] = useState('');
  const [reminderDate, setReminderDate] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);
  const [taskCreate, { loading, error }] = useMutation(ADD_TASK);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      await taskCreate({ variables: { task: { name, active: true, reminderDate } } });
      setName('');
      setReminderDate('');
    } catch (err) {
      // Handle error
    }
  };

  return (
    <form id="todoMenu1" className="todo-menu-1" onSubmit={handleSubmit}>
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
        value={name}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {setName(e.target.value)}}
        placeholder="What do you need to do?"
        aria-label="Enter to do text"
        autoFocus={false}
      />
      <SvgButton
        svgSource={<ReminderIcon />}
        onClick={()=>{openReminderModal(reminderDate,setReminderDate)}}
        className={reminderDate ? 'activated' : ''}
        tooltip={reminderDate}
      />
      <button className='menu-1-button add-todo-text-input' type="submit" disabled={loading}>Add</button>
      {error && <p>Error adding task!</p>}
    </form>
  );
}

export default Form;