export interface GroundingSource {
  title: string;
  uri: string;
  sourceType: 'maps' | 'web';
}

export interface Restaurant {
  id: string;
  name: string;
  address?: string; // Often inferred from context or title
  uri: string;
}

export type AppState = 'IDLE' | 'LOCATING' | 'SEARCHING' | 'RESULTS' | 'PICKING' | 'ERROR';