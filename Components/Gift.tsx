import React from 'react';
import {Text, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {StyleSheet} from 'react-native-windows';
import {gift} from '../utils/types';
import {capitalize} from '../utils/utils';
import Table from './Table';

const Gift = ({item}: {item: gift}) => {
  const {colors} = useTheme();
  return (
    <View style={styles.container}>
      <Text style={{color: colors.primary}}>{item.name}</Text>
      <Table
        data={['cost', 'activation', 'aoe', 'flexibility'].map(key => ({
          name: (
            <Text style={{...styles.listItem, color: colors.primary}}>
              {capitalize(key)}:
            </Text>
          ),
          value: (
            <Text style={{...styles.listItem, color: colors.primary}}>
              {item[key as keyof gift]}
            </Text>
          ),
        }))}
        rowStyle={undefined}
        priviledge={[true, false]}
      />
      <Text style={{color: colors.primary}}>{item.description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listItem: {
    padding: 5,
    textAlignVertical: 'top',
  },
});

export default Gift;
