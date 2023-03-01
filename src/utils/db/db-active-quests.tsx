import {SQLiteDatabase} from 'react-native-sqlite-storage';
import {activeQuest, majorGoal, goal} from '../types';
import {getDBConnection} from './db-service';

interface ActiveQuestChanges {
  questID: number;
  charID: number;
  xp: number | undefined;
  completedGoals: number[] | undefined;
}

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

  const query = `SELECT g.id,
        q.id as quest,
        c.id as character,
        g.description,
        g.id IN (SELECT cg.goal
            FROM Completed_Goals cg
            JOIN Goals g ON cg.goal = g.id
          WHERE cg.character = c.id) AS completed 
    FROM Goals g
    JOIN Characters c ON aq.character = c.id
    JOIN Quests q ON g.Quest = q.id
    JOIN Active_Quests aq ON aq.quest = q.id
    WHERE g.major = 'true' 
    AND (g.id IN (SELECT ug.goal 
            FROM Unique_Goals ug 
            JOIN Goals g ON ug.goal = g.id
            WHERE ug.character = c.id) 
        OR g.unique_goal = 'false')
    AND character = ${charID}
    AND g.quest = ${questID}`;
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

  const query = `SELECT g.id,
        q.id as quest,
        c.id as character,
        g.description,
        g.id IN (SELECT cg.goal
            FROM Completed_Goals cg
            JOIN Goals g ON cg.goal = g.id
          WHERE cg.character = c.id) AS completed 
    FROM Goals g
    JOIN Characters c ON aq.character = c.id
    JOIN Quests q ON g.Quest = q.id
    JOIN Active_Quests aq ON aq.quest = q.id
    WHERE g.major = 'false' 
    AND (g.id IN (SELECT ug.goal 
            FROM Unique_Goals ug 
            JOIN Goals g ON ug.goal = g.id
            WHERE ug.character = c.id) 
        OR g.unique_goal = 'false')
    AND character = ${charID}
    AND g.quest = ${questID}`;
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
export const saveActiveQuestWithDB = async (
  db: SQLiteDatabase,
  changes: ActiveQuestChanges,
) => {
  if (changes.xp) {
    // Build the update section of the query

    try {
      // Build the query
      const query = `UPDATE Active_Quests
                      SET earnedXP = ${changes.xp}
                      WHERE id = ${changes.questID};`;

      // Execute the query
      await db.executeSql(query);
    } catch (error) {
      throw Error('Failed to update quest XP: ' + error);
    }
  }

  if (changes.completedGoals) {
    // Build the update section of the query
    let values = '';
    changes.completedGoals.forEach((id, index) => {
      values += `((Select rowid from Completed_Goals order by rowid desc limit 1) + ${
        index + 1
      }, ${changes.charID}, ${(changes.completedGoals as number[])[index]}), `;
    });
    values = values.slice(0, values.length - 2);
    console.log(values);
    try {
      // Build the query
      const query = `INSERT INTO Completed_Goals
                      VALUES ${values};`;

      // Execute the query
      await db.executeSql(query);
    } catch (error) {
      throw Error('Failed to update completed goals: ' + error);
    }
  }
};

/**
 * Save character changes to the database
 *
 * @param changes The list of changed props
 */
export const saveActiveQuest = async (changes: ActiveQuestChanges) => {
  const db = await getDBConnection();

  try {
    await saveActiveQuestWithDB(db, changes);
  } catch (error) {
    throw Error('Failed to save quest: ' + error);
  } finally {
    db.close();
  }
};
