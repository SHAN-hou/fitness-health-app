import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useHealthStore } from '../store/healthStore';
import { WorkoutSession } from '../types';

const workoutTypes = [
  { key: 'running', label: '跑步', icon: '🏃', caloriesPerMin: 10 },
  { key: 'walking', label: '步行', icon: '🚶', caloriesPerMin: 4 },
  { key: 'cycling', label: '骑行', icon: '🚴', caloriesPerMin: 8 },
  { key: 'strength', label: '力量训练', icon: '💪', caloriesPerMin: 6 },
  { key: 'yoga', label: '瑜伽', icon: '🧘', caloriesPerMin: 3 },
  { key: 'other', label: '其他', icon: '⭐', caloriesPerMin: 5 },
];

export default function WorkoutScreen() {
  const { workoutSessions, addWorkoutSession, updateDailyStats, dailyStats } =
    useHealthStore();
  const [isActive, setIsActive] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('running');
  const [elapsedTime, setElapsedTime] = useState(0);
  const [currentSession, setCurrentSession] = useState<WorkoutSession | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    const session: WorkoutSession = {
      id: Date.now().toString(),
      type: selectedType as WorkoutSession['type'],
      startTime: new Date(),
      duration: 0,
      caloriesBurned: 0,
    };
    setCurrentSession(session);
    setIsActive(true);
    setElapsedTime(0);
  };

  const handleStop = () => {
    if (!currentSession) return;

    Alert.alert('结束运动', '确定要结束本次运动吗？', [
      { text: '继续', style: 'cancel' },
      {
        text: '结束',
        onPress: () => {
          const workoutType = workoutTypes.find((t) => t.key === selectedType);
          const duration = elapsedTime;
          const caloriesBurned = Math.round(
            (duration / 60) * (workoutType?.caloriesPerMin || 5)
          );

          const completedSession: WorkoutSession = {
            ...currentSession,
            endTime: new Date(),
            duration,
            caloriesBurned,
          };

          addWorkoutSession(completedSession);

          updateDailyStats({
            ...dailyStats,
            date: new Date().toISOString().split('T')[0],
            caloriesBurned: (dailyStats?.caloriesBurned || 0) + caloriesBurned,
            activeMinutes: (dailyStats?.activeMinutes || 0) + Math.round(duration / 60),
            workoutsCompleted: (dailyStats?.workoutsCompleted || 0) + 1,
            steps: dailyStats?.steps || 0,
            waterIntake: dailyStats?.waterIntake || 0,
            sleepHours: dailyStats?.sleepHours || 0,
          });

          setIsActive(false);
          setCurrentSession(null);
          setElapsedTime(0);

          Alert.alert(
            '运动完成！',
            `本次运动时长: ${formatTime(duration)}\n消耗热量: ${caloriesBurned} 卡路里`
          );
        },
      },
    ]);
  };

  const recentSessions = workoutSessions.slice(-5).reverse();

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <ScrollView style={styles.scrollView}>
        {!isActive ? (
          <>
            <View style={styles.typeSection}>
              <Text style={styles.sectionTitle}>选择运动类型</Text>
              <View style={styles.typeGrid}>
                {workoutTypes.map((type) => (
                  <TouchableOpacity
                    key={type.key}
                    style={[
                      styles.typeCard,
                      selectedType === type.key && styles.typeCardActive,
                    ]}
                    onPress={() => setSelectedType(type.key)}
                  >
                    <Text style={styles.typeIcon}>{type.icon}</Text>
                    <Text
                      style={[
                        styles.typeLabel,
                        selectedType === type.key && styles.typeLabelActive,
                      ]}
                    >
                      {type.label}
                    </Text>
                    <Text style={styles.typeCalories}>
                      ~{type.caloriesPerMin} 卡/分钟
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity style={styles.startButton} onPress={handleStart}>
              <Text style={styles.startButtonIcon}>▶</Text>
              <Text style={styles.startButtonText}>开始运动</Text>
            </TouchableOpacity>

            {recentSessions.length > 0 && (
              <View style={styles.historySection}>
                <Text style={styles.sectionTitle}>最近运动</Text>
                {recentSessions.map((session) => {
                  const type = workoutTypes.find((t) => t.key === session.type);
                  return (
                    <View key={session.id} style={styles.historyCard}>
                      <Text style={styles.historyIcon}>{type?.icon}</Text>
                      <View style={styles.historyInfo}>
                        <Text style={styles.historyTitle}>{type?.label}</Text>
                        <Text style={styles.historySubtitle}>
                          {new Date(session.startTime).toLocaleDateString('zh-CN')}
                        </Text>
                      </View>
                      <View style={styles.historyStats}>
                        <Text style={styles.historyDuration}>
                          {formatTime(session.duration)}
                        </Text>
                        <Text style={styles.historyCalories}>
                          {session.caloriesBurned} 卡
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </>
        ) : (
          <View style={styles.activeSession}>
            <View style={styles.activeType}>
              <Text style={styles.activeIcon}>
                {workoutTypes.find((t) => t.key === selectedType)?.icon}
              </Text>
              <Text style={styles.activeLabel}>
                {workoutTypes.find((t) => t.key === selectedType)?.label}
              </Text>
            </View>

            <View style={styles.timerContainer}>
              <Text style={styles.timerLabel}>运动时间</Text>
              <Text style={styles.timerValue}>{formatTime(elapsedTime)}</Text>
            </View>

            <View style={styles.liveStats}>
              <View style={styles.liveStat}>
                <Text style={styles.liveStatValue}>
                  {Math.round(
                    (elapsedTime / 60) *
                      (workoutTypes.find((t) => t.key === selectedType)
                        ?.caloriesPerMin || 5)
                  )}
                </Text>
                <Text style={styles.liveStatLabel}>卡路里</Text>
              </View>
              <View style={styles.liveStat}>
                <Text style={styles.liveStatValue}>
                  {Math.round(elapsedTime / 60)}
                </Text>
                <Text style={styles.liveStatLabel}>分钟</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.stopButton} onPress={handleStop}>
              <Text style={styles.stopButtonIcon}>⬛</Text>
              <Text style={styles.stopButtonText}>结束运动</Text>
            </TouchableOpacity>

            <View style={styles.tips}>
              <Text style={styles.tipsTitle}>💡 运动提示</Text>
              <Text style={styles.tipsText}>
                保持均匀呼吸，注意补充水分。如感到不适请立即停止运动。
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  typeSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  typeCard: {
    width: '30%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  typeCardActive: {
    borderColor: '#4CAF50',
    backgroundColor: '#f0f9f0',
  },
  typeIcon: {
    fontSize: 36,
  },
  typeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 8,
  },
  typeLabelActive: {
    color: '#4CAF50',
  },
  typeCalories: {
    fontSize: 10,
    color: '#999',
    marginTop: 4,
  },
  startButton: {
    backgroundColor: '#4CAF50',
    margin: 16,
    padding: 20,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  startButtonIcon: {
    fontSize: 24,
    color: '#fff',
    marginRight: 12,
  },
  startButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  historySection: {
    padding: 16,
    paddingTop: 0,
  },
  historyCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  historyIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  historyInfo: {
    flex: 1,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  historySubtitle: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  historyStats: {
    alignItems: 'flex-end',
  },
  historyDuration: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  historyCalories: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  activeSession: {
    padding: 24,
    alignItems: 'center',
  },
  activeType: {
    alignItems: 'center',
    marginBottom: 32,
  },
  activeIcon: {
    fontSize: 64,
  },
  activeLabel: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 12,
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  timerLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  timerValue: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#4CAF50',
    fontFamily: 'monospace',
  },
  liveStats: {
    flexDirection: 'row',
    gap: 48,
    marginBottom: 32,
  },
  liveStat: {
    alignItems: 'center',
  },
  liveStatValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333',
  },
  liveStatLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  stopButton: {
    backgroundColor: '#F44336',
    padding: 20,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  stopButtonIcon: {
    fontSize: 18,
    color: '#fff',
    marginRight: 12,
  },
  stopButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  tips: {
    backgroundColor: '#FFF9C4',
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
    width: '100%',
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F57F17',
    marginBottom: 8,
  },
  tipsText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});
