import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile, FitnessGoal, WorkoutSession, DailyStats, HealthReminder } from '../types';

interface HealthState {
  userProfile: UserProfile | null;
  fitnessGoals: FitnessGoal[];
  workoutSessions: WorkoutSession[];
  dailyStats: DailyStats | null;
  reminders: HealthReminder[];

  updateUserProfile: (profile: UserProfile) => void;
  addFitnessGoal: (goal: FitnessGoal) => void;
  updateFitnessGoal: (goal: FitnessGoal) => void;
  deleteFitnessGoal: (goalId: string) => void;
  addWorkoutSession: (session: WorkoutSession) => void;
  updateDailyStats: (stats: DailyStats) => void;
  addReminder: (reminder: HealthReminder) => void;
  updateReminder: (reminder: HealthReminder) => void;
  deleteReminder: (reminderId: string) => void;
}

export const useHealthStore = create<HealthState>()(
  persist(
    (set) => ({
      userProfile: null,
      fitnessGoals: [],
      workoutSessions: [],
      dailyStats: null,
      reminders: [],

      updateUserProfile: (profile) =>
        set({ userProfile: profile }),

      addFitnessGoal: (goal) =>
        set((state) => ({
          fitnessGoals: [...state.fitnessGoals, goal],
        })),

      updateFitnessGoal: (goal) =>
        set((state) => ({
          fitnessGoals: state.fitnessGoals.map((g) =>
            g.id === goal.id ? goal : g
          ),
        })),

      deleteFitnessGoal: (goalId) =>
        set((state) => ({
          fitnessGoals: state.fitnessGoals.filter((g) => g.id !== goalId),
        })),

      addWorkoutSession: (session) =>
        set((state) => ({
          workoutSessions: [...state.workoutSessions, session],
        })),

      updateDailyStats: (stats) =>
        set({ dailyStats: stats }),

      addReminder: (reminder) =>
        set((state) => ({
          reminders: [...state.reminders, reminder],
        })),

      updateReminder: (reminder) =>
        set((state) => ({
          reminders: state.reminders.map((r) =>
            r.id === reminder.id ? reminder : r
          ),
        })),

      deleteReminder: (reminderId) =>
        set((state) => ({
          reminders: state.reminders.filter((r) => r.id !== reminderId),
        })),
    }),
    {
      name: 'health-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
