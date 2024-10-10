import React, { useState, useEffect, useRef } from 'react';
import { useAppDispatch } from '../../hooks/redux';
import { addEvent, updateEvent, deleteEvent, CalendarEvent } from '../../store/calendarSlice';
import styles from './EventModal.module.scss';
import moment from 'moment';
import { ExtendedSlotInfo } from '../Calendar/Calendar';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: CalendarEvent | null;
  slotInfo: ExtendedSlotInfo | null;
  position: { top: number; left: number } | null;
}

const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, event, slotInfo, position }) => {
  const dispatch = useAppDispatch();
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [color, setColor] = useState('#4D4CAC');
  const [error, setError] = useState('');

  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && position && popupRef.current) {
      const popup = popupRef.current;
      const rect = popup.getBoundingClientRect();
      const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

      let { top, left } = position;

      if (left + rect.width > viewportWidth) {
        left = viewportWidth - rect.width - 10;
      }

      if (top + rect.height > viewportHeight) {
        top = viewportHeight - rect.height - 10;
      }

      popup.style.top = `${top}px`;
      popup.style.left = `${left}px`;
    }
  }, [isOpen, position]);

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDate(moment(event.start).format('YYYY-MM-DD'));
      setTime(moment(event.start).format('HH:mm'));
      setNotes(event.notes || '');
      setColor(event.color);
    } else if (slotInfo) {
      setTitle('');
      setDate(moment(slotInfo.start).format('YYYY-MM-DD'));
      setTime(moment(slotInfo.start).format('HH:mm'));
      setNotes('');
      setColor('#4D4CAC');
    }
    setError('');
  }, [event, slotInfo]);

  const handleSubmit = () => {
    if (title.trim().length === 0) {
      setError('Event name cannot be empty');
      return;
    }
    if (title.length > 30) {
      setError('Event name cannot exceed 30 characters');
      return;
    }

    const startDate = moment(`${date} ${time}`, 'YYYY-MM-DD HH:mm').toDate();
    const endDate = moment(startDate).add(1, 'hour').toDate();

    const eventData: CalendarEvent = {
      id: event?.id || Date.now().toString(),
      title,
      start: startDate,
      end: endDate,
      notes,
      color,
    };

    if (event) {
      dispatch(updateEvent(eventData));
    } else {
      dispatch(addEvent(eventData));
    }
    onClose();
  };

  const handleDelete = () => {
    if (event) {
      dispatch(deleteEvent(event.id));
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={popupRef}
      className={styles.eventPopup}
      style={
        position
          ? { position: 'absolute', top: `${position.top}px`, left: `${position.left}px` }
          : {}
      }
    >
      <button className={styles.closeButton} onClick={onClose}>
        ×
      </button>
      <input
        type="text"
        placeholder="Event name"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className={styles.input}
        maxLength={30}
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className={styles.input}
      />
      <input
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        className={styles.input}
      />
      <textarea
        placeholder="Notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className={styles.textarea}
      />
      <input
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
        className={styles.colorPicker}
      />
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.buttonWrapper}>
        {event ? (
          <>
            <button onClick={handleDelete} className={styles.discardButton}>
              DISCARD
            </button>
            <button onClick={handleSubmit} className={styles.editButton}>
              EDIT
            </button>
          </>
        ) : (
          <>
            <button onClick={onClose} className={styles.discardButton}>
              DISCARD
            </button>
            <button onClick={handleSubmit} className={styles.saveButton}>
              SAVE
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default EventModal;
