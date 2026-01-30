import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useHealthStore } from '../store/healthStore';
import { FitnessGoal } from '../types';

const goalTypes = [
  { key: 'weight_loss', label: '减重', icon: '⚖️', unit: 'kg' },
  { key: 'muscle_gain', label: '增肌', icon: '💪', unit: 'kg' },
  { key: 'endurance', label: '耐力', icon: '🏃', unit: '分钟' },
  { key: 'flexibility', label: '柔韧性', icon: '🧘', unit: '天' },
  { key: 'general_health', label: '综合健康', icon: '❤️', unit: '分' },
];

export default function GoalsScreen() {
  const { fitnessGoals, addFitnessGoal, updateFitnessGoal, deleteFitnessGoal } =
    useHealthStore();
  const [showModal, setShowModal] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('weight_loss');
  const [targetValue, setTargetValue] = useState('');
  const [currentValue, setCurrentValue] = useState('');

  const handleAddGoal = () => {
    if (!targetValue || !currentValue) {
      Alert.alert('错误', '请填写所有字段');
      return;
    }

    const goalType = goalTypes.find((t) => t.key === selectedType);
    const newGoal: FitnessGoal = {
      id: Date.now().toString(),
      type: selectedType as FitnessGoal['type'],
      targetValue: parseFloat(targetValue),
      currentValue: parseFloat(currentValue),
      unit: goalType?.unit || '',
      startDate: new Date(),
      targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      isCompleted: false,
    };

    addFitnessGoal(newGoal);
    setShowModal(false);
    setTargetValue('');
    setCurrentValue('');
    Alert.alert('成功', '目标已添加');
  };

  const handleCompleteGoal = (goalId: string) => {
    Alert.alert('完成目标', '确定要标记此目标为已完成吗？', [
      { text: '取消', style: 'cancel' },
      {
        text: '确定',
        onPress: () => {
          const goal = fitnessGoals.find((g) => g.id === goalId);
          if (goal) {
            updateFitnessGoal({ ...goal, isCompleted: true });
          }
        },
      },
    ]);
  };

  const handleDeleteGoal = (goalId: string) => {
    Alert.alert('删除目标', '确定要删除此目标吗？', [
      { text: '取消', style: 'cancel' },
      {
        text: '删除',
        style: 'destructive',
        onPress: () => deleteFitnessGoal(goalId),
      },
    ]);
  };

  const getProgress = (goal: FitnessGoal) => {
    if (goal.type === 'weight_loss') {
      const startValue = goal.currentValue + (goal.targetValue - goal.currentValue);
      const lost = startValue - goal.currentValue;
      const target = startValue - goal.targetValue;
      return Math.min(100, Math.max(0, (lost / target) * 100));
    }
    return Math.min(100, (goal.currentValue / goal.targetValue) * 100);
  };

  const activeGoals = fitnessGoals.filter((g) => !g.isCompleted);
  const completedGoals = fitnessGoals.filter((g) => g.isCompleted);

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>我的健身目标</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowModal(true)}
          >
            <Text style={styles.addButtonText}>+ 添加目标</Text>
          </TouchableOpacity>
        </View>

        {activeGoals.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🎯</Text>
            <Text style={styles.emptyText}>还没有设置目标</Text>
            <Text style={styles.emptySubtext}>点击上方按钮添加你的第一个健身目标</Text>
          </View>
        ) : (
          <View style={styles.goalsSection}>
            <Text style={styles.sectionTitle}>进行中</Text>
            {activeGoals.map((goal) => {
              const goalType = goalTypes.find((t) => t.key === goal.type);
              const progress = getProgress(goal);

              return (
                <View key={goal.id} style={styles.goalCard}>
                  <View style={styles.goalHeader}>
                    <Text style={styles.goalIcon}>{goalType?.icon}</Text>
                    <View style={styles.goalInfo}>
                      <Text style={styles.goalTitle}>{goalType?.label}</Text>
                      <Text style={styles.goalSubtitle}>
                        目标: {goal.targetValue} {goal.unit}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={styles.completeButton}
                      onPress={() => handleCompleteGoal(goal.id)}
                    >
                      <Text style={styles.completeButtonText}>✓</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                      <View
                        style={[styles.progressFill, { width: `${progress}%` }]}
                      />
                    </View>
                    <Text style={styles.progressText}>{progress.toFixed(0)}%</Text>
                  </View>

                  <View style={styles.goalFooter}>
                    <Text style={styles.currentValue}>
                      当前: {goal.currentValue} {goal.unit}
                    </Text>
                    <TouchableOpacity
                      onPress={() => handleDeleteGoal(goal.id)}
                    >
                      <Text style={styles.deleteText}>删除</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {completedGoals.length > 0 && (
          <View style={styles.goalsSection}>
            <Text style={styles.sectionTitle}>已完成</Text>
            {completedGoals.map((goal) => {
              const goalType = goalTypes.find((t) => t.key === goal.type);
              return (
                <View key={goal.id} style={[styles.goalCard, styles.completedCard]}>
                  <View style={styles.goalHeader}>
                    <Text style={styles.goalIcon}>{goalType?.icon}</Text>
                    <View style={styles.goalInfo}>
                      <Text style={styles.goalTitle}>{goalType?.label}</Text>
                      <Text style={styles.goalSubtitle}>
                        已完成 ✓
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      <Modal visible={showModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>添加新目标</Text>

            <Text style={styles.label}>选择目标类型</Text>
            <View style={styles.typeGrid}>
              {goalTypes.map((type) => (
                <TouchableOpacity
                  key={type.key}
                  style={[
                    styles.typeButton,
                    selectedType === type.key && styles.typeButtonActive,
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
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>
              目标值 ({goalTypes.find((t) => t.key === selectedType)?.unit})
            </Text>
            <TextInput
              style={styles.input}
              value={targetValue}
              onChangeText={setTargetValue}
              keyboardType="numeric"
              placeholder="请输入目标值"
            />

            <Text style={styles.label}>
              当前值 ({goalTypes.find((t) => t.key === selectedType)?.unit})
            </Text>
            <TextInput
              style={styles.input}
              value={currentValue}
              onChangeText={setCurrentValue}
              keyboardType="numeric"
              placeholder="请输入当前值"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.cancelButtonText}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleAddGoal}
              >
                <Text style={styles.confirmButtonText}>添加</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    padding: 48,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  goalsSection: {
    padding: 16,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 12,
  },
  goalCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  completedCard: {
    opacity: 0.7,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  goalIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  goalInfo: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  goalSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  completeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  progressBar: {
    flex: 1,
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
  progressText: {
    marginLeft: 12,
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
    width: 40,
  },
  goalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  currentValue: {
    fontSize: 14,
    color: '#666',
  },
  deleteText: {
    fontSize: 14,
    color: '#F44336',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    marginTop: 16,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeButton: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center',
    minWidth: 80,
  },
  typeButtonActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  typeIcon: {
    fontSize: 24,
  },
  typeLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  typeLabelActive: {
    color: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '600',
  },
  confirmButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
