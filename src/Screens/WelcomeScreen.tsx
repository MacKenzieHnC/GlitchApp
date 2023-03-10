import React from 'react';
import {View, Text} from 'react-native';
import {useTheme} from 'react-native-paper';
import {getFolderLocation} from '../utils/fileIO';
import styles from '../utils/styles';

// TODO: Delete this
export const WelcomeScreen = () => {
  const {colors} = useTheme();
  return (
    <View
      style={{
        ...styles.screen,
        ...styles.row,
        backgroundColor: colors.background,
      }}>
      <Text style={{color: colors.onBackground}}>
        Character Folder Location:{'\t'}
      </Text>
      <Text selectable style={{color: colors.onBackground}}>
        {getFolderLocation()}
      </Text>
    </View>
  );
};
