import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useHealthStore } from '../store/healthStore';

export default function ProfileScreen() {
  const { userProfile, updateUserProfile } = useHealthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: userProfile?.name || '',
    age: userProfile?.age?.toString() || '',
    gender: userProfile?.gender || 'male',
    height: userProfile?.height?.toString() || '',
    weight: userProfile?.weight?.toString() || '',
    restingHeartRate: userProfile?.restingHeartRate?.toString() || '',
  });

  const handleSave = () => {
    if (!formData.name || !formData.age || !formData.height || !formData.weight) {
      Alert.alert('错误', '请填写所有必填字段');
      return;
    }

    updateUserProfile({
      id: userProfile?.id || Date.now().toString(),
      name: formData.name,
      age: parseInt(formData.age),
      gender: formData.gender as 'male' | 'female' | 'other',
      height: parseFloat(formData.height),
      weight: parseFloat(formData.weight),
      restingHeartRate: formData.restingHeartRate
        ? parseInt(formData.restingHeartRate)
        : undefined,
      createdAt: userProfile?.createdAt || new Date(),
      updatedAt: new Date(),
    });

    setIsEditing(false);
    Alert.alert('成功', '个人资料已更新');
  };

  const calculateBMI = () => {
    if (userProfile?.height && userProfile?.weight) {
      const heightInMeters = userProfile.height / 100;
      const bmi = userProfile.weight / (heightInMeters * heightInMeters);
      return bmi.toFixed(1);
    }
    return '--';
  };

  const getBMIStatus = () => {
    const bmi = parseFloat(calculateBMI());
    if (isNaN(bmi)) return { text: '未知', color: '#999' };
    if (bmi < 18.5) return { text: '偏瘦', color: '#2196F3' };
    if (bmi < 24) return { text: '正常', color: '#4CAF50' };
    if (bmi < 28) return { text: '超重', color: '#FF9800' };
    return { text: '肥胖', color: '#F44336' };
  };

  const bmiStatus = getBMIStatus();

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {userProfile?.name?.charAt(0) || '?'}
            </Text>
          </View>
          <Text style={styles.userName}>{userProfile?.name || '未设置姓名'}</Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setIsEditing(!isEditing)}
          >
            <Text style={styles.editButtonText}>
              {isEditing ? '取消' : '编辑资料'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bmiCard}>
          <Text style={styles.cardTitle}>BMI 指数</Text>
          <View style={styles.bmiContent}>
            <Text style={styles.bmiValue}>{calculateBMI()}</Text>
            <Text style={[styles.bmiStatus, { color: bmiStatus.color }]}>
              {bmiStatus.text}
            </Text>
          </View>
          <Text style={styles.bmiHint}>
            BMI = 体重(kg) / 身高(m)²
          </Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.cardTitle}>基本信息</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>姓名 *</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              editable={isEditing}
              placeholder="请输入姓名"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>年龄 *</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={formData.age}
              onChangeText={(text) => setFormData({ ...formData, age: text })}
              editable={isEditing}
              keyboardType="numeric"
              placeholder="请输入年龄"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>性别</Text>
            <View style={styles.genderRow}>
              {(['male', 'female', 'other'] as const).map((g) => (
                <TouchableOpacity
                  key={g}
                  style={[
                    styles.genderButton,
                    formData.gender === g && styles.genderButtonActive,
                  ]}
                  onPress={() => isEditing && setFormData({ ...formData, gender: g })}
                  disabled={!isEditing}
                >
                  <Text
                    style={[
                      styles.genderButtonText,
                      formData.gender === g && styles.genderButtonTextActive,
                    ]}
                  >
                    {g === 'male' ? '男' : g === 'female' ? '女' : '其他'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>身高 (cm) *</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={formData.height}
              onChangeText={(text) => setFormData({ ...formData, height: text })}
              editable={isEditing}
              keyboardType="numeric"
              placeholder="请输入身高"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>体重 (kg) *</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={formData.weight}
              onChangeText={(text) => setFormData({ ...formData, weight: text })}
              editable={isEditing}
              keyboardType="numeric"
              placeholder="请输入体重"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>静息心率 (bpm)</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={formData.restingHeartRate}
              onChangeText={(text) =>
                setFormData({ ...formData, restingHeartRate: text })
              }
              editable={isEditing}
              keyboardType="numeric"
              placeholder="请输入静息心率"
            />
          </View>

          {isEditing && (
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>保存</Text>
            </TouchableOpacity>
          )}
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
  profileHeader: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#4CAF50',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 12,
  },
  editButton: {
    marginTop: 12,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  bmiCard: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  bmiContent: {
    alignItems: 'center',
  },
  bmiValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333',
  },
  bmiStatus: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 8,
  },
  bmiHint: {
    fontSize: 12,
    color: '#999',
    marginTop: 12,
  },
  formCard: {
    backgroundColor: '#fff',
    margin: 16,
    marginTop: 0,
    borderRadius: 16,
    padding: 20,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  inputDisabled: {
    backgroundColor: '#f5f5f5',
  },
  genderRow: {
    flexDirection: 'row',
    gap: 12,
  },
  genderButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center',
  },
  genderButtonActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  genderButtonText: {
    color: '#666',
  },
  genderButtonTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
