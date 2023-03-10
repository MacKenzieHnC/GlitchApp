import React, {forwardRef, useImperativeHandle, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {character, costs, flavor, housekeeping, stats} from '../../utils/types';
import LoadScreen from '../../Screens/LoadScreen';
import {capitalize, detectChanges, getPropFromPath} from '../../utils/utils';
import {useSelector} from 'react-redux';
import {getPreferences} from '../../utils/store/appSlice';
import {Text, useTheme} from 'react-native-paper';
import Gift from '../Gift';
import ActiveQuest from '../ActiveQuest';
import {Table, TD, TR} from '@mackenziehnc/table';
import styles from '../../utils/styles';
import CharacterChanges from './CharacterChanges';
import {saveCharacter} from '../../utils/fileIO';

const Character = ({initial}: {initial: character}, ref: any) => {
  const {colors} = useTheme();
  // Load
  const [chara, setChara] = useState(initial);
  const [lastSaved, setLastSaved] = useState(initial);
  const {preferences} = useSelector(getPreferences);

  useImperativeHandle(ref, () => ({
    hasUnsavedChanges: () => {
      return CharacterChanges({initial: lastSaved, current: chara});
    },
    save: (dir: string) => {
      const changes: any = {};
      detectChanges(lastSaved, chara).forEach(change => {
        const key = change[change.length - 1];
        changes[key] = getPropFromPath(chara, change);
      });
      if (Object.keys(changes).length > 0) {
        return saveCharacter(chara, dir).then(() => {
          setLastSaved(chara);
        });
      } else {
        return Promise.resolve();
      }
    },
  }));

  if (!chara || !preferences) {
    return <LoadScreen />;
  }

  // Component
  return (
    <View style={styles.container}>
      {/* Name */}
      <Text style={{...styles.h1, color: colors.onBackground}}>
        {lastSaved.name}
      </Text>
      {preferences.characteristics.discipline && (
        <View style={styles.textView}>
          <Text style={{...styles.h2, color: colors.onBackground}}>
            Disciplined in {lastSaved.discipline}
          </Text>
        </View>
      )}

      {/* XP */}
      {preferences.characteristics.xp && (
        <View style={styles.row}>
          <TouchableOpacity
            style={{backgroundColor: colors.primaryContainer}}
            onPress={() =>
              setChara({
                ...chara,
                xp: chara.xp === 0 ? chara.xp : chara.xp - 1,
              })
            }>
            <Text style={{...styles.button, color: colors.onBackground}}>
              {'<'}
            </Text>
          </TouchableOpacity>
          <Text style={{color: colors.onBackground}}>XP: {chara.xp}</Text>
          <TouchableOpacity
            style={{backgroundColor: colors.primaryContainer}}
            onPress={() => setChara({...chara, xp: chara.xp + 1})}>
            <Text style={{...styles.button, color: colors.onBackground}}>
              {'>'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {preferences.characteristics.flavor && (
        <View style={styles.innerContainer}>
          <Text style={{...styles.h2, color: colors.onBackground}}>Flavor</Text>
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
                <TR key={row.name}>
                  <TD>
                    <Text
                      style={{
                        ...styles.listItem,
                        color: colors.onBackground,
                      }}>
                      {row.name}
                    </Text>
                  </TD>
                  <TD>
                    <Text
                      style={{
                        ...styles.listItem,
                        color: colors.onBackground,
                      }}>
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
          <Text style={{...styles.h2, color: colors.onBackground}}>Gifts</Text>
          {chara.gifts.map((gift, index) => (
            <Gift key={index} item={gift} />
          ))}
        </View>
      )}

      <View style={styles.row}>
        {/* Stats */}
        {preferences.characteristics.stats && (
          <View style={styles.innerContainer}>
            <Text style={{...styles.h2, color: colors.onBackground}}>
              Stats
            </Text>
            <Table priviledgedColumns={[0]}>
              {Object.keys(chara.stats).map(key => (
                <TR key={key}>
                  <TD>
                    <Text
                      style={{
                        ...styles.listItem,
                        color: colors.onBackground,
                      }}>
                      {capitalize(key)}:
                    </Text>
                  </TD>
                  <TD>
                    <Text
                      style={{
                        ...styles.numericListItem,
                        color: colors.onBackground,
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
            <Text style={{...styles.h2, color: colors.onBackground}}>
              Costs
            </Text>
            <Table priviledgedColumns={[0, 1, 2, 3]}>
              {Object.keys(chara.costs).map(key => (
                <TR key={key}>
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
                      <Text
                        style={{
                          ...styles.button,
                          color: colors.onBackground,
                        }}>
                        {'<'}
                      </Text>
                    </TouchableOpacity>
                  </TD>
                  <TD>
                    <Text
                      style={{
                        ...styles.listItem,
                        color: colors.onBackground,
                      }}>
                      {capitalize(key)}:
                    </Text>
                  </TD>
                  <TD>
                    <Text
                      style={{
                        ...styles.numericListItem,
                        color: colors.onBackground,
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
                      <Text
                        style={{
                          ...styles.button,
                          color: colors.onPrimaryContainer,
                        }}>
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
            <ActiveQuest
              key={index}
              item={quest}
              incrementXP={(increase: number) =>
                setChara({...chara, xp: chara.xp + increase})
              }
            />
          ))}
        </View>
      )}
    </View>
  );
};

export default forwardRef(Character);
