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
import {SafeAreaView} from 'react-native';

// Redux
import {Provider} from 'react-redux';
import {store} from './utils/store';

// Paper
import {Provider as PaperProvider} from 'react-native-paper';
import CharacterScreen from './Screens/CharacterScreen';

// My stuff

const App = () => {
  return <CharacterScreen />;
};

const AppWrapper = () => {
  return (
    <PaperProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </PaperProvider>
  );
};

export default AppWrapper;
