import React from 'react';
import {useState, useEffect} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Checkbox, IconButton, Text, useTheme, Switch} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import Character from '../Components/Character';
import LoadScreen from '../Components/LoadScreen';
import Modal from '../Components/Modal';
import Options from '../Components/Options';
import Table from '../Components/Table';
import {getCharacters} from '../utils/db-service';
import {getPreferences, preferencesChanged} from '../utils/store/appSlice';
import {character} from '../utils/types';
import {capitalize} from '../utils/utils';

export default function CharacterScreen() {
  const {colors} = useTheme();
  const [popupOpen, setPopupOpen] = useState(true);
  const dispatch = useDispatch();
  const {preferences} = useSelector(getPreferences);

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
      <Modal isOpen={popupOpen} onDismiss={() => setPopupOpen(false)}>
        <Options>
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
          <Table
            rowStyle={{justifyContent: 'center'}}
            data={Object.keys(preferences.characteristics).map(key => ({
              name: (
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
              ),
              value: <Text>{capitalize(key)}</Text>,
            }))}
          />
        </Options>
      </Modal>
      <View
        style={{...styles.header, backgroundColor: colors.primaryContainer}}>
        <Text style={{...styles.h1, color: colors.primary}}>Characters</Text>
        <IconButton
          icon="cog"
          size={30}
          iconColor={colors.primary}
          rippleColor={colors.secondary}
          onPress={() => setPopupOpen(!popupOpen)}
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
  h2: {
    textAlign: 'center',
    fontSize: 25,
  },
  switch: {
    marginRight: -7,
    marginTop: -5,
    marginBottom: 5,
  },
});
