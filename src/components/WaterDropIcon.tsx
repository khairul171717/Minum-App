import React from 'react';
import Svg, {
  Path,
  Circle,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
} from 'react-native-svg';

interface WaterDropIconProps {
  size?: number;
}

export function WaterDropIcon({ size = 36 }: WaterDropIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <Defs>
        <LinearGradient id="dropGrad" x1="0" y1="0" x2="0.8" y2="1">
          <Stop offset="0%" stopColor="#38BDF8" />
          <Stop offset="45%" stopColor="#0EA5E9" />
          <Stop offset="100%" stopColor="#0284C7" />
        </LinearGradient>
        <RadialGradient
          id="dropGleam"
          cx="0.35"
          cy="0.35"
          r="0.5"
          fx="0.3"
          fy="0.3"
        >
          <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
          <Stop offset="60%" stopColor="#FFFFFF" stopOpacity="0.1" />
          <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </RadialGradient>
      </Defs>

      {/* Main teardrop shape */}
      <Path
        d="M24 4 C24 4 10 19.5 10 30 C10 37.7 16.3 44 24 44 C31.7 44 38 37.7 38 30 C38 19.5 24 4 24 4 Z"
        fill="url(#dropGrad)"
      />

      {/* Glossy radial gleam */}
      <Path
        d="M24 7 C23 9 14 22 14 30 C14 35.5 18.5 40 24 40 C21 38 16 34 16 28 C16 21 24 10 24 7 Z"
        fill="url(#dropGleam)"
      />

      {/* Sparkling specular highlight dots */}
      <Circle cx="19" cy="24" r="2.5" fill="#FFFFFF" opacity="0.85" />
      <Circle cx="16.5" cy="30" r="1.2" fill="#FFFFFF" opacity="0.75" />
    </Svg>
  );
}
