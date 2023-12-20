import React, { ReactNode, useState } from 'react';
import moment from 'moment';
import { reminderDateUpdaterType } from '../customTypes';

interface ModalProps {
  show: boolean;
  onClose: () => void;
  reminderDate: string;
  reminderDateUpdater: reminderDateUpdaterType | null;
}

const ReminderModal: React.FC<ModalProps> = ({ show, onClose, reminderDate, reminderDateUpdater }) => {
  const [newDate, setNewDate] = useState<string>('');

  const today = moment().startOf('day');

  const dateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.blur();
    const date = e.target.value;
    if (!date) {setNewDate(''); return;}

    const formattedDate = moment(date).format('YYYY-MM-DD');
    setNewDate(formattedDate);
  }

  const stopPropagation = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
  };

  const removeDate = () => {
    if (reminderDateUpdater) reminderDateUpdater('');
    onClose();
  };

  const handleClose = () => {
    setNewDate('');
    onClose();
  }

  if (!show) {
    return null;
  }

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <div className="modal" onClick={stopPropagation}>
        <span className="close" onClick={handleClose}>&times;</span>
        <label htmlFor="reminderDate" className="reminder-label">Reminder Date</label>
        <input
          type='date'
          id="reminderDate"
          defaultValue={reminderDate}
          min={today.format('YYYY-MM-DD')}
          onChange={dateChange}
        />
        <button
          onClick={() => {if (reminderDateUpdater) reminderDateUpdater(newDate); handleClose()}}
          disabled={newDate === '' || newDate === reminderDate || moment(newDate, 'YYYY-MM-DD').toDate() < today.toDate()}
        >
          Submit
        </button>
        {reminderDate && <button
          onClick={removeDate}
          className={"remove-button"}
        >
          Remove
        </button>}
      </div>
    </div>
  );
};

export default ReminderModal;
