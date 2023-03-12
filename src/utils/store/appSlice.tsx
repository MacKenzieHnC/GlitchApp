import {createSelector, createSlice} from '@reduxjs/toolkit';
import {WritableDraft} from 'immer/dist/internal';
import {Appearance} from 'react-native';
import RNFS from 'react-native-fs';
import {localStateDir} from '../fileIO';
import {backslash} from '../utils';

interface StateProps {
  preferences: {
    darkMode: boolean;
    descriptions: boolean;
    characteristics: {
      discipline: boolean;
      xp: boolean;
      flavor: boolean;
      gifts: boolean;
      stats: boolean;
      costs: boolean;
      quests: boolean;
    };
  };
  mainDir: string | undefined;
}

const initialState: {status: string; entities: StateProps} = {
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
    mainDir: undefined,
  },
};

export const appSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    preferencesChanged(state, action) {
      state.entities.preferences = action.payload;
      saveState(state.entities);
    },
    mainDirChanged(state, action) {
      state.entities.mainDir = action.payload;
      saveState(state.entities);
    },
  },
});

export const getPreferences = createSelector(
  (state: any) => state.appSlice.entities,
  preferences => preferences,
);

export const settingsFilePath = localStateDir + backslash() + 'settings.json';

export const saveState = async (entities: WritableDraft<StateProps>) => {
  console.log('Saving settings to ' + settingsFilePath);
  RNFS.writeFile(settingsFilePath, JSON.stringify(entities)).then(() =>
    console.log('Settings saved!'),
  );
};

export const {preferencesChanged, mainDirChanged} = appSlice.actions;
export default appSlice.reducer;
