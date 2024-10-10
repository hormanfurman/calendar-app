import React, { useState, useCallback } from 'react';
import {
  Calendar as BigCalendar,
  momentLocalizer,
  View,
  SlotInfo as BaseSlotInfo,
} from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import styles from './Calendar.module.scss';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import EventModal from '../EventModal/EventModal';
import { CalendarEvent, updateEvent } from '../../store/calendarSlice';
import EventPreview from '../EventPreview/EventPreview';

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(BigCalendar);

interface DraggedEvent {
  event: CalendarEvent;
  start: Date;
  end: Date;
}

export interface ExtendedSlotInfo extends BaseSlotInfo {
  bounds?: DOMRect;
}

const Calendar: React.FC = () => {
  const [view, setView] = useState<View>('month');
  const [date, setDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<ExtendedSlotInfo | null>(null);
  const [popupPosition, setPopupPosition] = useState<{ top: number; left: number } | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewPosition, setPreviewPosition] = useState({ top: 0, left: 0 });
  const [previewDate, setPreviewDate] = useState(new Date());

  const events = useAppSelector((state) => state.calendar.events);
  const dispatch = useAppDispatch();

  const handleShowMore = useCallback((events: CalendarEvent[], date: Date) => {
    const mouseEvent = window.event as MouseEvent;
    const rect = (mouseEvent.target as HTMLElement).getBoundingClientRect();
    setPreviewPosition({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX,
    });
    setPreviewDate(date);
    setShowPreview(true);
  }, []);

  const calculatePopupPosition = useCallback((elementRect: DOMRect) => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    return {
      top: elementRect.bottom + scrollTop,
      left: elementRect.left + scrollLeft,
    };
  }, []);

  const handleSelectSlot = useCallback(
    (slotInfo: ExtendedSlotInfo) => {
      setSelectedSlot(slotInfo);
      setSelectedEvent(null);

      const calendarElement = document.querySelector('.rbc-calendar') as HTMLElement;
      if (calendarElement && slotInfo.bounds) {
        setPopupPosition(calculatePopupPosition(slotInfo.bounds));
      } else {
        setPopupPosition({ top: 100, left: 100 });
      }
      setIsModalOpen(true);
    },
    [calculatePopupPosition]
  );

  const handleSelectEvent = useCallback(
    (event: CalendarEvent, e: React.SyntheticEvent<HTMLElement>) => {
      setSelectedEvent(event);
      setSelectedSlot(null);

      const targetElement = e.target as HTMLElement;
      setPopupPosition(calculatePopupPosition(targetElement.getBoundingClientRect()));
      setIsModalOpen(true);
    },
    [calculatePopupPosition]
  );

  const moveEvent = useCallback(
    ({ event, start, end }: DraggedEvent) => {
      const newEnd = new Date(start.getTime() + (event.end.getTime() - event.start.getTime()));
      dispatch(updateEvent({ ...event, start, end: newEnd }));
    },
    [dispatch]
  );

  const CustomToolbar: React.FC<any> = (toolbar) => (
    <div className={styles.customToolbar}>
      <div className={styles.navigationButtons}>
        <button onClick={() => toolbar.onNavigate('TODAY')}>Today</button>
        <button onClick={() => toolbar.onNavigate('PREV')}>Back</button>
        <button onClick={() => toolbar.onNavigate('NEXT')}>Next</button>
      </div>
      <span className={styles.currentDate}>{toolbar.label}</span>
      <div className={styles.viewButtons}>
        <button className={view === 'month' ? styles.active : ''} onClick={() => setView('month')}>
          Month
        </button>
        <button className={view === 'week' ? styles.active : ''} onClick={() => setView('week')}>
          Week
        </button>
        <button className={view === 'day' ? styles.active : ''} onClick={() => setView('day')}>
          Day
        </button>
        <button
          className={view === 'agenda' ? styles.active : ''}
          onClick={() => setView('agenda')}
        >
          Agenda
        </button>
      </div>
    </div>
  );

  const eventPropGetter = useCallback((event: CalendarEvent) => {
    return {
      style: {
        backgroundColor: event.color,
      },
    };
  }, []);

  const dayPropGetter = useCallback((date: Date) => {
    return {
      style: {
        height: '135px',
      },
    };
  }, []);
  return (
    <div className={styles.calendarWrapper}>
      <h1>Calendar</h1>
      <div className={styles.calendarContainer}>
        {/* @ts-ignore */}
        <DnDCalendar<CalendarEvent, object>
          localizer={localizer}
          events={events}
          view={view}
          onView={setView}
          date={date}
          onNavigate={setDate}
          selectable
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          onEventDrop={moveEvent}
          resizable={false}
          eventPropGetter={eventPropGetter}
          dayPropGetter={dayPropGetter}
          components={{
            toolbar: CustomToolbar,
          }}
          popup
          showMultiDayTimes
          onShowMore={handleShowMore}
          style={{ flex: 1 }}
          min={new Date(0, 0, 0, 0, 0, 0)}
          max={new Date(0, 0, 0, 23, 59, 59)}
          step={60}
          timeslots={1}
        />
        {showPreview && (
          <EventPreview
            events={events.filter((event) => moment(event.start).isSame(previewDate, 'day'))}
            date={previewDate}
            onClose={() => setShowPreview(false)}
            position={previewPosition}
          />
        )}
      </div>
      <EventModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setPopupPosition(null);
        }}
        event={selectedEvent}
        slotInfo={selectedSlot}
        position={popupPosition}
      />
    </div>
  );
};

export default Calendar;
