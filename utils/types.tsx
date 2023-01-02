export interface character {
  key: number;
  name: string;
  discipline: string;
  xp: number;

  flavor: flavor;
  stats: stats;
  costs: costs;

  // bonds: string[];
  // geasa: string;
  // gifts: gift[];
  // treasures: string[];
  // arcana: string[];

  // levers: string[];
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
