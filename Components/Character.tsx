import React, {useState} from 'react';
import {Alert, Text, TouchableOpacity, View} from 'react-native';
import {StyleSheet} from 'react-native-windows';
import {character, costs, flavor, stats} from '../utils/types';
import Table from './Table';
import LoadScreen from './LoadScreen';
import {capitalize, detectChanges, getPropFromPath} from '../utils/utils';
import {saveCharacter} from '../utils/db-service';
import {useTheme} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {getPreferences} from '../utils/store/appSlice';

const Character = ({initial}: {initial: character}) => {
  const {colors} = useTheme();
  // Load
  const [chara, setChara] = useState(initial);
  const [lastSaved, setLastSaved] = useState(initial);
  const {preferences} = useSelector(getPreferences);
  if (!chara || !preferences) {
    return <LoadScreen />;
  }

  // Save
  const onSave = () => {
    const changes = detectChanges(lastSaved, chara);
    var alertMessage = '';
    if (changes.length > 0) {
      var changeList = {}; // Object storing key/value pairs for changes (db is non-nested)
      changes.forEach(change => {
        const key = change[change.length - 1];
        changeList[key] = getPropFromPath(chara, change)[key];
        alertMessage +=
          '\n' +
          key +
          ': ' +
          getPropFromPath(lastSaved, change)[key] +
          ' => ' +
          getPropFromPath(chara, change)[key];
      });
      saveCharacter(chara.key, changeList); // Send changes to db
      setLastSaved(JSON.parse(JSON.stringify(chara))); // Deep copy / store changes in state
      Alert.alert('Save successful', alertMessage);
    } else {
      Alert.alert('No changes detected!');
    }
  };

  // Component
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={{backgroundColor: colors.border}}
        onPress={onSave}>
        <Text style={{...styles.button, color: colors.text}}>SAVE</Text>
      </TouchableOpacity>
      {/* Name */}
      <Text style={{...styles.h1, color: colors.text}}>{lastSaved.name}</Text>
      <Text style={{...styles.h2, color: colors.text}}>
        Disciplined in {lastSaved.discipline}
      </Text>

      {/* XP */}
      <View style={{alignItems: 'center', flexDirection: 'row'}}>
        <TouchableOpacity
          style={{backgroundColor: colors.border}}
          onPress={() =>
            setChara({
              ...chara,
              xp: chara.xp === 0 ? chara.xp : chara.xp - 1,
            })
          }>
          <Text style={{...styles.button, color: colors.text}}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={{padding: 5, color: colors.text}}>XP: {chara.xp}</Text>
        <TouchableOpacity
          style={{backgroundColor: colors.border}}
          onPress={() => setChara({...chara, xp: chara.xp + 1})}>
          <Text style={{...styles.button, color: colors.text}}>{'>'}</Text>
        </TouchableOpacity>
      </View>

      {preferences.flavor && (
        <View style={styles.container}>
          <Text style={{...styles.h3, color: colors.text}}>Flavor</Text>
          <Table
            priviledge={[true, false]}
            rowStyle={{flexShrink: 1}}
            data={Object.keys(chara.flavor).map(key => ({
              name: (
                <Text style={{...styles.listItem, color: colors.text}}>
                  {capitalize(key)}:
                </Text>
              ),
              value: (
                <Text style={{...styles.listItem, color: colors.text}}>
                  {chara.flavor[key as keyof flavor]}
                </Text>
              ),
            }))}
          />
        </View>
      )}

      {/* Stats */}

      {preferences.stats && (
        <View style={styles.container}>
          <Text style={{...styles.h3, color: colors.text}}>Stats</Text>
          <Table
            priviledge={[true, false]}
            data={Object.keys(chara.stats).map(key => ({
              name: (
                <Text style={{...styles.listItem, color: colors.text}}>
                  {capitalize(key)}:
                </Text>
              ),
              value: (
                <Text style={{...styles.numericListItem, color: colors.text}}>
                  {chara.stats[key as keyof stats]}
                </Text>
              ),
            }))}
            rowStyle={undefined}
          />
        </View>
      )}

      {/* Costs */}
      {preferences.costs && (
        <View style={styles.container}>
          <Text style={{...styles.h3, color: colors.text}}>Costs</Text>
          <Table
            rowStyle={{justifyContent: 'center'}}
            priviledge={[true, false]}
            data={Object.keys(chara.costs).map(key => ({
              backButton: (
                <TouchableOpacity
                  style={{backgroundColor: colors.border}}
                  onPress={() =>
                    setChara({
                      ...chara,
                      costs: {
                        ...chara.costs,
                        [key]:
                          chara.costs[key as keyof costs] === 0
                            ? chara.costs[key as keyof costs]
                            : chara.costs[key as keyof costs] - 1,
                      },
                    })
                  }>
                  <Text style={{...styles.button, color: colors.text}}>
                    {'<'}
                  </Text>
                </TouchableOpacity>
              ),
              name: (
                <Text style={{...styles.listItem, color: colors.text}}>
                  {capitalize(key)}:
                </Text>
              ),
              value: (
                <Text style={{...styles.numericListItem, color: colors.text}}>
                  {chara.costs[key as keyof costs]}
                </Text>
              ),
              forwardButton: (
                <TouchableOpacity
                  style={{backgroundColor: colors.border}}
                  onPress={() =>
                    setChara({
                      ...chara,
                      costs: {
                        ...chara.costs,
                        [key]:
                          chara.costs[key as keyof costs] === 108
                            ? chara.costs[key as keyof costs]
                            : chara.costs[key as keyof costs] + 1,
                      },
                    })
                  }>
                  <Text style={{...styles.button, color: colors.text}}>
                    {'>'}
                  </Text>
                </TouchableOpacity>
              ),
            }))}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  flavor: {},
  stats: {backgroundColor: 'red'},
  costs: {},
  h1: {
    flex: 1,
    textAlign: 'center',
    fontSize: 30,
  },
  h2: {
    flex: 1,
    textAlign: 'center',
    fontSize: 25,
  },
  h3: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
  },
  row: {
    flexDirection: 'row',
  },
  listItem: {
    padding: 5,
    textAlignVertical: 'top',
  },
  numericListItem: {
    padding: 5,
    textAlign: 'right',
  },
  modal: {
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  button: {
    paddingHorizontal: 10,
    fontSize: 20,
    textAlign: 'center',
  },
});

export default Character;
