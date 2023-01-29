import React from 'react';
import {useState, useEffect} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {IconButton, Text, useTheme} from 'react-native-paper';
import Character from '../Components/Character';
import LoadScreen from '../Components/LoadScreen';
import {getCharacters} from '../utils/db-service';
import {character} from '../utils/types';

export default function CharacterScreen() {
  const {colors} = useTheme();
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
    <View style={styles.container}>
      <View
        style={{...styles.header, backgroundColor: colors.primaryContainer}}>
        <Text style={{...styles.h1, color: colors.primary}}>Characters</Text>
        <IconButton
          icon="cog"
          size={30}
          iconColor={colors.primary}
          rippleColor={colors.secondary}
          onPress={() => console.log('Pressed')}
        />
      </View>
      <ScrollView contentContainerStyle={styles.scrollview}>
        {characters.map(c => (
          <Character key={c.key} initial={c} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 10,
    borderBottomWidth: 1,
  },
  scrollview: {
    flexGrow: 1,
  },
  h1: {
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 30,
  },
});
