import React from 'react';
import {Text, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {StyleSheet} from 'react-native-windows';

const Options = ({children}) => {
  const {colors} = useTheme();
  return (
    <View
      style={{
        ...styles.container,
        backgroundColor: colors.surface,
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
});

export default Options;
