import SQLite, {SQLiteDatabase} from 'react-native-sqlite-storage';
import {
  character,
  gift,
  activeQuest,
  housekeeping,
  majorGoal,
  goal,
} from './types';

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
        quests: await getCharacterQuests(characterRow.id, db),
      });
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

  const query = `SELECT ag.id,
        ag.character,
        g.name,
        g.pg,
        g.description,
        (a.cost + g.miracleLevel) as cost,
        a.description AS activation,
        aoe.description AS aoe,
        f.description AS flexibility,
        g.common,
        (g.miracleLevel + a.cps + aoe.cps + f.cps + case when g.common then 0 else 1 end) AS cps
    FROM Active_Gifts ag
        JOIN Gifts g ON ag.gift = g.id
        JOIN Activation a ON g.activation = a.id
        JOIN AoE aoe ON g.aoe = aoe.id
        JOIN Flexibility f ON g.flexibility = f.id
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
 * Queries character's quests
 *
 * @returns activeQuest[]
 */
export const getCharacterQuests = async (
  charID: number,
  db: SQLiteDatabase,
) => {
  // This is what we will return
  const quests: activeQuest[] = [];

  const query = `SELECT aq.id,
      aq.quest,
      aq.character, 
      q.name, 
      q.description, 
      q.pg, 
      aq.earnedXP, 
      aq.neededXP 
    FROM Active_Quests aq 
      JOIN Quests q ON aq.quest = q.id
    WHERE character = ${charID}`;
  const result = (await db.executeSql(query))[0];
  for (let index = 0; index < result.rows.length; index++) {
    const item = result.rows.item(index);
    quests.push({
      key: item.id,
      name: item.name,
      pg: item.pg,
      description: item.description,
      earnedXP: item.earnedXP,
      neededXP: item.neededXP,
      questFlavor: await getQuestFlavor(charID, item.quest, db),
      majorGoals: await getMajorGoals(charID, item.quest, db),
    });
  }

  return quests;
};

/**
 * Queries character's quests
 *
 * @returns majorGoal[]
 */
export const getMajorGoals = async (
  charID: number,
  questID: number,
  db: SQLiteDatabase,
) => {
  // This is what we will return
  const goals: majorGoal[] = [];

  const query = `SELECT mg.id,
    q.id as questID,
    c.id as character,
    mg.description,
    mg.id IN (SELECT cg.goal
        FROM Completed_Goals cg
        JOIN Major_Goals mg ON cg.goal = mg.id
      WHERE cg.character = c.id) 
      as completed
    FROM Major_Goals mg
        JOIN Quests q ON mg.Quest = q.id
        JOIN Active_Quests aq ON aq.quest = q.id
        JOIN Characters c ON aq.character = c.id
    WHERE character = ${charID}
    AND questID = ${questID}`;
  const result = (await db.executeSql(query))[0];
  for (let index = 0; index < result.rows.length; index++) {
    const item = result.rows.item(index);
    goals.push({
      key: item.id,
      description: item.description,
      completed: item.completed,
    });
  }

  return goals;
};

/**
 * Queries character's quest flavor
 *
 * @returns questFLavor[]
 */
export const getQuestFlavor = async (
  charID: number,
  questID: number,
  db: SQLiteDatabase,
) => {
  // This is what we will return
  const goals: goal[] = [];

  const query = `SELECT qf.id,
        q.id as questID,
        c.id as character,
        qf.description
    FROM Quest_Flavor qf
      JOIN Quests q ON qf.quest = q.id
      JOIN Active_Quests aq ON aq.quest = q.id
      JOIN Characters c ON aq.character = c.id
    WHERE character = ${charID}
    AND questID = ${questID}`;
  const result = (await db.executeSql(query))[0];
  for (let index = 0; index < result.rows.length; index++) {
    const item = result.rows.item(index);
    goals.push({
      key: item.id,
      description: item.description,
    });
  }

  return goals;
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
  Object.keys(changes).forEach(
    key => (changeStr += `${key} = ${changes[key]}, `),
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
