import React from 'react';
import {Text, View} from 'react-native';
import {Switch, useTheme} from 'react-native-paper';
import {StyleSheet} from 'react-native-windows';
import {useDispatch, useSelector} from 'react-redux';
import {getPreferences, preferencesChanged} from '../utils/store/appSlice';

const Options = ({children}) => {
  const {colors} = useTheme();
  const dispatch = useDispatch();
  const {preferences} = useSelector(getPreferences);
  return (
    <View
      style={{
        ...styles.container,
        backgroundColor: colors.primaryContainer,
        borderColor: colors.backdrop,
      }}>
      <View style={{...styles.header, backgroundColor: colors.backdrop}}>
        <Text
          style={{
            ...styles.h1,
            color: colors.primary,
          }}>
          Options
        </Text>
      </View>
      <View style={styles.row}>
        <Switch
          value={preferences.darkMode}
          onValueChange={() => {
            dispatch(
              preferencesChanged({
                ...preferences,
                darkMode: !preferences.darkMode,
              }),
            );
            return;
          }}
        />
        <Text style={{color: colors.primary}}>Dark Mode</Text>
      </View>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 2,
    minWidth: '50%',
  },
  header: {
    alignItems: 'center',
    padding: 10,
    width: '100%',
  },
  h1: {
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 30,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
});

export default Options;
