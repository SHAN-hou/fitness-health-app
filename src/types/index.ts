export interface UserProfile {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  height: number;
  weight: number;
  bodyFatPercentage?: number;
  restingHeartRate?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface FitnessGoal {
  id: string;
  type: 'weight_loss' | 'muscle_gain' | 'endurance' | 'flexibility' | 'general_health';
  targetValue: number;
  currentValue: number;
  unit: string;
  startDate: Date;
  targetDate: Date;
  isCompleted: boolean;
}

export interface WorkoutSession {
  id: string;
  type: 'running' | 'walking' | 'cycling' | 'strength' | 'yoga' | 'other';
  startTime: Date;
  endTime?: Date;
  duration: number;
  caloriesBurned: number;
  distance?: number;
  steps?: number;
  heartRateAvg?: number;
  notes?: string;
}

export interface DailyStats {
  date: string;
  steps: number;
  caloriesBurned: number;
  activeMinutes: number;
  workoutsCompleted: number;
  waterIntake: number;
  sleepHours: number;
}

export interface HealthReminder {
  id: string;
  type: 'water' | 'exercise' | 'rest' | 'medication' | 'custom';
  title: string;
  message: string;
  time: string;
  repeatDays: number[];
  isEnabled: boolean;
}

export type RootTabParamList = {
  Home: undefined;
  Profile: undefined;
  Goals: undefined;
  Workout: undefined;
  Stats: undefined;
};
