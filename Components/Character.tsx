import React, {useState} from 'react';
import {Alert, Text, TouchableOpacity, View} from 'react-native';
import {StyleSheet} from 'react-native-windows';
import {character, costs, flavor, housekeeping, stats} from '../utils/types';
import Table from './Table';
import LoadScreen from './LoadScreen';
import {capitalize, detectChanges, getPropFromPath} from '../utils/utils';
import {saveCharacter} from '../utils/db-service';
import {useSelector} from 'react-redux';
import {getPreferences} from '../utils/store/appSlice';
import {useTheme} from 'react-native-paper';
import Gift from './Gift';
import ActiveQuest from './ActiveQuest';

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

  const flavorData = Object.keys(chara.flavor)
    .map(key => ({
      name: (
        <Text style={{...styles.listItem, color: colors.primary}}>
          {capitalize(key)}:
        </Text>
      ),
      value: (
        <Text style={{...styles.listItem, color: colors.primary}}>
          {chara.flavor[key as keyof flavor]}
        </Text>
      ),
    }))
    .concat(
      Object.keys(chara.housekeeping)
        .filter(x => chara.housekeeping[x as keyof housekeeping].length > 0)
        .map(key => ({
          name: (
            <Text style={{...styles.listItem, color: colors.primary}}>
              {capitalize(key)}:
            </Text>
          ),
          value: (
            <Text style={{...styles.listItem, color: colors.primary}}>
              {chara.housekeeping[key as keyof housekeeping].join('\n')}
            </Text>
          ),
        })),
    );

  // Component
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={{backgroundColor: colors.outline}}
        onPress={onSave}>
        <Text style={{...styles.button, color: colors.primary}}>SAVE</Text>
      </TouchableOpacity>
      {/* Name */}
      <Text style={{...styles.h1, color: colors.primary}}>
        {lastSaved.name}
      </Text>
      <Text style={{...styles.h2, color: colors.primary}}>
        Disciplined in {lastSaved.discipline}
      </Text>

      {/* XP */}
      <View style={{alignItems: 'center', flexDirection: 'row'}}>
        <TouchableOpacity
          style={{backgroundColor: colors.outline}}
          onPress={() =>
            setChara({
              ...chara,
              xp: chara.xp === 0 ? chara.xp : chara.xp - 1,
            })
          }>
          <Text style={{...styles.button, color: colors.primary}}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={{padding: 5, color: colors.primary}}>XP: {chara.xp}</Text>
        <TouchableOpacity
          style={{backgroundColor: colors.outline}}
          onPress={() => setChara({...chara, xp: chara.xp + 1})}>
          <Text style={{...styles.button, color: colors.primary}}>{'>'}</Text>
        </TouchableOpacity>
      </View>

      {preferences.flavor && (
        <View style={styles.container}>
          <Text style={{...styles.h3, color: colors.primary}}>Flavor</Text>
          <Table
            priviledge={[true, false]}
            rowStyle={{flexShrink: 1}}
            data={flavorData}
          />
        </View>
      )}

      {/* Gifts */}
      {chara.gifts.length > 0 && (
        <View style={styles.container}>
          <Text style={{...styles.h3, color: colors.primary}}>Gifts</Text>
          {chara.gifts.map(gift => (
            <Gift item={gift} />
          ))}
        </View>
      )}

      {/* Stats */}
      {preferences.stats && (
        <View style={styles.container}>
          <Text style={{...styles.h3, color: colors.primary}}>Stats</Text>
          <Table
            priviledge={[true, false]}
            data={Object.keys(chara.stats).map(key => ({
              name: (
                <Text style={{...styles.listItem, color: colors.primary}}>
                  {capitalize(key)}:
                </Text>
              ),
              value: (
                <Text
                  style={{...styles.numericListItem, color: colors.primary}}>
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
          <Text style={{...styles.h3, color: colors.primary}}>Costs</Text>
          <Table
            rowStyle={{justifyContent: 'center'}}
            priviledge={[true, false]}
            data={Object.keys(chara.costs).map(key => ({
              backButton: (
                <TouchableOpacity
                  style={{backgroundColor: colors.outline}}
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
                  <Text style={{...styles.button, color: colors.primary}}>
                    {'<'}
                  </Text>
                </TouchableOpacity>
              ),
              name: (
                <Text style={{...styles.listItem, color: colors.primary}}>
                  {capitalize(key)}:
                </Text>
              ),
              value: (
                <Text
                  style={{...styles.numericListItem, color: colors.primary}}>
                  {chara.costs[key as keyof costs]}
                </Text>
              ),
              forwardButton: (
                <TouchableOpacity
                  style={{backgroundColor: colors.outline}}
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
                  <Text style={{...styles.button, color: colors.primary}}>
                    {'>'}
                  </Text>
                </TouchableOpacity>
              ),
            }))}
          />
        </View>
      )}

      {/* Quests */}
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
        }}>
        {chara.quests.map(quest => (
          <ActiveQuest item={quest} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    padding: 20,
    flex: 1,
    flexBasis: 300,
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
