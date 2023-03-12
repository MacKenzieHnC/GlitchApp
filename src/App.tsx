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
  getPreferences,
  mainDirChanged,
  preferencesChanged,
  settingsFilePath,
} from './utils/store/appSlice';
import Drawer from './Screens/Navigator';
import RNFS from 'react-native-fs';
import {Alert} from 'react-native';

// My stuff

const App = () => {
  const {preferences} = useSelector(getPreferences);
  const dispatch = useDispatch();
  useEffect(() => {
    RNFS.readFile(settingsFilePath)
      .then(file => JSON.parse(file))
      .then(state => {
        console.log(state);
        dispatch(mainDirChanged(state.mainDir));
        dispatch(preferencesChanged(state.preferences));
      })
      .catch(err => Alert.alert('Load preferences failed:\n' + err));
  }, [dispatch]);
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
