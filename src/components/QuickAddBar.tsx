import { StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GlassButton } from './GlassButton';
import { DEFAULT_GLASS_SIZES } from '@/types';
import { Spacing, WaterColors } from '@/constants/theme';
import { useThemeColor } from '@/hooks/useThemeColor';

interface QuickAddBarProps {
  onAddWater: (amount: number) => void;
}

export function QuickAddBar({ onAddWater }: QuickAddBarProps) {
  const colors = useThemeColor();

  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <Ionicons
          name="add-circle-outline"
          size={16}
          color={WaterColors.primaryDark}
        />
        <Text style={[styles.title, { color: colors.textSecondary }]}>
          Catat Cepat
        </Text>
      </View>
      <View style={styles.buttonsRow}>
        {DEFAULT_GLASS_SIZES.map((glass) => (
          <GlassButton
            key={glass.amount_ml}
            label={glass.label}
            amount_ml={glass.amount_ml}
            onPress={onAddWater}
            size="medium"
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.lg,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.xl,
  },
});
