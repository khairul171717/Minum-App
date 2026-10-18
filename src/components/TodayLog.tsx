import { StyleSheet, View, Text, Pressable } from 'react-native';
import Animated, { FadeInDown, FadeOutRight } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import type { WaterLog } from '@/types';
import { Spacing, BorderRadius, FontSize } from '@/constants/theme';
import { useThemeColor } from '@/hooks/useThemeColor';
import { formatTime } from '@/db/database';
import { GlassIcon } from './GlassIcon';
import { WaterDropIcon } from './WaterDropIcon';

interface TodayLogProps {
  logs: WaterLog[];
  onDelete: (id: number) => void;
}

function LogItem({
  log,
  onDelete,
  colors,
}: {
  log: WaterLog;
  onDelete: (id: number) => void;
  colors: ReturnType<typeof useThemeColor>;
}) {
  const glassType =
    log.amount_ml <= 150 ? 150 : log.amount_ml >= 500 ? 500 : 250;

  return (
    <Animated.View
      entering={FadeInDown.duration(300)}
      exiting={FadeOutRight.duration(200)}
      style={[
        styles.logItem,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
    >
      <View style={styles.iconContainer}>
        <GlassIcon type={glassType} size={32} />
      </View>
      <View style={styles.logInfo}>
        <Text style={[styles.logAmount, { color: colors.text }]}>
          {log.amount_ml}ml
        </Text>
        <Text style={[styles.logTime, { color: colors.textSecondary }]}>
          {formatTime(log.timestamp)}
        </Text>
      </View>
      <Pressable
        onPress={() => onDelete(log.id)}
        style={styles.deleteButton}
        hitSlop={10}
      >
        <Ionicons name="trash-outline" size={18} color="#EF5350" />
      </Pressable>
    </Animated.View>
  );
}

export function TodayLog({ logs, onDelete }: TodayLogProps) {
  const colors = useThemeColor();

  if (logs.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconWrapper}>
          <WaterDropIcon size={48} />
        </View>
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          Belum ada catatan hari ini
        </Text>
        <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
          Tekan gelas di atas untuk mulai mencatat
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.textSecondary }]}>
        Riwayat Hari Ini
      </Text>
      {logs.map((log) => (
        <LogItem key={log.id} log={log} onDelete={onDelete} colors={colors} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
  },
  title: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  logItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    gap: Spacing.md,
  },
  iconContainer: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logInfo: {
    flex: 1,
  },
  logAmount: {
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  logTime: {
    fontSize: FontSize.xs,
    marginTop: 2,
  },
  deleteButton: {
    padding: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
    gap: Spacing.sm,
  },
  emptyIconWrapper: {
    marginBottom: Spacing.xs,
    opacity: 0.85,
  },
  emptyText: {
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: FontSize.sm,
  },
});
