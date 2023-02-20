import React, {ReactElement, useRef, useState} from 'react';
import {Alert, ScrollView, Text, View} from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';
import {Button, IconButton, useTheme} from 'react-native-paper';
import Modal from '../Components/Modal';
import Options from '../Components/Options';
import styles from '../utils/styles';
import CharacterScreen, {CharacterOptions} from './CharacterScreen';

interface Screen {
  name: string;
  screen: any;
  options: ReactElement;
}

const Drawer = () => {
  const {colors} = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [optionsOpen, setOptionsOpen] = useState(false);

  const childRef = useRef();
  const screens: Screen[] = [
    {
      name: 'Characters',
      screen: CharacterScreen,
      options: <CharacterOptions />,
    },
    {
      name: 'Welcome',
      screen: View,
      options: <View />,
    },
  ];
  const [selectedScreen, setSelectedScreen] = useState(screens[0]);
  const [saveModalVisible, setSaveModalVisible] = useState(false);
  const [saveModalContent, setSaveModalContent] = useState();

  const handleNavigation = screen => {
    if (
      childRef.current.hasUnsavedChanges &&
      childRef.current.hasUnsavedChanges()
    ) {
      setSaveModalVisible(true);
      setSaveModalContent(childRef.current.hasUnsavedChanges());
    } else {
      setSelectedScreen(screen);
      setDrawerOpen(false);
    }
  };

  const SaveModal = () => {
    return (
      <Modal
        isOpen={saveModalVisible}
        onDismiss={() => setSaveModalVisible(false)}
        style={{maxWidth: '75%'}}>
        <View
          style={{alignItems: 'center', backgroundColor: colors.background}}>
          <View
            style={{
              ...styles.header,
              backgroundColor: colors.primaryContainer,
            }}>
            <Text
              style={{
                ...styles.h1,
                textAlign: 'center',
                color: colors.primary,
              }}>
              Unsaved Changes
            </Text>
          </View>
          <View style={{flexShrink: 1}}>
            <ScrollView style={{flexGrow: 0}} nestedScrollEnabled={true}>
              {saveModalContent}
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View style={{flex: 1}}>
      <SaveModal />
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
        {drawerOpen && (
          <View>
            {screens.map(screen => (
              <Button
                key={screen.name}
                onPress={() => handleNavigation(screen)}>
                <Text>{screen.name}</Text>
              </Button>
            ))}
          </View>
        )}
        <selectedScreen.screen ref={childRef} />
      </View>
    </View>
  );
};

export default Drawer;
