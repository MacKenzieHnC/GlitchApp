import {Table, TD, TR} from '@mackenziehnc/table';
import React, {forwardRef, useImperativeHandle, useRef} from 'react';
import {useState, useEffect} from 'react';
import {Alert, ScrollView, View} from 'react-native';
import {Text, useTheme, Switch, Button} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import Character from '../Components/Characters/Character';
import {getPreferences, preferencesChanged} from '../utils/store/appSlice';
import {character} from '../utils/types';
import {backslash, capitalize} from '../utils/utils';
import styles from '../utils/styles';
import {getCharacters} from '../utils/fileIO';
import LoadScreen from './LoadScreen';

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

const CharacterScreen = (props: {gameDir: string}, ref: any) => {
  const {colors} = useTheme();

  const loadCharacters = async () => {
    var c = await getCharacters(true, props.gameDir);
    setCharacters(c);
  };

  // Load characters
  const [characters, setCharacters] = useState<character[]>();
  useEffect(() => {
    loadCharacters();
  });
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
          return child.save(props.gameDir);
        } else {
          return Promise.resolve();
        }
      }),
    )
      .then(() => Alert.alert('Save successful!'))
      .catch(err => Alert.alert('Save failed due to ' + err));
  };

  if (!characters) {
    return <LoadScreen />;
  }

  // Await load characters
  if (characters.length === 0) {
    return (
      <View style={{...styles.screen, backgroundColor: colors.background}}>
        <Text style={{color: colors.onBackground}}>
          Looks like you don't have any characters yet. That's okay!
        </Text>
        <Text style={{color: colors.onBackground}}>
          Either copy some .glitch-character files over to
        </Text>
        <Text style={{color: colors.onBackground}} selectable>
          {props.gameDir + backslash() + 'PCs'}
        </Text>
        <Text style={{color: colors.onBackground}}>and hit refresh</Text>
        <Text style={{color: colors.onBackground}}>
          or head on over to Character Creation to get started!
        </Text>
        <Button
          style={{backgroundColor: colors.primaryContainer}}
          onPress={loadCharacters}>
          <Text style={{color: colors.onPrimary}}>Refresh</Text>
        </Button>
      </View>
    );
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
