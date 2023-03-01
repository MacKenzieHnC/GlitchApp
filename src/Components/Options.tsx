import React from 'react';
import {Text, View} from 'react-native';
import {Switch, useTheme} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import styles from '../utils/styles';
import {getPreferences, preferencesChanged} from '../utils/store/appSlice';
import {StyleSheet} from 'react-native';

const Options = ({children}: any) => {
  const {colors} = useTheme();
  const dispatch = useDispatch();
  const {preferences} = useSelector(getPreferences);
  return (
    <View
      style={{
        ...localStyles.container,
        backgroundColor: colors.secondaryContainer,
      }}>
      <View
        style={{
          ...localStyles.header,
          backgroundColor: colors.primaryContainer,
        }}>
        <Text
          style={{
            ...styles.h1,
            color: colors.onPrimaryContainer,
          }}>
          Options
        </Text>
      </View>
      <View style={localStyles.innerContainer}>
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
          <Text
            style={{
              color: colors.onSecondaryContainer,
            }}>
            Dark Mode
          </Text>
        </View>
        {children}
      </View>
    </View>
  );
};

const localStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    width: '100%',
    borderRadius: 15,
  },
  header: {
    borderBottomWidth: 1,
    alignSelf: 'stretch',
    padding: 5,
  },
  innerContainer: {
    padding: 20,
  },
});

export default Options;
