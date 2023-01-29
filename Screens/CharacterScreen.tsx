import React from 'react';
import {useState, useEffect} from 'react';
import {ScrollView, View} from 'react-native';
import Character from '../Components/Character';
import LoadScreen from '../Components/LoadScreen';
import {getCharacters} from '../utils/db-service';
import {character} from '../utils/types';

export default function CharacterScreen() {
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
    <ScrollView>
      <View>
        {characters.map(c => (
          <Character key={c.key} initial={c} />
        ))}
      </View>
    </ScrollView>
  );
}
