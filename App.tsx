/**
 * Simple character sheet management for Glitch ttrpg
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */
import 'react-native-gesture-handler';
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import Character from './Components/Character';
import LoadScreen from './Components/LoadScreen';
import {getCharacters} from './utils/db-service';
import {character} from './utils/types';
import {createDrawerNavigator} from '@react-navigation/drawer';

function CharactersScreen() {
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
}

function DetailsScreen() {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Details Screen</Text>
    </View>
  );
}

const Drawer = createDrawerNavigator();

const App = () => {
  const scheme = useColorScheme();
  // Component
  return (
    <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Drawer.Navigator screenOptions={{unmountOnBlur: true}}>
        <Drawer.Screen name="Characters" component={CharactersScreen} />
        <Drawer.Screen name="Details" component={DetailsScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default App;
