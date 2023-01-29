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
import {Appearance, SafeAreaView, useColorScheme} from 'react-native';

// Redux
import {Provider} from 'react-redux';
import {store} from './utils/store';

// Paper
import {
  Provider as PaperProvider,
  MD3DarkTheme,
  MD3LightTheme,
  Text,
} from 'react-native-paper';
import CharacterScreen from './Screens/CharacterScreen';

// My stuff

const App = () => {
  return <CharacterScreen />;
};

const AppWrapper = () => {
  const scheme = useColorScheme();
  return (
    <PaperProvider theme={scheme === 'dark' ? MD3DarkTheme : MD3LightTheme}>
      <Provider store={store}>
        <App />
      </Provider>
    </PaperProvider>
  );
};

export default AppWrapper;
