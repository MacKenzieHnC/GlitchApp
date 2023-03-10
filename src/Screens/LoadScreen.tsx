import React from 'react';
import {Text, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {StyleSheet} from 'react-native-windows';

const LoadScreen = () => {
  const {colors} = useTheme();
  return (
    <View style={styles.loading}>
      <Text style={{color: colors.primary}}>Loading...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoadScreen;
