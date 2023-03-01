import React, {ReactElement, useRef, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Button, IconButton, useTheme} from 'react-native-paper';
import Modal from '../Components/Modal';
import Options from '../Components/Options';
import {useDeferredPromise} from '../utils/DeferredPromise';
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

  const childRef = useRef<any>();
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
  const {defer, deferRef} = useDeferredPromise<'save' | 'discard' | 'cancel'>();
  const [showSaveButton, setShowSaveButton] = useState(false);

  const handleNavigation = async (screen: Screen) => {
    if (
      childRef.current?.hasUnsavedChanges &&
      childRef.current?.hasUnsavedChanges()
    ) {
      setSaveModalVisible(true);
      setSaveModalContent(childRef.current.hasUnsavedChanges());
      const value = await defer().promise;
      setSaveModalVisible(false);
      if (value === 'save') {
        await childRef.current.save();
        setSelectedScreen(screen);
      } else if (value === 'discard') {
        setSelectedScreen(screen);
      }
    } else {
      setSelectedScreen(screen);
    }
    setDrawerOpen(false);
  };

  const SaveModal = () => {
    return (
      <Modal
        isOpen={saveModalVisible}
        onDismiss={() => setSaveModalVisible(false)}>
        <View style={{backgroundColor: colors.background}}>
          <View
            style={{
              ...styles.header,
              backgroundColor: colors.primaryContainer,
            }}>
            <Text
              style={{
                ...styles.h1,
                ...localStyles.container,
                color: colors.primary,
              }}>
              Unsaved Changes
            </Text>
          </View>
          <View>
            <ScrollView
              style={localStyles.scrollView}
              nestedScrollEnabled={true}>
              {saveModalContent}
            </ScrollView>
          </View>
          <View style={styles.row}>
            <Button onPress={() => deferRef?.resolve('cancel')}>
              <Text>Cancel</Text>
            </Button>
            <Button onPress={() => deferRef?.resolve('discard')}>
              <Text>Discard changes</Text>
            </Button>
            <Button onPress={() => deferRef?.resolve('save')}>
              <Text>Save</Text>
            </Button>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View style={localStyles.container}>
      <SaveModal />
      <Modal isOpen={optionsOpen} onDismiss={() => setOptionsOpen(false)}>
        <Options>{selectedScreen.options}</Options>
      </Modal>
      <View
        style={{...styles.header, backgroundColor: colors.primaryContainer}}>
        <View style={localStyles.row}>
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
        </View>
        <View style={localStyles.row}>
          {showSaveButton && (
            <TouchableOpacity
              style={{backgroundColor: colors.inversePrimary}}
              onPress={childRef.current.save}>
              <Text style={{...styles.button, color: colors.primary}}>
                SAVE
              </Text>
            </TouchableOpacity>
          )}
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
      </View>
      <View
        style={{
          ...localStyles.drawer,
          backgroundColor: colors.secondaryContainer,
        }}>
        {drawerOpen && (
          <View>
            {screens.map(screen => (
              <Button
                key={screen.name}
                onPress={() => handleNavigation(screen)}>
                <Text style={{color: colors.onSecondaryContainer}}>
                  {screen.name}
                </Text>
              </Button>
            ))}
          </View>
        )}
        <selectedScreen.screen
          ref={(newRef: any) => {
            childRef.current = newRef;
            setShowSaveButton(newRef?.save !== undefined);
          }}
        />
      </View>
    </View>
  );
};

const localStyles = StyleSheet.create({
  container: {flex: 1},
  drawer: {flexDirection: 'row'},
  row: {flexDirection: 'row', alignItems: 'center'},
  scrollView: {flexGrow: 0},
});

export default Drawer;
