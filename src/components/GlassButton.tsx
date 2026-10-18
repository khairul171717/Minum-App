import { useRef } from 'react';
import { StyleSheet, Text, Pressable, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { WaterColors, BorderRadius, Spacing, FontSize } from '@/constants/theme';
import { useThemeColor } from '@/hooks/useThemeColor';
import { GlassIcon } from './GlassIcon';
import * as Haptics from 'expo-haptics';

interface GlassButtonProps {
  label: string;
  amount_ml: number;
  onPress: (amount: number) => void;
  size?: 'small' | 'medium' | 'large';
  icon?: string;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function GlassButton({
  label,
  amount_ml,
  onPress,
  size = 'medium',
}: GlassButtonProps) {
  const colors = useThemeColor();
  const scale = useSharedValue(1);
  const rippleOpacity = useSharedValue(0);
  const splashY = useSharedValue(0);
  const isAnimating = useRef(false);

  const dimensions = {
    small: { container: 76, iconSize: 40, text: FontSize.xs },
    medium: { container: 94, iconSize: 48, text: FontSize.sm },
    large: { container: 114, iconSize: 58, text: FontSize.md },
  };

  const dim = dimensions[size];
  const glassType = amount_ml <= 150 ? 150 : amount_ml >= 500 ? 500 : 250;

  const handlePress = () => {
    if (isAnimating.current) return;
    isAnimating.current = true;

    // Haptic feedback
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {
      // Haptics may not be available
    }

    // Bounce animation
    scale.value = withSequence(
      withSpring(0.85, { damping: 10, stiffness: 400 }),
      withSpring(1.15, { damping: 8, stiffness: 300 }),
      withSpring(1, { damping: 12, stiffness: 200 }, () => {
        isAnimating.current = false;
      })
    );

    // Ripple effect
    rippleOpacity.value = withSequence(
      withTiming(0.5, { duration: 150 }),
      withTiming(0, { duration: 400 })
    );

    // Splash effect
    splashY.value = withSequence(
      withTiming(-12, { duration: 180 }),
      withTiming(0, { duration: 250 })
    );

    runOnJS(onPress)(amount_ml);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const rippleStyle = useAnimatedStyle(() => ({
    opacity: rippleOpacity.value,
    transform: [{ scale: 1 + rippleOpacity.value }],
  }));

  const splashStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: splashY.value }],
  }));

  return (
    <View style={styles.wrapper}>
      <AnimatedPressable
        onPress={handlePress}
        style={[
          styles.container,
          {
            width: dim.container,
            height: dim.container,
            backgroundColor: colors.glassButton,
            borderColor: colors.glassButtonBorder,
            shadowColor: colors.shadow,
          },
          animatedStyle,
        ]}
      >
        {/* Ripple overlay */}
        <Animated.View
          style={[
            styles.ripple,
            { backgroundColor: WaterColors.ripple },
            rippleStyle,
          ]}
        />

        <Animated.View style={splashStyle}>
          <GlassIcon type={glassType} size={dim.iconSize} />
        </Animated.View>
      </AnimatedPressable>
      <Text
        style={[
          styles.label,
          { color: colors.textSecondary, fontSize: dim.text },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  container: {
    borderRadius: BorderRadius.xl,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  ripple: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: BorderRadius.xl,
  },
  label: {
    fontWeight: '700',
    textAlign: 'center',
  },
});
