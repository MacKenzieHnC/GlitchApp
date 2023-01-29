import React, {useState} from 'react';
import {Text, View} from 'react-native';
import {Checkbox, useTheme} from 'react-native-paper';
import {StyleSheet} from 'react-native-windows';
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
  const [displayDescription, setDisplayDescription] = useState(true);

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
      <View style={styles.row}>
        <Checkbox
          status={displayDescription ? 'checked' : 'unchecked'}
          onPress={() => setDisplayDescription(!displayDescription)}
        />
        <Text style={{...styles.h3, color: colors.primary}}>Description</Text>
      </View>
      {displayDescription && (
        <Text style={{color: colors.primary}}>{item.description}</Text>
      )}

      {/* Major Goals */}
      <Text style={{...styles.h3, color: colors.primary}}>Major Goals</Text>
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

      {/* Quest Flavor */}
      <Text style={{...styles.h3, color: colors.primary}}>Quest Flavor</Text>
      {item.questFlavor.map((goal, index) => (
        <View key={index} style={{...styles.row, flexWrap: 'nowrap'}}>
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
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    padding: 10,
    margin: 5,
    borderRadius: 15,
    flexBasis: 300,
  },
  goalContainer: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flex: 0,
    padding: 10,
    margin: 5,
    borderRadius: 15,
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
