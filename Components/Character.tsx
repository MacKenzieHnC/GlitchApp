import React, {useState} from 'react';
import {Alert, Button, Text, View} from 'react-native';
import {StyleSheet} from 'react-native-windows';
import {character, costs, flavor, stats} from '../utils/types';
import Table from './Table';
import LoadScreen from './LoadScreen';
import {capitalize, detectChanges, getPropFromPath} from '../utils/utils';
import {saveCharacter} from '../utils/db-service';

const Character = ({initial}: {initial: character}) => {
  // Load
  const [chara, setChara] = useState(initial);
  const [lastSaved, setLastSaved] = useState(initial);
  if (!chara) {
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
      <Button title={'Save'} onPress={onSave} />
      {/* Name */}
      <Text style={styles.h1}>{lastSaved.name}</Text>
      <Text style={styles.h2}>Disciplined in {lastSaved.discipline}</Text>

      {/* XP */}
      <View style={{alignItems: 'center', flexDirection: 'row'}}>
        <Button
          title={'<'}
          onPress={() =>
            setChara({
              ...chara,
              xp: chara.xp === 0 ? chara.xp : chara.xp - 1,
            })
          }
        />
        <Text style={{padding: 5}}>XP: {chara.xp}</Text>
        <Button
          title={'>'}
          onPress={() => setChara({...chara, xp: chara.xp + 1})}
        />
      </View>
      <Text style={styles.h3}>Flavor</Text>
      <Table
        priviledge={[true, false]}
        rowStyle={{flexShrink: 1}}
        data={Object.keys(chara.flavor).map(key => ({
          name: <Text style={styles.listItem}>{capitalize(key)}:</Text>,
          value: (
            <Text style={styles.listItem}>
              {chara.flavor[key as keyof flavor]}
            </Text>
          ),
        }))}
      />

      {/* Stats */}
      <Text style={styles.h3}>Stats</Text>
      <Table
        priviledge={[true, false]}
        data={Object.keys(chara.stats).map(key => ({
          name: <Text style={styles.listItem}>{capitalize(key)}:</Text>,
          value: (
            <Text style={styles.numericListItem}>
              {chara.stats[key as keyof stats]}
            </Text>
          ),
        }))}
        rowStyle={undefined}
      />

      {/* Costs */}
      <Text style={styles.h3}>Costs</Text>
      <Table
        rowStyle={undefined}
        priviledge={[true, false]}
        data={Object.keys(chara.costs).map(key => ({
          backButton: (
            <Button
              title={'<'}
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
              }
            />
          ),
          name: <Text style={styles.listItem}>{capitalize(key)}:</Text>,
          value: (
            <Text style={styles.numericListItem}>
              {chara.costs[key as keyof costs]}
            </Text>
          ),
          forwardButton: (
            <Button
              title={'>'}
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
              }
            />
          ),
        }))}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
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
});

export default Character;
