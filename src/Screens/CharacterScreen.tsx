import {Table, TD, TR} from '@mackenziehnc/table';
import React, {forwardRef, useImperativeHandle, useRef} from 'react';
import {useState, useEffect} from 'react';
import {Alert, ScrollView, View} from 'react-native';
import {Text, useTheme, Switch} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import Character from '../Components/Characters/Character';
import LoadScreen from './LoadScreen';
import {getPreferences, preferencesChanged} from '../utils/store/appSlice';
import {character} from '../utils/types';
import {capitalize} from '../utils/utils';
import styles from '../utils/styles';
import {getCharacters} from '../utils/fileIO';

export const CharacterOptions = () => {
  const {preferences} = useSelector(getPreferences);
  const dispatch = useDispatch();

  return (
    <View>
      <Text style={styles.h2}>General</Text>
      <View style={styles.row}>
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
          <TR key={key}>
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

const CharacterScreen = (_props: any, ref: any) => {
  const {colors} = useTheme();

  // Load characters
  const [characters, setCharacters] = useState<character[]>();
  useEffect(() => {
    (async () => {
      var c = await getCharacters(true);
      setCharacters(c);
    })();
  }, []);
  const childRef = useRef<any>([]);

  useEffect(() => {
    if (characters) {
      childRef.current = childRef.current.slice(0, characters.length);
    }
  }, [characters]);

  useImperativeHandle(ref, () => ({
    hasUnsavedChanges: () => {
      let changes: any = [];
      childRef.current.forEach((child: any) => {
        const change = child.hasUnsavedChanges();
        if (change) {
          changes.push(change);
        }
      });
      if (changes.length > 0) {
        return <View>{changes}</View>;
      } else {
        return null;
      }
    },
    save: () => {
      save();
    },
  }));

  const save = async () => {
    Promise.all(
      childRef.current.map((child: any) => {
        if (child.hasUnsavedChanges()) {
          return child.save();
        } else {
          return Promise.resolve();
        }
      }),
    )
      .then(() => Alert.alert('Save successful!'))
      .catch(err => Alert.alert('Save failed due to ' + err));
  };

  // Await load characters
  if (!characters) {
    return <LoadScreen />;
  }

  // Component
  return (
    <View style={{...styles.screen, backgroundColor: colors.background}}>
      <ScrollView contentContainerStyle={styles.scrollview}>
        {characters.map((c, index) => (
          <Character
            key={c.key}
            initial={c}
            ref={el => (childRef.current[index] = el)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default forwardRef(CharacterScreen);
