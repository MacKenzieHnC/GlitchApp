import {createSelector, createSlice} from '@reduxjs/toolkit';
import {Appearance} from 'react-native';

const initialState = {
  status: 'idle',
  entities: {
    preferences: {
      darkMode: Appearance.getColorScheme() === 'dark',
      descriptions: true,
      characteristics: {
        discipline: true,
        xp: true,
        flavor: true,
        gifts: true,
        stats: true,
        costs: true,
        quests: true,
      },
    },
  },
};

export const appSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    preferencesChanged(state, action) {
      state.entities.preferences = action.payload;
    },
  },
});

export const getPreferences = createSelector(
  (state: any) => state.appSlice.entities,
  preferences => preferences,
);

export const {preferencesChanged} = appSlice.actions;
export default appSlice.reducer;
