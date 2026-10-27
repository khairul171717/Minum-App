import { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
  useDerivedValue,
  useAnimatedStyle,
  interpolateColor,
} from 'react-native-reanimated';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { WaterColors } from '@/constants/theme';
import { useThemeColor } from '@/hooks/useThemeColor';
import { WaterDropIcon } from './WaterDropIcon';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface WaterProgressProps {
  current: number;
  goal: number;
  size?: number;
  strokeWidth?: number;
}

export function WaterProgress({
  current,
  goal,
  size = 220,
  strokeWidth = 14,
}: WaterProgressProps) {
  const colors = useThemeColor();
  const progress = useSharedValue(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min(current / goal, 1);

  useEffect(() => {
    progress.value = withTiming(percentage, {
      duration: 1200,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  }, [percentage, progress]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - progress.value),
  }));

  const displayPercentage = Math.round(percentage * 100);
  const remaining = Math.max(goal - current, 0);

  const progressColor = useDerivedValue(() => {
    return interpolateColor(
      progress.value,
      [0, 0.5, 0.75, 1],
      [WaterColors.primary, WaterColors.accent, WaterColors.secondary, WaterColors.success]
    );
  });

  const glowStyle = useAnimatedStyle(() => ({
    shadowColor: progressColor.value,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 8,
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.ringContainer, glowStyle]}>
        <Svg width={size} height={size} style={styles.svg}>
          <Defs>
            <LinearGradient id="progressGradient" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor={WaterColors.primary} />
              <Stop offset="50%" stopColor={WaterColors.accent} />
              <Stop offset="100%" stopColor={WaterColors.secondary} />
            </LinearGradient>
          </Defs>
          {/* Background track */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={colors.progressTrack}
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress arc */}
          <AnimatedCircle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="url(#progressGradient)"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            animatedProps={animatedProps}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </Svg>

        <View style={styles.textContainer}>
          <View style={styles.iconWrapper}>
            <WaterDropIcon size={42} />
          </View>
          <Text style={[styles.currentAmount, { color: colors.text }]}>
            {current}
            <Text style={[styles.unit, { color: colors.textSecondary }]}>ml</Text>
          </Text>
          <Text style={[styles.percentage, { color: WaterColors.primary }]}>
            {displayPercentage}%
          </Text>
          <Text style={[styles.remaining, { color: colors.textSecondary }]}>
            {remaining > 0 ? `${remaining}ml lagi` : '🎉 Target tercapai!'}
          </Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  svg: {
    transform: [{ rotateZ: '0deg' }],
  },
  textContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    marginBottom: 6,
  },
  currentAmount: {
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: -1,
  },
  unit: {
    fontSize: 16,
    fontWeight: '500',
  },
  percentage: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 2,
  },
  remaining: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
});
