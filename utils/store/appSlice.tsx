import {createSelector, createSlice} from '@reduxjs/toolkit';

const initialState = {
  status: 'idle',
  entities: {preferences: {flavor: true, stats: true, costs: true}},
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
