import React from 'react';
import moment from 'moment';
import { CalendarEvent } from '../../store/calendarSlice';
import styles from './EventPreview.module.scss';

interface EventPreviewProps {
  events: CalendarEvent[];
  date: Date;
  onClose: () => void;
  position: { top: number; left: number };
}

const EventPreview: React.FC<EventPreviewProps> = ({ events, date, onClose, position }) => {
  return (
    <div
      className={styles.eventPreview}
      style={
        position
          ? {
              position: 'absolute',
              top: `${position.top}px`,
              left: `${position.left}px`,
              zIndex: 1000,
            }
          : {}
      }
    >
      <div className={styles.header}>
        <h3>{moment(date).format('MMMM D, YYYY')}</h3>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
      </div>
      <ul className={styles.eventList}>
        {events.map((event) => (
          <li key={event.id} className={styles.eventItem} style={{ backgroundColor: event.color }}>
            <span className={styles.eventTime}>{moment(event.start).format('hh:mm A')}</span>
            <span className={styles.eventTitle}>{event.title}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventPreview;
