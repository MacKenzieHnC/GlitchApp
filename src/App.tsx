/**
 * Simple character sheet management for Glitch ttrpg
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

// React
import React, {useEffect} from 'react';

// Redux
import {Provider, useDispatch, useSelector} from 'react-redux';
import {store} from './utils/store';

// Paper
import {
  Provider as PaperProvider,
  MD3DarkTheme,
  MD3LightTheme,
} from 'react-native-paper';
import {
  defaultSettings,
  gameChanged,
  getMainDir,
  getPreferences,
  mainDirChanged,
  preferencesChanged,
  settingsFilePath,
} from './utils/store/appSlice';
import Drawer from './Screens/Navigator';
import RNFS from 'react-native-fs';

// My stuff

const App = () => {
  const {preferences} = useSelector(getPreferences);
  const mainDir = useSelector(getMainDir);
  const dispatch = useDispatch();
  useEffect(() => {
    // Load settings
    RNFS.exists(settingsFilePath)
      .then(exists => {
        if (exists) {
          return RNFS.readFile(settingsFilePath)
            .then(file => JSON.parse(file))
            .then(state => {
              console.log(state);
              Promise.all([
                dispatch(mainDirChanged(state.mainDir)),
                dispatch(preferencesChanged(state.preferences)),
                dispatch(gameChanged(state.game)),
              ]);
            });
        } else {
          return RNFS.writeFile(
            settingsFilePath,
            JSON.stringify(defaultSettings),
          );
        }
      })
      .then(() => RNFS.readDir(mainDir));
  }, [dispatch, mainDir]);
  return (
    <PaperProvider theme={preferences.darkMode ? MD3DarkTheme : MD3LightTheme}>
      <Drawer />
    </PaperProvider>
  );
};

const AppWrapper = () => {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};

export default AppWrapper;
