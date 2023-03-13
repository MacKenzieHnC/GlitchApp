import {createSelector, createSlice} from '@reduxjs/toolkit';
import {WritableDraft} from 'immer/dist/internal';
import {Appearance} from 'react-native';
import RNFS from 'react-native-fs';
import {localStateDir} from '../fileIO';
import {backslash} from '../utils';

interface Game {
  name: string;
  path: string;
}

interface StateProps {
  settings: {
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
    game: undefined | Game;
  };
}

export const defaultSettings = {
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
  game: undefined,
};

const initialState: {status: string; entities: StateProps} = {
  status: 'idle',
  entities: {
    settings: defaultSettings,
  },
};

export const appSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    preferencesChanged(state, action) {
      state.entities.settings.preferences = action.payload;
      saveState(state.entities.settings);
    },
    mainDirChanged(state, action) {
      state.entities.settings.mainDir = action.payload;
      saveState(state.entities.settings);
    },
    gameChanged(state, action) {
      state.entities.settings.game = action.payload;
      saveState(state.entities.settings);
    },
  },
});

export const getPreferences = createSelector(
  (state: any) => state.appSlice.entities.settings,
  preferences => preferences,
);

export const getMainDir = createSelector(
  (state: any) => state.appSlice.entities.settings.mainDir,
  mainDir => mainDir,
);

export const getGame = createSelector(
  (state: any) => state.appSlice.entities.settings.game,
  game => game,
);

export const settingsFilePath = localStateDir + backslash() + 'settings.json';

export const saveState = async (
  settings: WritableDraft<StateProps['settings']>,
) => {
  console.log('Saving settings to ' + settingsFilePath);
  RNFS.writeFile(settingsFilePath, JSON.stringify(settings)).then(() =>
    console.log('Settings saved!'),
  );
};

export const {preferencesChanged, mainDirChanged, gameChanged} =
  appSlice.actions;
export default appSlice.reducer;
