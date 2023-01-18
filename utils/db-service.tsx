import {Item} from 'react-native-paper/lib/typescript/components/List/List';
import SQLite, {SQLiteDatabase} from 'react-native-sqlite-storage';
import {character, gift, housekeeping} from './types';

// NOTE: Every time you replace the db, you have to manually uninstall the app from Android
/**
 * Opens a connection to the database
 *
 * @returns SQLiteDatabase
 */
export const getDBConnection = async () => {
  return SQLite.openDatabase(
    {
      name: 'Glitch.db',
      location: 'default',
      createFromLocation: '1',
    },
    () => console.log('Success!'),
    () => console.log('Failure'),
  );
};

SQLite.enablePromise(true);

/**
 * Queries database for list of characters
 *
 * @returns character[]
 */
export const getCharacters = async () => {
  const db = await getDBConnection();

  // This is what we will return
  const characters: character[] = [];
  try {
    // Build the query
    const query = `SELECT *
    FROM Characters`;

    // Execute the query
    const result = (await db.executeSql(query))[0];

    // Iterate each row returned
    for (let index = 0; index < result.rows.length; index++) {
      // Convert row to useable object
      const characterRow = result.rows.item(index);
      characters.push!({
        key: characterRow.id,
        name: characterRow.name,
        discipline: characterRow.discipline,
        xp: characterRow.xp,

        flavor: {
          sphere: characterRow.sphere,
          technique: characterRow.technique,
          sanctuary: characterRow.sanctuary,
          destruction: characterRow.destruction,
        },

        stats: {
          eide: characterRow.eide,
          flore: characterRow.flore,
          lore: characterRow.lore,
          wyrd: characterRow.wyrd,
          ability: characterRow.ability,
        },

        costs: {
          stillness: characterRow.stillness,
          immersion: characterRow.immersion,
          fugue: characterRow.fugue,
          burn: characterRow.burn,
          wear: characterRow.wear,
        },

        housekeeping: await getHousekeeping(characterRow.id, db),
        gifts: await getGifts(characterRow.id, db),
      });
      console.log(characters[index].housekeeping);
    }
    return characters;
  } catch (error) {
    throw Error('Failed to get items: ' + error);
  } finally {
    db.close();
  }
};

/**
 * Queries database for list of characters
 *
 * @returns character[]
 */
export const getHousekeeping = async (charID: number, db: SQLiteDatabase) => {
  // This is what we will return
  const charFlavor: housekeeping = {
    bonds: [],
    geasa: [],
    treasures: [],
    arcana: [],
    levers: [],
  };

  const flavors = Object.keys(charFlavor);
  for (const flavor of flavors) {
    const query = `SELECT *
    FROM ${flavor}
    WHERE character = ${charID}`;
    const result = (await db.executeSql(query))[0];
    for (let index = 0; index < result.rows.length; index++) {
      charFlavor[flavor as keyof housekeeping].push!(
        result.rows.item(index).name,
      );
    }
  }

  return charFlavor;
};

/**
 * Queries character's gifts
 *
 * @returns gift[]
 */
export const getGifts = async (charID: number, db: SQLiteDatabase) => {
  // This is what we will return
  const gifts: gift[] = [];

  const query = `SELECT *
    FROM Gifts_View
    WHERE character = ${charID}`;
  const result = (await db.executeSql(query))[0];
  for (let index = 0; index < result.rows.length; index++) {
    const item = result.rows.item(index);
    gifts.push({
      key: item.id,
      name: item.name,
      pg: item.pg,
      description: item.description,
      cost: item.cost,
      activation: item.activation,
      aoe: item.aoe,
      flexibility: item.flexibility,
      common: item.common,
      cps: item.cps,
    });
  }

  return gifts;
};

/**
 * Save character changes to the database
 *
 * @param id The row id for the character we're changing
 * @param changes The list of changed props
 */
export const saveCharacter = async (id: number, changes: any) => {
  const db = await getDBConnection();

  // Build the update section of the query
  var changeStr = '';
  Object.keys(changes.charTable).forEach(
    key => (changeStr += `${key} = ${changes.charTable[key]}, `),
  );
  changeStr = changeStr.slice(0, changeStr.length - 2); // Remove trailing comma and space

  try {
    // Build the query
    const query = `UPDATE Characters
    SET ${changeStr}
    WHERE id = ${id};`;

    // Execute the query
    await db.executeSql(query);
  } catch (error) {
    throw Error('Failed to set character: ' + error);
  } finally {
    db.close();
  }
};
