import React, {ReactElement, useState} from 'react';
import {Text, View} from 'react-native';
import {Button, IconButton, useTheme} from 'react-native-paper';
import {StyleSheet} from 'react-native-windows';
import Modal from '../Components/Modal';
import Options from '../Components/Options';
import CharacterScreen, {CharacterOptions} from './CharacterScreen';

interface Screen {
  name: string;
  screen: ReactElement;
  options: ReactElement;
}

const Drawer = () => {
  const {colors} = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [optionsOpen, setOptionsOpen] = useState(false);
  const screens: Screen[] = [
    {
      name: 'Characters',
      screen: <CharacterScreen />,
      options: <CharacterOptions />,
    },
    {
      name: 'Welcome',
      screen: (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text style={{color: colors.primary}}>Welcome</Text>
        </View>
      ),
      options: <View />,
    },
  ];
  const [selectedScreen, setSelectedScreen] = useState(screens[0]);
  const menu = (
    <View>
      {screens.map(screen => (
        <Button
          onPress={() => {
            setSelectedScreen(screen);
            setDrawerOpen(false);
          }}>
          <Text>{screen.name}</Text>
        </Button>
      ))}
    </View>
  );

  return (
    <View style={{flex: 1}}>
      <Modal isOpen={optionsOpen} onDismiss={() => setOptionsOpen(false)}>
        <Options>{selectedScreen.options}</Options>
      </Modal>
      <View
        style={{...styles.header, backgroundColor: colors.primaryContainer}}>
        <IconButton
          icon="menu"
          size={30}
          iconColor={colors.primary}
          rippleColor={colors.secondary}
          onPress={() => setDrawerOpen(!drawerOpen)}
          accessibilityLabelledBy={undefined}
          accessibilityLanguage={undefined}
        />
        <Text style={{...styles.h1, color: colors.primary}}>
          {selectedScreen.name}
        </Text>
        <IconButton
          icon="cog"
          size={30}
          iconColor={colors.primary}
          rippleColor={colors.secondary}
          onPress={() => setOptionsOpen(!optionsOpen)}
          accessibilityLabelledBy={undefined}
          accessibilityLanguage={undefined}
        />
      </View>
      <View
        style={{
          backgroundColor: colors.background,
          flex: 1,
          flexDirection: 'row',
        }}>
        {drawerOpen && menu}
        {selectedScreen.screen}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  h1: {
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 30,
  },
  h2: {
    textAlign: 'center',
    fontSize: 25,
  },
  switch: {
    marginRight: -7,
    marginTop: -5,
    marginBottom: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 10,
    borderBottomWidth: 1,
  },
});

export default Drawer;
