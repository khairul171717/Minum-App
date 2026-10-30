import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Spacing, FontSize, WaterColors, BorderRadius } from '@/constants/theme';
import { useThemeColor } from '@/hooks/useThemeColor';

interface WeightWaterCalculatorProps {
  currentWeightKg?: number;
  currentActivityLevel?: 'low' | 'normal' | 'high';
  currentDailyGoal: number;
  onApplyGoal: (
    weightKg: number,
    activityLevel: 'low' | 'normal' | 'high'
  ) => Promise<number>;
}

const QUICK_WEIGHTS = [50, 55, 60, 65, 70, 75, 80];

const ACTIVITY_OPTIONS: {
  id: 'low' | 'normal' | 'high';
  label: string;
  sublabel: string;
  multiplier: number;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  {
    id: 'low',
    label: 'Santai',
    sublabel: '30 ml/kg (Minim gerak)',
    multiplier: 30,
    icon: 'cafe-outline',
  },
  {
    id: 'normal',
    label: 'Normal',
    sublabel: '35 ml/kg (Aktivitas biasa)',
    multiplier: 35,
    icon: 'walk-outline',
  },
  {
    id: 'high',
    label: 'Aktif',
    sublabel: '40 ml/kg (Olahraga/panas)',
    multiplier: 40,
    icon: 'fitness-outline',
  },
];

