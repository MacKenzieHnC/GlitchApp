import React from 'react';
import {View, Text} from 'react-native';
import {useTheme} from 'react-native-paper';
import styles from '../utils/styles';

// TODO: Delete this
export const WelcomeScreen = ({gameDir}) => {
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
        {gameDir}
      </Text>
    </View>
  );
};
