import { StyleSheet, ScrollView, View, Text, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useSettings } from '@/hooks/useSettings';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Spacing, FontSize, WaterColors, BorderRadius } from '@/constants/theme';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { WeightWaterCalculator } from '@/components/WeightWaterCalculator';

const GOAL_OPTIONS = [1500, 2000, 2500, 3000, 3500, 4000];
const GLASS_OPTIONS = [150, 200, 250, 300, 350, 500];

const TIPS = [
  'Minumlah setidaknya 8 gelas (2 liter) air per hari',
  'Minum segelas air hangat sesaat setelah bangun tidur',
  'Bawa botol minum praktis kemanapun kamu bepergian',
  'Minum sebelum merasa haus untuk mencegah dehidrasi',
  'Tingkatkan asupan cairan saat berolahraga atau cuaca panas',
];

export default function SettingsScreen() {
  const colors = useThemeColor();
  const {
    settings,
    setDailyGoal,
    setGlassSize,
    applyWeightCalculatedGoal,
    resetData,
  } = useSettings();

  const handleResetData = () => {
    Alert.alert(
      'Hapus Semua Data',
      'Apakah kamu yakin ingin menghapus semua catatan minum? Tindakan ini tidak dapat dibatalkan.',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            await resetData();
            Alert.alert('Berhasil', 'Semua data telah dihapus.');
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <Animated.View
            entering={FadeInDown.delay(100).duration(400)}
            style={styles.header}
          >
            <View style={styles.titleRow}>
              <Ionicons
                name="settings"
                size={26}
                color={WaterColors.primaryDark}
              />
              <Text style={[styles.title, { color: colors.text }]}>
                Pengaturan
              </Text>
            </View>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Sesuaikan target dan preferensi hidrasimu
            </Text>
          </Animated.View>

          {/* Kalkulator Kebutuhan Air dari Berat Badan */}
          <Animated.View entering={FadeInDown.delay(150).duration(400)}>
            <WeightWaterCalculator
              key={`calc-${settings.weight_kg || 60}-${settings.activity_level || 'normal'}`}
              currentWeightKg={settings.weight_kg}
              currentActivityLevel={settings.activity_level}
              currentDailyGoal={settings.daily_goal_ml}
              onApplyGoal={applyWeightCalculatedGoal}
            />
          </Animated.View>

          {/* Daily Goal */}
          <Animated.View
            entering={FadeInDown.delay(200).duration(400)}
            style={[
              styles.section,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <View style={styles.sectionHeaderRow}>
              <Ionicons
                name="flag-outline"
                size={20}
                color={WaterColors.primaryDark}
              />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Target Harian
              </Text>
            </View>
            <Text style={[styles.sectionDesc, { color: colors.textSecondary }]}>
              Pilih berapa ml air yang ingin kamu minum setiap hari
            </Text>
            <View style={styles.optionsGrid}>
              {GOAL_OPTIONS.map((goal) => (
                <Pressable
                  key={goal}
                  onPress={() => setDailyGoal(goal)}
                  style={[
                    styles.optionButton,
                    {
                      backgroundColor:
                        settings.daily_goal_ml === goal
                          ? WaterColors.primary
                          : colors.backgroundElement,
                      borderColor:
                        settings.daily_goal_ml === goal
                          ? WaterColors.primary
                          : colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.optionText,
                      {
                        color:
                          settings.daily_goal_ml === goal
                            ? '#FFFFFF'
                            : colors.text,
                      },
                    ]}
                  >
                    {goal}ml
                  </Text>
                </Pressable>
              ))}
            </View>
          </Animated.View>

          {/* Glass Size */}
          <Animated.View
            entering={FadeInDown.delay(300).duration(400)}
            style={[
              styles.section,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <View style={styles.sectionHeaderRow}>
              <Ionicons
                name="water-outline"
                size={20}
                color={WaterColors.secondary}
              />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Ukuran Gelas Default
              </Text>
            </View>
            <Text style={[styles.sectionDesc, { color: colors.textSecondary }]}>
              Ukuran default saat kamu menekan tombol cepat
            </Text>
            <View style={styles.optionsGrid}>
              {GLASS_OPTIONS.map((size) => (
                <Pressable
                  key={size}
                  onPress={() => setGlassSize(size)}
                  style={[
                    styles.optionButton,
                    {
                      backgroundColor:
                        settings.glass_size_ml === size
                          ? WaterColors.secondary
                          : colors.backgroundElement,
                      borderColor:
                        settings.glass_size_ml === size
                          ? WaterColors.secondary
                          : colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.optionText,
                      {
                        color:
                          settings.glass_size_ml === size
                            ? '#FFFFFF'
                            : colors.text,
                      },
                    ]}
                  >
                    {size}ml
                  </Text>
                </Pressable>
              ))}
            </View>
          </Animated.View>

          {/* Info & Tips */}
          <Animated.View
            entering={FadeInDown.delay(400).duration(400)}
            style={[
              styles.section,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <View style={styles.sectionHeaderRow}>
              <Ionicons name="bulb-outline" size={20} color="#F59E0B" />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Tips Hidrasi Sehat
              </Text>
            </View>
            <View style={styles.tipsList}>
              {TIPS.map((tip) => (
                <View key={tip} style={styles.tipRow}>
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={17}
                    color={WaterColors.primaryDark}
                  />
                  <Text
                    style={[
                      styles.tipItem,
                      { color: colors.textSecondary },
                    ]}
                  >
                    {tip}
                  </Text>
                </View>
              ))}
            </View>
          </Animated.View>

          {/* Reset */}
          <Animated.View
            entering={FadeInDown.delay(500).duration(400)}
            style={styles.dangerSection}
          >
            <Pressable
              onPress={handleResetData}
              style={[
                styles.resetButton,
                { borderColor: WaterColors.error },
              ]}
            >
              <View style={styles.resetButtonContent}>
                <Ionicons
                  name="trash-outline"
                  size={18}
                  color={WaterColors.error}
                />
                <Text style={[styles.resetText, { color: WaterColors.error }]}>
                  Hapus Semua Data
                </Text>
              </View>
            </Pressable>
          </Animated.View>

          {/* App Info */}
          <Animated.View
            entering={FadeInDown.delay(600).duration(400)}
            style={styles.footer}
          >
            <Text style={[styles.footerText, { color: colors.textSecondary }]}>
              Minum v1.0.0
            </Text>
            <View style={styles.footerHeartRow}>
              <Text style={[styles.footerText, { color: colors.textSecondary }]}>
                Dibuat dengan
              </Text>
              <Ionicons name="heart" size={13} color="#EF5350" />
              <Text style={[styles.footerText, { color: colors.textSecondary }]}>
                untuk kesehatanmu
              </Text>
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
  section: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: Spacing.xs,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
  sectionDesc: {
    fontSize: FontSize.sm,
    marginBottom: Spacing.md,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  optionButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    minWidth: 80,
    alignItems: 'center',
  },
  optionText: {
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  tipsList: {
    gap: Spacing.md,
    marginTop: Spacing.xs,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  tipItem: {
    fontSize: FontSize.sm,
    lineHeight: 20,
    flex: 1,
  },
  dangerSection: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.md,
  },
  resetButton: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  resetButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  resetText: {
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
    gap: Spacing.xs,
  },
  footerHeartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  footerText: {
    fontSize: FontSize.xs,
    fontWeight: '500',
  },
  bottomPadding: {
    height: Spacing.xxl,
  },
});
