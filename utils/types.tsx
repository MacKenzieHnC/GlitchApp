export interface character {
  key: number;
  name: string;
  discipline: string;
  xp: number;

  flavor: flavor;
  stats: stats;
  costs: costs;
  housekeeping: housekeeping;
  gifts: gift[];

  quests: activeQuest[];
}

export interface flavor {
  sphere: string;
  technique: string;
  sanctuary: string;
  destruction: string;
}

export interface stats {
  eide: number;
  flore: number;
  lore: number;
  wyrd: number;
  ability: number;
}

export interface costs {
  stillness: number;
  immersion: number;
  fugue: number;
  burn: number;
  wear: number;
}

export interface housekeeping {
  bonds: string[];
  geasa: string[];
  treasures: string[];
  arcana: string[];
  levers: string[];
}

export interface gift {
  key: number;
  name: string;
  pg: number;
  description: string;
  cost: number;
  activation: string;
  aoe: string;
  flexibility: string;
  common: boolean;
  cps: number;
}

export interface activeQuest {
  key: number;
  earnedXP: number;
  neededXP: number;
  name: string;
  pg: number;
  description: string;
  questFlavor: goal[];
  majorGoals: majorGoal[];
}

export interface goal {
  key: number;
  description: string;
}

export interface majorGoal {
  key: number;
  description: string;
  completed: boolean;
}
