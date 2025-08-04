export interface Driver {
  id: number;
  name: string;
  team: string;
  number: number;
  points: number;
  wins: number;
  podiums: number;
  fastestLaps: number;
  image: string;
}

export interface Track {
  id: number;
  name: string;
  country: string;
  length: number;
  corners: number;
  drsZones: number;
  lapRecord: {
    time: string;
    driver: string;
    year: number;
  };
  image: string;
}

export interface User {
  email: string;
  password: string;
}

export interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}