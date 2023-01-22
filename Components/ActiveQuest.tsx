import React from 'react';
import {Text, View} from 'react-native';
import {Card, useTheme} from 'react-native-paper';
import {StyleSheet} from 'react-native-windows';
import {activeQuest} from '../utils/types';

const ActiveQuest = ({item}: {item: activeQuest}) => {
  const {colors} = useTheme();
  return (
    <View style={{...styles.container, backgroundColor: colors.backdrop}}>
      <Text style={{...styles.header, color: colors.primary}}>{item.name}</Text>
      <Text style={{color: colors.primary}}>
        {item.earnedXP} / {item.neededXP}xp
      </Text>
      <Text style={{color: colors.primary}}>{item.description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexBasis: 300,
    flex: 1,
    padding: 10,
    margin: 5,
    borderRadius: 15,
  },
  header: {
    padding: 5,
    textAlignVertical: 'top',
    fontSize: 20,
  },
});

export default ActiveQuest;
