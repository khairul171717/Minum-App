export interface WaterLog {
  id: number;
  amount_ml: number;
  timestamp: string;
  date: string; // YYYY-MM-DD
}

export interface DailyStats {
  date: string;
  total_ml: number;
  entries_count: number;
}

export interface UserSettings {
  daily_goal_ml: number;
  glass_size_ml: number;
  weight_kg?: number;
  activity_level?: 'low' | 'normal' | 'high';
}

export type GlassSize = {
  label: string;
  amount_ml: number;
  icon: string; // emoji
};

export const DEFAULT_GLASS_SIZES: GlassSize[] = [
  { label: '150ml', amount_ml: 150, icon: '🥤' },
  { label: '250ml', amount_ml: 250, icon: '🥛' },
  { label: '500ml', amount_ml: 500, icon: '🫗' },
];

export const DEFAULT_SETTINGS: UserSettings = {
  daily_goal_ml: 2000,
  glass_size_ml: 250,
  weight_kg: 60,
  activity_level: 'normal',
};
