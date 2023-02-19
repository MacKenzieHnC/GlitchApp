/**
 * Simple character sheet management for Glitch ttrpg
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

// React
import React from 'react';

// Redux
import {Provider, useSelector} from 'react-redux';
import {store} from './utils/store';

// Paper
import {
  Provider as PaperProvider,
  MD3DarkTheme,
  MD3LightTheme,
} from 'react-native-paper';
import CharacterScreen from './Screens/CharacterScreen';
import {getPreferences} from './utils/store/appSlice';

// My stuff

const App = () => {
  const {preferences} = useSelector(getPreferences);
  return (
    <PaperProvider theme={preferences.darkMode ? MD3DarkTheme : MD3LightTheme}>
      <CharacterScreen />
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
