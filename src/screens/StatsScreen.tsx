import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useHealthStore } from '../store/healthStore';

const { width } = Dimensions.get('window');

export default function StatsScreen() {
  const { workoutSessions, dailyStats, fitnessGoals } = useHealthStore();

  const weeklyData = React.useMemo(() => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayStr = date.toLocaleDateString('zh-CN', { weekday: 'short' });
      const sessions = workoutSessions.filter((s) => {
        const sessionDate = new Date(s.startTime).toDateString();
        return sessionDate === date.toDateString();
      });
      const totalCalories = sessions.reduce((sum, s) => sum + s.caloriesBurned, 0);
      const totalMinutes = sessions.reduce((sum, s) => sum + Math.round(s.duration / 60), 0);
      last7Days.push({
        day: dayStr,
        calories: totalCalories,
        minutes: totalMinutes,
        workouts: sessions.length,
      });
    }
    return last7Days;
  }, [workoutSessions]);

  const totalWeeklyStats = React.useMemo(() => {
    return weeklyData.reduce(
      (acc, day) => ({
        calories: acc.calories + day.calories,
        minutes: acc.minutes + day.minutes,
        workouts: acc.workouts + day.workouts,
      }),
      { calories: 0, minutes: 0, workouts: 0 }
    );
  }, [weeklyData]);

  const maxCalories = Math.max(...weeklyData.map((d) => d.calories), 100);

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.summaryCard}>
          <Text style={styles.cardTitle}>本周总结</Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{totalWeeklyStats.workouts}</Text>
              <Text style={styles.summaryLabel}>次运动</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{totalWeeklyStats.minutes}</Text>
              <Text style={styles.summaryLabel}>分钟</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{totalWeeklyStats.calories}</Text>
              <Text style={styles.summaryLabel}>卡路里</Text>
            </View>
          </View>
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.cardTitle}>每日卡路里消耗</Text>
          <View style={styles.chart}>
            {weeklyData.map((day, index) => (
              <View key={index} style={styles.barContainer}>
                <View style={styles.barWrapper}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: `${Math.max((day.calories / maxCalories) * 100, 5)}%`,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.barLabel}>{day.day}</Text>
                <Text style={styles.barValue}>{day.calories}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.todayCard}>
          <Text style={styles.cardTitle}>今日数据</Text>
          <View style={styles.todayGrid}>
            <View style={styles.todayItem}>
              <Text style={styles.todayIcon}>👣</Text>
              <Text style={styles.todayValue}>{dailyStats?.steps || 0}</Text>
              <Text style={styles.todayLabel}>步数</Text>
            </View>
            <View style={styles.todayItem}>
              <Text style={styles.todayIcon}>🔥</Text>
              <Text style={styles.todayValue}>{dailyStats?.caloriesBurned || 0}</Text>
              <Text style={styles.todayLabel}>卡路里</Text>
            </View>
            <View style={styles.todayItem}>
              <Text style={styles.todayIcon}>⏱️</Text>
              <Text style={styles.todayValue}>{dailyStats?.activeMinutes || 0}</Text>
              <Text style={styles.todayLabel}>活动分钟</Text>
            </View>
            <View style={styles.todayItem}>
              <Text style={styles.todayIcon}>💧</Text>
              <Text style={styles.todayValue}>{dailyStats?.waterIntake || 0}</Text>
              <Text style={styles.todayLabel}>杯水</Text>
            </View>
          </View>
        </View>

        <View style={styles.goalsCard}>
          <Text style={styles.cardTitle}>目标进度</Text>
          {fitnessGoals.filter((g) => !g.isCompleted).length === 0 ? (
            <Text style={styles.emptyText}>暂无进行中的目标</Text>
          ) : (
            fitnessGoals
              .filter((g) => !g.isCompleted)
              .slice(0, 3)
              .map((goal) => {
                const progress = Math.min(
                  100,
                  (goal.currentValue / goal.targetValue) * 100
                );
                return (
                  <View key={goal.id} style={styles.goalItem}>
                    <View style={styles.goalHeader}>
                      <Text style={styles.goalType}>
                        {goal.type === 'weight_loss'
                          ? '减重'
                          : goal.type === 'muscle_gain'
                          ? '增肌'
                          : goal.type === 'endurance'
                          ? '耐力'
                          : goal.type === 'flexibility'
                          ? '柔韧性'
                          : '综合健康'}
                      </Text>
                      <Text style={styles.goalProgress}>{progress.toFixed(0)}%</Text>
                    </View>
                    <View style={styles.progressBar}>
                      <View
                        style={[styles.progressFill, { width: `${progress}%` }]}
                      />
                    </View>
                  </View>
                );
              })
          )}
        </View>

        <View style={styles.tipsCard}>
          <Text style={styles.cardTitle}>💡 健康小贴士</Text>
          <Text style={styles.tipText}>
            • 每天保持30分钟以上的中等强度运动{'\n'}
            • 运动前后记得拉伸热身{'\n'}
            • 保持充足的睡眠（7-8小时）{'\n'}
            • 每天饮水量建议8杯以上
          </Text>
        </View>
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
  summaryCard: {
    backgroundColor: '#4CAF50',
    margin: 16,
    borderRadius: 16,
    padding: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    marginTop: 4,
  },
  chartCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 20,
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 150,
    paddingTop: 20,
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
  },
  barWrapper: {
    width: 24,
    height: 100,
    backgroundColor: '#e0e0e0',
    borderRadius: 12,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  bar: {
    width: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 12,
  },
  barLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
  },
  barValue: {
    fontSize: 10,
    color: '#999',
    marginTop: 2,
  },
  todayCard: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 16,
    padding: 20,
  },
  todayGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  todayItem: {
    width: '48%',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  todayIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  todayValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  todayLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  goalsCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 20,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingVertical: 20,
  },
  goalItem: {
    marginBottom: 16,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  goalType: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  goalProgress: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  tipsCard: {
    backgroundColor: '#E3F2FD',
    margin: 16,
    borderRadius: 16,
    padding: 20,
  },
  tipText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 24,
  },
});
