import { StyleSheet, ScrollView, View, Text, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCallback, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { WaterProgress } from '@/components/WaterProgress';
import { QuickAddBar } from '@/components/QuickAddBar';
import { TodayLog } from '@/components/TodayLog';
import { WaterDropIcon } from '@/components/WaterDropIcon';
import { useWaterIntake } from '@/hooks/useWaterIntake';
import { useSettings } from '@/hooks/useSettings';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Spacing, FontSize, WaterColors, BorderRadius } from '@/constants/theme';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function HomeScreen() {
  const colors = useThemeColor();
  const { todayTotal, todayLogs, addIntake, removeIntake, refresh } =
    useWaterIntake();
  const { settings } = useSettings();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }, [refresh]);

  const getGreetingData = () => {
    const hour = new Date().getHours();
    if (hour < 12)
      return { text: 'Selamat Pagi', icon: 'sunny-outline' as const };
    if (hour < 15)
      return { text: 'Selamat Siang', icon: 'partly-sunny-outline' as const };
    if (hour < 18)
      return { text: 'Selamat Sore', icon: 'cloudy-outline' as const };
    return { text: 'Selamat Malam', icon: 'moon-outline' as const };
  };

  const greeting = getGreetingData();

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
            <View>
              <View style={styles.greetingRow}>
                <Ionicons
                  name={greeting.icon}
                  size={16}
                  color={WaterColors.primaryDark}
                />
                <Text style={[styles.greeting, { color: colors.textSecondary }]}>
                  {greeting.text}
                </Text>
              </View>
              <View style={styles.brandRow}>
                <WaterDropIcon size={28} />
                <Text style={[styles.appName, { color: colors.text }]}>
                  MyNum
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.targetBadge,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
            >
              <Ionicons
                name="flag-outline"
                size={14}
                color={WaterColors.primaryDark}
              />
              <Text style={[styles.targetText, { color: colors.text }]}>
                {settings.daily_goal_ml}ml
              </Text>
            </View>
          </Animated.View>

          {/* Progress Ring */}
          <Animated.View
            entering={FadeInDown.delay(200).duration(500)}
            style={styles.progressSection}
          >
            <WaterProgress
              current={todayTotal}
              goal={settings.daily_goal_ml}
            />
          </Animated.View>

          {/* Quick Add Buttons */}
          <Animated.View entering={FadeInDown.delay(300).duration(500)}>
            <QuickAddBar onAddWater={addIntake} />
          </Animated.View>

          {/* Today's Log */}
          <Animated.View entering={FadeInDown.delay(400).duration(500)}>
            <TodayLog logs={todayLogs} onDelete={removeIntake} />
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
    paddingBottom: Spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  greeting: {
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  appName: {
    fontSize: FontSize.xxl,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  targetBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  targetText: {
    fontSize: FontSize.xs,
    fontWeight: '700',
  },
  progressSection: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  bottomPadding: {
    height: Spacing.xxl,
  },
});
