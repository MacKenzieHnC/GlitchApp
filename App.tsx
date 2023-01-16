/**
 * Simple character sheet management for Glitch ttrpg
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

// React
import React, {useEffect, useState} from 'react';
import {SafeAreaView, ScrollView, View} from 'react-native';

// Redux
import {Provider} from 'react-redux';
import {store} from './utils/store';

// Paper
import {Provider as PaperProvider} from 'react-native-paper';

// My stuff
import Character from './Components/Character';
import LoadScreen from './Components/LoadScreen';
import {getCharacters} from './utils/db-service';
import {character} from './utils/types';

const App = () => {
  // Load characters
  const [characters, setCharacters] = useState<character[]>();
  useEffect(() => {
    (async () => {
      var c = await getCharacters();
      setCharacters(c);
    })();
  }, []);

  // Await load characters
  if (!characters) {
    return <LoadScreen />;
  }

  // Component
  return (
    <SafeAreaView>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View>
          {characters.map(c => (
            <Character key={c.key} initial={c} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
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
