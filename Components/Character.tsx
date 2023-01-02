import React, {useState} from 'react';
import {Button, Text, View} from 'react-native';
import {StyleSheet} from 'react-native-windows';
import {character, costs, flavor, stats} from '../utils/types';
import Table from './Table';
import capitalize from '../utils/Capitalize';
import LoadScreen from './LoadScreen';

const Character = ({initial}: {initial: character}) => {
  // Load
  const [chara, setChara] = useState(initial);
  if (!chara) {
    return <LoadScreen />;
  }

  // Component
  return (
    <View style={styles.container}>
      {/* Name */}
      <Text style={styles.h1}>{initial.name}</Text>
      <Text style={styles.h2}>Disciplined in {initial.discipline}</Text>

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