export function WeightWaterCalculator({
  currentWeightKg = 60,
  currentActivityLevel = 'normal',
  currentDailyGoal,
  onApplyGoal,
}: WeightWaterCalculatorProps) {
  const colors = useThemeColor();
  const [weightText, setWeightText] = useState(String(currentWeightKg || 60));
  const [activity, setActivity] = useState<'low' | 'normal' | 'high'>(
    currentActivityLevel || 'normal'
  );
  const [applying, setApplying] = useState(false);

  // Safe numerical parse
  const numericWeight = parseFloat(weightText.replace(',', '.')) || 0;
  const activeOption =
    ACTIVITY_OPTIONS.find((opt) => opt.id === activity) || ACTIVITY_OPTIONS[1];

  // Health standard calculation: Weight (kg) * Multiplier (ml/kg)
  const rawGoal =
    numericWeight > 0 ? Math.round(numericWeight * activeOption.multiplier) : 0;
  // Round to nearest 50ml
  const calculatedGoal = Math.round(rawGoal / 50) * 50;
  const estimatedGlasses =
    calculatedGoal > 0 ? Math.round((calculatedGoal / 250) * 10) / 10 : 0;

  const isCurrentTarget =
    calculatedGoal > 0 && calculatedGoal === currentDailyGoal;

  const handleWeightChange = (text: string) => {
    // Only allow numbers and decimal dot
    const cleaned = text.replace(/[^0-9.]/g, '');
    setWeightText(cleaned);
  };

  const adjustWeight = (delta: number) => {
    const current = parseFloat(weightText.replace(',', '.')) || 60;
    const next = Math.max(25, Math.min(250, current + delta));
    setWeightText(String(Math.round(next * 10) / 10));
    try {
      Haptics.selectionAsync();
    } catch {}
  };

  const handleApply = async () => {
    if (numericWeight < 20 || numericWeight > 300) {
      Alert.alert(
        'Berat Badan Tidak Valid',
        'Silakan masukkan berat badan yang sesuai (antara 20 kg - 300 kg).'
      );
      return;
    }

    setApplying(true);
    try {
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch {}

      const applied = await onApplyGoal(numericWeight, activity);
      Alert.alert(
        'Target Harian Diperbarui! 🎯',
        `Kebutuhan air harianmu diatur ke ${applied} ml (${estimatedGlasses} gelas) berdasarkan berat badan ${numericWeight} kg (${activeOption.label}).`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Failed to apply goal:', error);
      Alert.alert('Gagal', 'Terjadi kesalahan saat menyimpan target harian.');
    } finally {
      setApplying(false);
    }
  };

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      {/* Title */}
      <View style={styles.headerRow}>
        <View style={styles.iconCircle}>
          <Ionicons name="calculator-outline" size={20} color={WaterColors.primaryDark} />
        </View>
        <View style={styles.headerTextCol}>
          <Text style={[styles.title, { color: colors.text }]}>
            Kalkulator Berat Badan
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Hitung kebutuhan air ideal sesuai panduan medis Kemenkes/WHO
          </Text>
        </View>
      </View>

      {/* Weight Input Box */}
      <View style={styles.inputSection}>
        <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
          Berat Badan Kamu (kg)
        </Text>
        <View
          style={[
            styles.inputRow,
            { backgroundColor: colors.background, borderColor: colors.border },
          ]}
        >
          <Pressable
            onPress={() => adjustWeight(-1)}
            style={({ pressed }) => [
              styles.stepButton,
              { opacity: pressed ? 0.6 : 1 },
            ]}
            hitSlop={8}
          >
            <Ionicons name="remove" size={22} color={WaterColors.primaryDark} />
          </Pressable>

          <View style={styles.inputWrapper}>
            <TextInput
              value={weightText}
              onChangeText={handleWeightChange}
              keyboardType={Platform.OS === 'ios' ? 'decimal-pad' : 'numeric'}
              style={[styles.textInput, { color: colors.text }]}
              placeholder="60"
              placeholderTextColor={colors.textSecondary}
              maxLength={5}
            />
            <Text style={[styles.unitText, { color: colors.textSecondary }]}>
              kg
            </Text>
          </View>

          <Pressable
            onPress={() => adjustWeight(1)}
            style={({ pressed }) => [
              styles.stepButton,
              { opacity: pressed ? 0.6 : 1 },
            ]}
            hitSlop={8}
          >
            <Ionicons name="add" size={22} color={WaterColors.primaryDark} />
          </Pressable>
        </View>

        {/* Quick Weight Chips */}
        <View style={styles.chipsRow}>
          {QUICK_WEIGHTS.map((w) => {
            const isSelected = Math.round(numericWeight) === w;
            return (
              <Pressable
                key={w}
                onPress={() => {
                  setWeightText(String(w));
                  try {
                    Haptics.selectionAsync();
                  } catch {}
                }}
                style={[
                  styles.chip,
                  {
                    backgroundColor: isSelected
                      ? WaterColors.primary
                      : colors.background,
                    borderColor: isSelected
                      ? WaterColors.primary
                      : colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.chipText,
                    {
                      color: isSelected ? '#FFFFFF' : colors.textSecondary,
                      fontWeight: isSelected ? '700' : '500',
                    },
                  ]}
                >
                  {w}kg
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Activity Level Selector */}
      <View style={styles.activitySection}>
        <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
          Tingkat Aktivitas Harian
        </Text>
        <View style={styles.activityRow}>
          {ACTIVITY_OPTIONS.map((opt) => {
            const isSelected = activity === opt.id;
            return (
              <Pressable
                key={opt.id}
                onPress={() => {
                  setActivity(opt.id);
                  try {
                    Haptics.selectionAsync();
                  } catch {}
                }}
                style={[
                  styles.activityCard,
                  {
                    backgroundColor: isSelected
                      ? '#E0F2FE'
                      : colors.background,
                    borderColor: isSelected
                      ? WaterColors.primary
                      : colors.border,
                  },
                ]}
              >
                <Ionicons
                  name={opt.icon}
                  size={20}
                  color={
                    isSelected ? WaterColors.primaryDark : colors.textSecondary
                  }
                />
                <Text
                  style={[
                    styles.activityLabel,
                    {
                      color: isSelected
                        ? WaterColors.primaryDark
                        : colors.text,
                      fontWeight: isSelected ? '700' : '600',
                    },
                  ]}
                >
                  {opt.label}
                </Text>
                <Text
                  style={[
                    styles.activitySublabel,
                    { color: colors.textSecondary },
                  ]}
                  numberOfLines={1}
                >
                  {opt.multiplier}ml/kg
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Calculation Result Banner */}
      {numericWeight > 0 ? (
        <View style={styles.resultBanner}>
          <View style={styles.resultContent}>
            <Text style={styles.resultFormula}>
              {numericWeight} kg × {activeOption.multiplier} ml/kg =
            </Text>
            <View style={styles.resultValueRow}>
              <Text style={styles.resultValue}>
                {calculatedGoal.toLocaleString('id-ID')}
              </Text>
              <Text style={styles.resultUnit}>ml/hari</Text>
            </View>
            <Text style={styles.resultGlasses}>
              Setara dengan ± {estimatedGlasses} gelas air (ukuran 250ml)
            </Text>
          </View>
        </View>
      ) : null}

      {/* Apply Button */}
      <Pressable
        onPress={handleApply}
        disabled={applying || numericWeight <= 0}
        style={({ pressed }) => [
          styles.applyButton,
          {
            backgroundColor: isCurrentTarget
              ? '#10B981'
              : WaterColors.primary,
            opacity: pressed || applying || numericWeight <= 0 ? 0.75 : 1,
          },
        ]}
      >
        <Ionicons
          name={isCurrentTarget ? 'checkmark-circle' : 'checkmark-done'}
          size={18}
          color="#FFFFFF"
        />
        <Text style={styles.applyButtonText}>
          {isCurrentTarget
            ? 'Sudah Menjadi Acuan Harian'
            : 'Gunakan Sebagai Acuan Harian'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: Spacing.md,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTextCol: {
    flex: 1,
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: FontSize.xs,
    marginTop: 2,
    lineHeight: 16,
  },
  inputSection: {
    marginBottom: Spacing.md,
  },
  inputLabel: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.xs,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
  },
  stepButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  textInput: {
    fontSize: FontSize.xxl,
    fontWeight: '800',
    textAlign: 'center',
    minWidth: 70,
    padding: 0,
  },
  unitText: {
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: Spacing.sm,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  chipText: {
    fontSize: FontSize.xs,
  },
  activitySection: {
    marginBottom: Spacing.md,
  },
  activityRow: {
    flexDirection: 'row',
    gap: 8,
  },
  activityCard: {
    flex: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: 6,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    alignItems: 'center',
    gap: 2,
  },
  activityLabel: {
    fontSize: FontSize.sm,
    marginTop: 2,
  },
  activitySublabel: {
    fontSize: 10,
  },
  resultBanner: {
    backgroundColor: '#F0F9FF',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  resultContent: {
    alignItems: 'center',
  },
  resultFormula: {
    fontSize: FontSize.xs,
    color: '#0284C7',
    fontWeight: '600',
  },
  resultValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    marginVertical: 2,
  },
  resultValue: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0369A1',
  },
  resultUnit: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: '#0284C7',
  },
  resultGlasses: {
    fontSize: FontSize.xs,
    color: '#0369A1',
    fontWeight: '500',
  },
  applyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: 8,
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: FontSize.md,
    fontWeight: '700',
  },
});
