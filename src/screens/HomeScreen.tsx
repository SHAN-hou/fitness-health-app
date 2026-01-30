import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useHealthStore } from '../store/healthStore';

export default function HomeScreen() {
  const { dailyStats, userProfile } = useHealthStore();

  const today = new Date().toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.greeting}>
            你好，{userProfile?.name || '用户'}！
          </Text>
          <Text style={styles.date}>{today}</Text>
        </View>

        <View style={styles.statsCard}>
          <Text style={styles.cardTitle}>今日概览</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{dailyStats?.steps || 0}</Text>
              <Text style={styles.statLabel}>步数</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{dailyStats?.caloriesBurned || 0}</Text>
              <Text style={styles.statLabel}>卡路里</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{dailyStats?.activeMinutes || 0}</Text>
              <Text style={styles.statLabel}>活动分钟</Text>
            </View>
          </View>
        </View>

        <View style={styles.quickActions}>
          <Text style={styles.cardTitle}>快速开始</Text>
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionIcon}>🏃</Text>
              <Text style={styles.actionText}>跑步</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionIcon}>🚴</Text>
              <Text style={styles.actionText}>骑行</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionIcon}>🧘</Text>
              <Text style={styles.actionText}>瑜伽</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionIcon}>💪</Text>
              <Text style={styles.actionText}>力量</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.remindersCard}>
          <Text style={styles.cardTitle}>健康提醒</Text>
          <View style={styles.reminderItem}>
            <Text style={styles.reminderIcon}>💧</Text>
            <View style={styles.reminderContent}>
              <Text style={styles.reminderTitle}>记得喝水</Text>
              <Text style={styles.reminderText}>保持水分摄入，建议每小时喝一杯水</Text>
            </View>
          </View>
          <View style={styles.reminderItem}>
            <Text style={styles.reminderIcon}>🚶</Text>
            <View style={styles.reminderContent}>
              <Text style={styles.reminderTitle}>起身活动</Text>
              <Text style={styles.reminderText}>久坐不利健康，每小时起身走动5分钟</Text>
            </View>
          </View>
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
  header: {
    padding: 20,
    backgroundColor: '#4CAF50',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  date: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    marginTop: 4,
  },
  statsCard: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  quickActions: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#f0f9f0',
  },
  actionIcon: {
    fontSize: 32,
  },
  actionText: {
    fontSize: 14,
    color: '#333',
    marginTop: 8,
  },
  remindersCard: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  reminderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  reminderIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  reminderContent: {
    flex: 1,
  },
  reminderTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  reminderText: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
});
