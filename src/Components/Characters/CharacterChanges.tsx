import {Table, TD, TR} from '@mackenziehnc/table';
import React from 'react';
import {View} from 'react-native';
import {Text} from 'react-native-paper';
import styles from '../../utils/styles';
import {character} from '../../utils/types';
import {detectChanges, getPropFromPath} from '../../utils/utils';

interface ChangeProps {
  initial: character;
  current: character;
}

export default function CharacterChanges({initial, current}: ChangeProps) {
  // Get change object
  let changes = detectChanges(initial, current);
  if (changes.length > 0) {
    return (
      <View key={current.name} style={{...styles.innerContainer, padding: 10}}>
        <Text key={0} style={styles.h2}>
          {current.name}
        </Text>
        <Table key={1} priviledgedColumns={[0, 1, 2, 3]}>
          {changes.map(change => {
            const key = change[change.length - 1];
            return (
              <TR key={key}>
                <TD key={'key'}>
                  <Text>{key}: </Text>
                </TD>
                <TD key={'initial'}>
                  <Text>{getPropFromPath(initial, change)}</Text>
                </TD>
                <TD key={'arrow'}>
                  <Text>{'=>'}</Text>
                </TD>
                <TD key={'current'}>
                  <Text>{getPropFromPath(current, change)}</Text>
                </TD>
              </TR>
            );
          })}
        </Table>
      </View>
    );
  } else {
    return null;
  }
}
