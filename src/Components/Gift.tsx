import {Table, TD, TR} from '@mackenziehnc/table';
import React from 'react';
import {Text, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {StyleSheet} from 'react-native-windows';
import {useSelector} from 'react-redux';
import {getPreferences} from '../utils/store/appSlice';
import {gift} from '../utils/types';
import {capitalize} from '../utils/utils';

const Gift = ({item}: {item: gift}) => {
  const {colors} = useTheme();
  const {preferences} = useSelector(getPreferences);
  return (
    <View style={styles.container}>
      <Text style={{...styles.h3, color: colors.onBackground}}>
        {item.name}
      </Text>
      <Table priviledgedColumns={[0]}>
        {['cost', 'activation', 'aoe', 'flexibility'].map(key => (
          <TR key={key}>
            <TD>
              <Text style={{...styles.listItem, color: colors.onBackground}}>
                {capitalize(key)}:
              </Text>
            </TD>
            <TD>
              <Text style={{...styles.listItem, color: colors.onBackground}}>
                {item[key as keyof gift]}
              </Text>
            </TD>
          </TR>
        ))}
      </Table>
      {preferences.descriptions && (
        <View style={styles.textView}>
          <Text style={{color: colors.onBackground}}>{item.description}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexBasis: 0,
  },
  listItem: {
    padding: 5,
    textAlignVertical: 'top',
  },
  h3: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
  },
  textView: {
    flex: 1,
  },
});

export default Gift;
