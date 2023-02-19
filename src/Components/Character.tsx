import React, {useState} from 'react';
import {Alert, TouchableOpacity, View} from 'react-native';
import {StyleSheet} from 'react-native-windows';
import {character, costs, flavor, housekeeping, stats} from '../utils/types';
import LoadScreen from '../Screens/LoadScreen';
import {capitalize, detectChanges, getPropFromPath} from '../utils/utils';
import {saveCharacter} from '../utils/db-service';
import {useSelector} from 'react-redux';
import {getPreferences} from '../utils/store/appSlice';
import {Text, useTheme} from 'react-native-paper';
import Gift from './Gift';
import ActiveQuest from './ActiveQuest';
import {Table, TD, TR} from '@mackenziehnc/table';

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
        style={{backgroundColor: colors.primaryContainer}}
        onPress={onSave}>
        <Text style={{...styles.button, color: colors.primary}}>SAVE</Text>
      </TouchableOpacity>
      {/* Name */}
      <Text style={{...styles.h1, color: colors.primary}}>
        {lastSaved.name}
      </Text>
      {preferences.characteristics.discipline && (
        <View style={styles.textView}>
          <Text style={{...styles.h2, color: colors.primary}}>
            Disciplined in {lastSaved.discipline}
          </Text>
        </View>
      )}

      {/* XP */}
      {preferences.characteristics.xp && (
        <View style={{alignItems: 'center', flexDirection: 'row'}}>
          <TouchableOpacity
            style={{backgroundColor: colors.primaryContainer}}
            onPress={() =>
              setChara({
                ...chara,
                xp: chara.xp === 0 ? chara.xp : chara.xp - 1,
              })
            }>
            <Text style={{...styles.button, color: colors.primary}}>{'<'}</Text>
          </TouchableOpacity>
          <Text style={{padding: 5, color: colors.primary}}>
            XP: {chara.xp}
          </Text>
          <TouchableOpacity
            style={{backgroundColor: colors.primaryContainer}}
            onPress={() => setChara({...chara, xp: chara.xp + 1})}>
            <Text style={{...styles.button, color: colors.primary}}>{'>'}</Text>
          </TouchableOpacity>
        </View>
      )}

      {preferences.characteristics.flavor && (
        <View style={styles.innerContainer}>
          <Text style={{...styles.h2, color: colors.primary}}>Flavor</Text>
          <Table priviledgedColumns={[0]}>
            {Object.keys(chara.flavor)
              .map(key => ({
                name: capitalize(key),
                value: chara.flavor[key as keyof flavor],
              }))
              .concat(
                Object.keys(chara.housekeeping)
                  .filter(
                    x => chara.housekeeping[x as keyof housekeeping].length > 0,
                  )
                  .map(key => ({
                    name: capitalize(key),
                    value:
                      chara.housekeeping[key as keyof housekeeping].join('\n'),
                  })),
              )
              .map(row => (
                <TR>
                  <TD>
                    <Text style={{...styles.listItem, color: colors.primary}}>
                      {row.name}
                    </Text>
                  </TD>
                  <TD>
                    <Text style={{...styles.listItem, color: colors.primary}}>
                      {row.value}
                    </Text>
                  </TD>
                </TR>
              ))}
          </Table>
        </View>
      )}

      {/* Gifts */}
      {chara.gifts.length > 0 && preferences.characteristics.gifts && (
        <View style={styles.innerContainer}>
          <Text style={{...styles.h2, color: colors.primary}}>Gifts</Text>
          {chara.gifts.map((gift, index) => (
            <Gift key={index} item={gift} />
          ))}
        </View>
      )}

      <View style={styles.row}>
        {/* Stats */}
        {preferences.characteristics.stats && (
          <View style={styles.innerContainer}>
            <Text style={{...styles.h2, color: colors.primary}}>Stats</Text>
            <Table priviledgedColumns={[0]}>
              {Object.keys(chara.stats).map(key => (
                <TR>
                  <TD>
                    <Text style={{...styles.listItem, color: colors.primary}}>
                      {capitalize(key)}:
                    </Text>
                  </TD>
                  <TD>
                    <Text
                      style={{
                        ...styles.numericListItem,
                        color: colors.primary,
                      }}>
                      {chara.stats[key as keyof stats]}
                    </Text>
                  </TD>
                </TR>
              ))}
            </Table>
          </View>
        )}

        {/* Costs */}
        {preferences.characteristics.costs && (
          <View style={styles.innerContainer}>
            <Text style={{...styles.h2, color: colors.primary}}>Costs</Text>
            <Table priviledgedColumns={[0, 1, 2, 3]}>
              {Object.keys(chara.costs).map(key => (
                <TR>
                  <TD>
                    <TouchableOpacity
                      style={{backgroundColor: colors.primaryContainer}}
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
                  </TD>
                  <TD>
                    <Text style={{...styles.listItem, color: colors.primary}}>
                      {capitalize(key)}:
                    </Text>
                  </TD>
                  <TD>
                    <Text
                      style={{
                        ...styles.numericListItem,
                        color: colors.primary,
                      }}>
                      {chara.costs[key as keyof costs]}
                    </Text>
                  </TD>
                  <TD>
                    <TouchableOpacity
                      style={{backgroundColor: colors.primaryContainer}}
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
                  </TD>
                </TR>
              ))}
            </Table>
          </View>
        )}
      </View>

      {/* Quests */}
      {preferences.characteristics.quests && (
        <View style={styles.row}>
          {chara.quests.map((quest, index) => (
            <ActiveQuest key={index} item={quest} />
          ))}
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
    padding: 20,
    flexBasis: 300,
  },
  innerContainer: {
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    flex: 1,
    flexBasis: 0,
  },
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
    flexWrap: 'wrap',
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
  textView: {
    flex: 1,
  },
});

export default Character;
