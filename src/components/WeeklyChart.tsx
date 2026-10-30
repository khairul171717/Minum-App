import { StyleSheet, View, Text } from 'react-native';
import Animated, { FadeInUp, useSharedValue, useAnimatedStyle, withTiming, withDelay } from 'react-native-reanimated';
import { useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import type { DailyStats } from '@/types';
import { Spacing, BorderRadius, FontSize, WaterColors } from '@/constants/theme';
import { useThemeColor } from '@/hooks/useThemeColor';

interface WeeklyChartProps {
  stats: DailyStats[];
  dailyGoal: number;
}

const DAY_NAMES = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

function BarItem({
  stat,
  maxHeight,
  maxValue,
  index,
  isToday,
  goalReached,
  colors,
}: {
  stat: DailyStats;
  maxHeight: number;
  maxValue: number;
  index: number;
  isToday: boolean;
  goalReached: boolean;
  colors: ReturnType<typeof useThemeColor>;
}) {
  const height = useSharedValue(0);
  const targetHeight = maxValue > 0 ? (stat.total_ml / maxValue) * maxHeight : 0;

  useEffect(() => {
    height.value = withDelay(
      index * 100,
      withTiming(Math.max(targetHeight, 4), { duration: 600 })
    );
  }, [targetHeight, index, height]);

  const animatedStyle = useAnimatedStyle(() => ({
    height: height.value,
  }));

  let dayName = '';
  try {
    const parts = (stat.date || '').split('-').map(Number);
    const date =
      parts.length === 3
        ? new Date(parts[0], parts[1] - 1, parts[2])
        : new Date(stat.date);
    dayName = !isNaN(date.getTime()) ? DAY_NAMES[date.getDay()] : '-';
  } catch {
    dayName = '-';
  }

  return (
    <View style={styles.barWrapper}>
      <Text style={[styles.barValue, { color: colors.textSecondary }]}>
        {stat.total_ml > 0 ? `${Math.round(stat.total_ml / 100)}` : ''}
      </Text>
      <View style={[styles.barTrack, { backgroundColor: colors.progressTrack, height: maxHeight }]}>
        <Animated.View
          style={[
            styles.barFill,
            {
              backgroundColor: goalReached ? WaterColors.success : WaterColors.primary,
            },
            animatedStyle,
          ]}
        />
      </View>
      <Text
        style={[
          styles.dayLabel,
          {
            color: isToday ? WaterColors.primary : colors.textSecondary,
            fontWeight: isToday ? '700' : '500',
          },
        ]}
      >
        {dayName}
      </Text>
    </View>
  );
}

export function WeeklyChart({ stats = [], dailyGoal = 2000 }: WeeklyChartProps) {
  const colors = useThemeColor();
  const maxHeight = 120;
  const statAmounts = stats && stats.length > 0 ? stats.map((s) => s.total_ml || 0) : [0];
  const maxValue = Math.max(...statAmounts, dailyGoal || 2000, 1);
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  return (
    <Animated.View
      entering={FadeInUp.duration(400)}
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
    >
      <View style={styles.headerRow}>
        <Ionicons
          name="bar-chart-outline"
          size={20}
          color={WaterColors.primaryDark}
        />
        <Text style={[styles.title, { color: colors.text }]}>Minggu Ini</Text>
      </View>

      <View style={styles.chartContainer}>
        {/* Goal line */}
        <View
          style={[
            styles.goalLine,
            {
              bottom: maxValue > 0 ? (dailyGoal / maxValue) * maxHeight : 0,
              borderColor: WaterColors.secondary,
            },
          ]}
        >
          <Text style={[styles.goalText, { color: WaterColors.secondary }]}>
            Target
          </Text>
        </View>

        <View style={styles.barsRow}>
          {stats.map((stat, index) => (
            <BarItem
              key={stat.date}
              stat={stat}
              maxHeight={maxHeight}
              maxValue={maxValue}
              index={index}
              isToday={stat.date === todayStr}
              goalReached={stat.total_ml >= dailyGoal}
              colors={colors}
            />
          ))}
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Spacing.lg,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
  chartContainer: {
    position: 'relative',
  },
  barsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingTop: Spacing.lg,
  },
  barWrapper: {
    alignItems: 'center',
    flex: 1,
    gap: Spacing.xs,
  },
  barTrack: {
    width: 28,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  barFill: {
    width: '100%',
    borderRadius: BorderRadius.sm,
    minHeight: 4,
  },
  barValue: {
    fontSize: FontSize.xs,
    fontWeight: '500',
  },
  dayLabel: {
    fontSize: FontSize.xs,
  },
  goalLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    borderTopWidth: 1.5,
    borderStyle: 'dashed',
    zIndex: 1,
  },
  goalText: {
    position: 'absolute',
    right: 0,
    top: -16,
    fontSize: 10,
    fontWeight: '600',
  },
});
