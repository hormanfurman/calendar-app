import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  notes?: string;
  color: string;
}

interface CalendarState {
  events: CalendarEvent[];
}

const initialState: CalendarState = {
  events: [],
};

const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    addEvent: (state, action: PayloadAction<CalendarEvent>) => {
      state.events.push(action.payload);
    },
    updateEvent: (state, action: PayloadAction<CalendarEvent>) => {
      const index = state.events.findIndex((event) => event.id === action.payload.id);
      if (index !== -1) {
        state.events[index] = action.payload;
      }
    },
    deleteEvent: (state, action: PayloadAction<string>) => {
      state.events = state.events.filter((event) => event.id !== action.payload);
    },
  },
});

export const { addEvent, updateEvent, deleteEvent } = calendarSlice.actions;
export default calendarSlice.reducer;
