import {Table, TD, TR} from '@mackenziehnc/table';
import React from 'react';
import {useState, useEffect} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {IconButton, Text, useTheme, Switch} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import Character from '../Components/Character';
import LoadScreen from './LoadScreen';
import Modal from '../Components/Modal';
import Options from '../Components/Options';
import {getCharacters} from '../utils/db-service';
import {getPreferences, preferencesChanged} from '../utils/store/appSlice';
import {character} from '../utils/types';
import {capitalize} from '../utils/utils';

export const CharacterOptions = () => {
  const {preferences} = useSelector(getPreferences);
  const dispatch = useDispatch();
  return (
    <View>
      <Text style={styles.h2}>General</Text>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Switch
          value={preferences.descriptions}
          style={styles.switch}
          onValueChange={() => {
            dispatch(
              preferencesChanged({
                ...preferences,
                descriptions: !preferences.descriptions,
              }),
            );
            return;
          }}
        />
        <Text>Descriptions</Text>
      </View>
      <Text style={styles.h2}>Characteristics</Text>
      <Table>
        {Object.keys(preferences.characteristics).map(key => (
          <TR>
            <TD>
              <Switch
                style={styles.switch}
                value={preferences.characteristics[key]}
                onValueChange={() => {
                  dispatch(
                    preferencesChanged({
                      ...preferences,
                      characteristics: {
                        ...preferences.characteristics,
                        [key]: !preferences.characteristics[key],
                      },
                    }),
                  );
                  return;
                }}
              />
            </TD>
            <TD>
              <Text>{capitalize(key)}</Text>
            </TD>
          </TR>
        ))}
      </Table>
    </View>
  );
};

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
    <View style={{...styles.container, backgroundColor: colors.background}}>
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
  scrollview: {
    flexGrow: 1,
  },
});
