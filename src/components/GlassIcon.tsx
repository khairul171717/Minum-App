import React from 'react';
import Svg, {
  Path,
  Rect,
  Circle,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';

interface GlassIconProps {
  size?: number;
  type?: 150 | 250 | 500;
  focused?: boolean;
}

export function GlassIcon({ size = 44, type = 250 }: GlassIconProps) {
  // Variations based on glass capacity
  if (type === 150) {
    // Small cup / Espresso-sized water cup (150ml)
    return (
      <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        <Defs>
          <LinearGradient id="water150" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#38BDF8" stopOpacity="0.9" />
            <Stop offset="100%" stopColor="#0284C7" stopOpacity="0.95" />
          </LinearGradient>
          <LinearGradient id="glassReflection" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.6" />
            <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.0" />
          </LinearGradient>
        </Defs>

        {/* Cup body shadow / glow */}
        <Path
          d="M12 16 L14.5 34 C15 37 18 39 24 39 C30 39 33 37 33.5 34 L36 16 Z"
          fill="#E0F2FE"
          opacity="0.4"
        />

        {/* Water inside (lower height) */}
        <Path
          d="M13.8 22 Q24 23 34.2 22 L33.2 33.5 C32.7 36 30 38 24 38 C18 38 15.3 36 14.8 33.5 Z"
          fill="url(#water150)"
        />

        {/* Water surface wave */}
        <Path
          d="M13.8 22 Q18.9 20.8 24 22 Q29.1 23.2 34.2 22"
          stroke="#BAE6FD"
          strokeWidth="1.5"
          fill="none"
        />

        {/* Bubble */}
        <Circle cx="21" cy="29" r="1.5" fill="#FFFFFF" opacity="0.7" />
        <Circle cx="27" cy="26" r="1" fill="#FFFFFF" opacity="0.6" />

        {/* Cup rim & outer contour */}
        <Path
          d="M11 15 L14 34.5 C14.6 38 18 40.5 24 40.5 C30 40.5 33.4 38 34 34.5 L37 15"
          stroke="#0284C7"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Cup Rim top oval */}
        <Rect
          x="10.5"
          y="13"
          width="27"
          height="4"
          rx="2"
          fill="#E0F2FE"
          stroke="#0284C7"
          strokeWidth="2"
        />

        {/* Glass reflection highlight */}
        <Path
          d="M14 18 L15.8 32"
          stroke="url(#glassReflection)"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </Svg>
    );
  }

  if (type === 500) {
    // Tall Water Bottle / Sports Tumbler (500ml)
    return (
      <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        <Defs>
          <LinearGradient id="water500" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#2DD4BF" stopOpacity="0.9" />
            <Stop offset="50%" stopColor="#0EA5E9" stopOpacity="0.95" />
            <Stop offset="100%" stopColor="#0369A1" stopOpacity="1" />
          </LinearGradient>
          <LinearGradient id="bottleHighlight" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.5" />
            <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.0" />
          </LinearGradient>
        </Defs>

        {/* Bottle water fill */}
        <Path
          d="M14 17 Q24 16 34 17 L33.2 39 C32.8 42 29 43.5 24 43.5 C19 43.5 15.2 42 14.8 39 Z"
          fill="url(#water500)"
        />

        {/* Water surface curve */}
        <Path
          d="M14 17 Q19 15.5 24 17 Q29 18.5 34 17"
          stroke="#CCFBF1"
          strokeWidth="1.5"
          fill="none"
        />

        {/* Floating bubbles */}
        <Circle cx="20" cy="36" r="1.5" fill="#FFFFFF" opacity="0.7" />
        <Circle cx="28" cy="30" r="1.8" fill="#FFFFFF" opacity="0.75" />
        <Circle cx="19" cy="24" r="1.2" fill="#FFFFFF" opacity="0.6" />

        {/* Bottle outer body */}
        <Path
          d="M13.5 13 L14.5 39 C15 42.5 18.5 44.5 24 44.5 C29.5 44.5 33 42.5 33.5 39 L34.5 13"
          stroke="#0284C7"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Bottle neck & cap */}
        <Rect
          x="18"
          y="6.5"
          width="12"
          height="6.5"
          rx="2"
          fill="#38BDF8"
          stroke="#0284C7"
          strokeWidth="2"
        />
        {/* Cap band */}
        <Rect x="20" y="4.5" width="8" height="2.5" rx="1" fill="#0284C7" />

        {/* Bottle shoulder ring */}
        <Rect
          x="12"
          y="11.5"
          width="24"
          height="3"
          rx="1.5"
          fill="#E0F2FE"
          stroke="#0284C7"
          strokeWidth="1.8"
        />

        {/* Gloss highlight stripe */}
        <Path
          d="M16 16 L17.2 38"
          stroke="url(#bottleHighlight)"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </Svg>
    );
  }

  // Default: Classic Fresh Water Glass (250ml)
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <Defs>
        <LinearGradient id="water250" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#38BDF8" stopOpacity="0.85" />
          <Stop offset="100%" stopColor="#0284C7" stopOpacity="0.95" />
        </LinearGradient>
        <LinearGradient id="glassGleam" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.7" />
          <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.0" />
        </LinearGradient>
      </Defs>

      {/* Glass interior background */}
      <Path
        d="M12.5 14 L15 36 C15.5 39 19 41.5 24 41.5 C29 41.5 32.5 39 33 36 L35.5 14 Z"
        fill="#E0F2FE"
        opacity="0.35"
      />

      {/* Fresh Water Liquid (250ml filled level) */}
      <Path
        d="M13.4 18.5 Q24 20 34.6 18.5 L32.6 35.5 C32.1 38.5 29 40.5 24 40.5 C19 40.5 15.9 38.5 15.4 35.5 Z"
        fill="url(#water250)"
      />

      {/* Liquid surface wave ripple */}
      <Path
        d="M13.4 18.5 Q18.7 17.2 24 18.5 Q29.3 19.8 34.6 18.5"
        stroke="#E0F2FE"
        strokeWidth="1.6"
        fill="none"
      />

      {/* Refreshing air bubbles */}
      <Circle cx="21" cy="33" r="1.5" fill="#FFFFFF" opacity="0.8" />
      <Circle cx="27" cy="27" r="2" fill="#FFFFFF" opacity="0.75" />
      <Circle cx="18" cy="23" r="1.2" fill="#FFFFFF" opacity="0.7" />

      {/* Glass Contour & Outline */}
      <Path
        d="M11.5 12 L14.5 36 C15.2 40 19 42.5 24 42.5 C29 42.5 32.8 40 33.5 36 L36.5 12"
        stroke="#0284C7"
        strokeWidth="2.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Glass Rim */}
      <Rect
        x="10"
        y="10.5"
        width="28"
        height="3.5"
        rx="1.75"
        fill="#F0F9FF"
        stroke="#0284C7"
        strokeWidth="2"
      />

      {/* Glossy reflection stroke */}
      <Path
        d="M14.5 15 L16.5 34"
        stroke="url(#glassGleam)"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </Svg>
  );
}
