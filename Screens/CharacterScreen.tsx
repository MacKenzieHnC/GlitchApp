import React from 'react';
import {useState, useEffect} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Checkbox, IconButton, Text, useTheme} from 'react-native-paper';
import {Popup} from 'react-native-windows';
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
          <Text style={styles.h2}>Characters</Text>
          <Table
            data={Object.keys(preferences).map(key => ({
              name: (
                <Checkbox
                  status={preferences[key] ? 'checked' : 'unchecked'}
                  onPress={() =>
                    dispatch(
                      preferencesChanged({
                        ...preferences,
                        [key]: !preferences[key],
                      }),
                    )
                  }
                />
              ),
              value: <Text style={styles.option}>{capitalize(key)}</Text>,
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
  option: {
    textAlign: 'center',
    textAlignVertical: 'center',
  },
});
