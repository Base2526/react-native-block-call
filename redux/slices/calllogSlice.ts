// src/slices/calllogSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CallLog } from '../interface';

interface CallLogState {
  lastUpdated: string;
  callLogs: CallLog[];
}

const initialState: CallLogState = {
  lastUpdated: "",
  callLogs: []
};

const calllogSlice = createSlice({
  name: 'callLog',
  initialState,
  reducers: {
    addCallLog: (state, action: PayloadAction<CallLog>) => {
      // state.callLogs.push(action.payload);
      const newCallLog = {
        ...action.payload,
        createdAt: new Date().toISOString(), // Set createdAt to now
        updatedAt: new Date().toISOString(), // Set updatedAt to now
      };
      state.callLogs.push(newCallLog);
    },
    // New action to add multiple call logs
    addMultipleCallLogs: (state, action: PayloadAction<CallLog[]>) => {
      const newCallLogs = action.payload.map(log => ({
        ...log,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));
      state.lastUpdated = new Date().toISOString();
      state.callLogs.push(...newCallLogs); // Add multiple logs at once
    },
    updateCallLog: (state, action: PayloadAction<{ id: string; updatedData: Partial<CallLog> }>) => {
      const { id, updatedData } = action.payload;
      const index = state.callLogs.findIndex(callLog => callLog.id === id);

      if (index !== -1) {
        state.callLogs[index] = {
          ...state.callLogs[index],
          ...updatedData,
          updatedAt: new Date().toISOString(),
        };
      }
    },
    removeCallLog: (state, action: PayloadAction<string>) => {
      state.callLogs = state.callLogs.filter(log => log.id !== action.payload);
    },
    clearCallLogs: (state) => {
      state.callLogs = [];
    }
  }
});

export const { addCallLog, addMultipleCallLogs, updateCallLog, removeCallLog, clearCallLogs } = calllogSlice.actions;

export default calllogSlice.reducer;