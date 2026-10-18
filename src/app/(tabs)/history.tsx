import { StyleSheet, ScrollView, View, Text, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCallback, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { WeeklyChart } from '@/components/WeeklyChart';
import { useWaterStats } from '@/hooks/useWaterIntake';
import { useSettings } from '@/hooks/useSettings';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Spacing, FontSize, WaterColors, BorderRadius } from '@/constants/theme';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function HistoryScreen() {
  const colors = useThemeColor();
  const { weeklyStats, monthlyStats, refresh } = useWaterStats();
  const { settings } = useSettings();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }, [refresh]);

  // Calculate stats
  const totalWeekly = weeklyStats.reduce((sum, s) => sum + s.total_ml, 0);
  const avgWeekly =
    weeklyStats.length > 0 ? Math.round(totalWeekly / weeklyStats.length) : 0;
  const daysGoalMet = weeklyStats.filter(
    (s) => s.total_ml >= settings.daily_goal_ml
  ).length;
  const bestDay = weeklyStats.reduce(
    (best, s) => (s.total_ml > best.total_ml ? s : best),
    { total_ml: 0, date: '', entries_count: 0 }
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={WaterColors.primary}
              colors={[WaterColors.primary]}
            />
          }
        >
          {/* Header */}
          <Animated.View
            entering={FadeInDown.delay(100).duration(400)}
            style={styles.header}
          >
            <View style={styles.titleRow}>
              <Ionicons
                name="stats-chart"
                size={26}
                color={WaterColors.primaryDark}
              />
              <Text style={[styles.title, { color: colors.text }]}>
                Riwayat &amp; Statistik
              </Text>
            </View>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Pantau konsistensi dan capaian hidrasimu
            </Text>
          </Animated.View>

          {/* Stats Cards */}
          <Animated.View
            entering={FadeInDown.delay(200).duration(400)}
            style={styles.statsGrid}
          >
            {/* Average */}
            <View
              style={[
                styles.statCard,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <View
                style={[
                  styles.statIconBadge,
                  { backgroundColor: '#E0F2FE' },
                ]}
              >
                <Ionicons
                  name="water"
                  size={18}
                  color={WaterColors.primaryDark}
                />
              </View>
              <Text style={[styles.statValue, { color: colors.text }]}>
                {avgWeekly}ml
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Rata-rata/hari
              </Text>
            </View>

            {/* Target Met */}
            <View
              style={[
                styles.statCard,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <View
                style={[
                  styles.statIconBadge,
                  { backgroundColor: '#FEF3C7' },
                ]}
              >
                <Ionicons name="trophy" size={18} color="#D97706" />
              </View>
              <Text style={[styles.statValue, { color: colors.text }]}>
                {daysGoalMet}/7
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Target Tercapai
              </Text>
            </View>

            {/* Best Day */}
            <View
              style={[
                styles.statCard,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <View
                style={[
                  styles.statIconBadge,
                  { backgroundColor: '#CCFBF1' },
                ]}
              >
                <Ionicons name="sparkles" size={18} color="#0D9488" />
              </View>
              <Text style={[styles.statValue, { color: colors.text }]}>
                {bestDay.total_ml}ml
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Rekor Terbaik
              </Text>
            </View>
          </Animated.View>

          {/* Weekly Chart */}
          <Animated.View entering={FadeInDown.delay(300).duration(400)}>
            <WeeklyChart
              stats={weeklyStats}
              dailyGoal={settings.daily_goal_ml}
            />
          </Animated.View>

          {/* Monthly Summary */}
          <Animated.View
            entering={FadeInDown.delay(400).duration(400)}
            style={[
              styles.monthlySection,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <View style={styles.sectionHeaderRow}>
              <Ionicons
                name="calendar-outline"
                size={20}
                color={WaterColors.primaryDark}
              />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                30 Hari Terakhir
              </Text>
            </View>
            {monthlyStats.length > 0 ? (
              <View style={styles.monthlyGrid}>
                {monthlyStats.map((stat) => {
                  const percentage =
                    settings.daily_goal_ml > 0
                      ? Math.min(stat.total_ml / settings.daily_goal_ml, 1)
                      : 0;
                  return (
                    <View
                      key={stat.date}
                      style={[
                        styles.monthlyDot,
                        {
                          backgroundColor:
                            percentage >= 1
                              ? WaterColors.success
                              : percentage >= 0.5
                              ? WaterColors.primary
                              : percentage > 0
                              ? WaterColors.ripple
                              : colors.progressTrack,
                        },
                      ]}
                    />
                  );
                })}
              </View>
            ) : null}
            <View style={styles.legendRow}>
              <View style={styles.legendItem}>
                <View
                  style={[
                    styles.legendDot,
                    { backgroundColor: colors.progressTrack },
                  ]}
                />
                <Text
                  style={[styles.legendText, { color: colors.textSecondary }]}
                >
                  Kosong
                </Text>
              </View>
              <View style={styles.legendItem}>
                <View
                  style={[
                    styles.legendDot,
                    { backgroundColor: WaterColors.ripple },
                  ]}
                />
                <Text
                  style={[styles.legendText, { color: colors.textSecondary }]}
                >
                  &lt;50%
                </Text>
              </View>
              <View style={styles.legendItem}>
                <View
                  style={[
                    styles.legendDot,
                    { backgroundColor: WaterColors.primary },
                  ]}
                />
                <Text
                  style={[styles.legendText, { color: colors.textSecondary }]}
                >
                  &lt;100%
                </Text>
              </View>
              <View style={styles.legendItem}>
                <Ionicons
                  name="checkmark-circle"
                  size={12}
                  color={WaterColors.success}
                />
                <Text
                  style={[styles.legendText, { color: colors.textSecondary }]}
                >
                  Target
                </Text>
              </View>
            </View>
          </Animated.View>

          <View style={styles.bottomPadding} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: FontSize.md,
    marginTop: Spacing.xs,
  },
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xs,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    gap: Spacing.xs,
  },
  statIconBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: FontSize.md,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: FontSize.xs - 1,
    textAlign: 'center',
    fontWeight: '600',
  },
  monthlySection: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
  monthlyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: Spacing.md,
  },
  monthlyDot: {
    width: 18,
    height: 18,
    borderRadius: 4,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: Spacing.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 2,
  },
  legendText: {
    fontSize: FontSize.xs,
    fontWeight: '500',
  },
  bottomPadding: {
    height: Spacing.xxl,
  },
});
