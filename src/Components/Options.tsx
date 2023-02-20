import React from 'react';
import {Text, View} from 'react-native';
import {Switch, useTheme} from 'react-native-paper';
import {StyleSheet} from 'react-native-windows';
import {useDispatch, useSelector} from 'react-redux';
import styles from '../utils/styles';
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
          style={styles.switch}
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

export default Options;
