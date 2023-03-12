/*
    Recursive prop traversals
*/

import {Platform} from 'react-native';

export function getPropFromPath(obj: any, path: string[]) {
  return path.reduce((prev, current) => prev?.[current], obj);
}

function isLeafNode(obj: any) {
  return typeof obj !== 'object' && obj !== null;
}

export const detectChanges = (init: any, current: any) => {
  var array: any[] = [];
  const keys = Object.keys(init);
  keys.forEach(key => {
    const changes = recursiveDetectChanges(init[key], current[key], [key]);
    if (changes.length > 0) {
      array = [...array, ...changes];
    }
  });
  return array;
};

const recursiveDetectChanges = (init: any, current: any, path: string[]) => {
  var array: any[] = [];
  const keys = Object.keys(init);
  if (isLeafNode(init)) {
    if (init !== current) {
      return [path];
    } else {
      return [];
    }
  } else {
    keys.forEach(key => {
      const changes = recursiveDetectChanges(init[key], current[key], [
        ...path,
        key,
      ]);
      if (changes.length > 0) {
        array = [...array, ...changes];
      }
    });
    return array;
  }
};

/*
    Convenience functions
*/
export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function backslash() {
  return Platform.OS === 'windows' ? '\\' : '/';
}
