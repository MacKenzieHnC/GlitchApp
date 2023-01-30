import React, {useState} from 'react';
import {Text, View} from 'react-native';
import {Checkbox, useTheme} from 'react-native-paper';
import {StyleSheet} from 'react-native-windows';
import {useSelector} from 'react-redux';
import {getPreferences} from '../utils/store/appSlice';
import {activeQuest} from '../utils/types';
import LoadScreen from './LoadScreen';

const ActiveQuest = ({item}: {item: activeQuest}) => {
  const {colors} = useTheme();

  const [majorChecked, setMajorChecked] = useState<boolean[]>(
    item.majorGoals.map(goal => goal.completed),
  );

  const [flavorChecked, setFlavorChecked] = useState<boolean[]>(
    new Array(item.questFlavor.length).fill(false),
  );
  const {preferences} = useSelector(getPreferences);

  if (!majorChecked || !flavorChecked) {
    return <LoadScreen />;
  }
  return (
    <View
      style={{...styles.container, backgroundColor: colors.primaryContainer}}>
      <Text style={{...styles.header, color: colors.primary}}>{item.name}</Text>
      <Text style={{color: colors.primary}}>
        {item.earnedXP} / {item.neededXP}xp
      </Text>
      {preferences.descriptions && (
        <View>
          <Text style={{color: colors.primary}}>{item.description}</Text>
        </View>
      )}

      {/* Major Goals */}
      {item.majorGoals.length > 0 && (
        <View style={styles.goalContainer}>
          <Text style={{...styles.h3, color: colors.primary}}>Major Goals</Text>
          <View style={styles.listContainer}>
            {item.majorGoals.map((goal, index) => (
              <View key={index} style={{...styles.row, flexWrap: 'nowrap'}}>
                <Checkbox
                  status={majorChecked[index] ? 'checked' : 'unchecked'}
                  disabled={!!item.majorGoals[index].completed}
                  onPress={() => {
                    let newArr = [...majorChecked];
                    newArr[index] = !newArr[index];
                    setMajorChecked(newArr);
                  }}
                />
                <Text style={{...styles.text, color: colors.primary}}>
                  {goal.description}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Quest Flavor */}
      {item.questFlavor.length > 0 && (
        <View style={styles.goalContainer}>
          <Text style={{...styles.h3, color: colors.primary}}>
            Quest Flavor
          </Text>
          <View style={styles.listContainer}>
            {item.questFlavor.map((goal, index) => (
              <View key={index} style={styles.row}>
                <Checkbox
                  status={flavorChecked[index] ? 'checked' : 'unchecked'}
                  onPress={() => {
                    let newArr = [...flavorChecked];
                    newArr[index] = !newArr[index];
                    setFlavorChecked(newArr);
                  }}
                />
                <Text style={{...styles.text, color: colors.primary}}>
                  {goal.description}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 10,
    margin: 5,
    borderRadius: 15,
    flexBasis: 300,
    flexGrow: 1,
  },
  listContainer: {
    alignItems: 'flex-start',
  },
  goalContainer: {
    alignItems: 'center',
  },
  header: {
    padding: 5,
    textAlignVertical: 'top',
    fontSize: 20,
  },
  h3: {
    textAlign: 'center',
    fontSize: 20,
  },
  text: {
    paddingTop: 6,
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
});

export default ActiveQuest;
