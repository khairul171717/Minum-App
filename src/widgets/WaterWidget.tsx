"use no memo";

import React from 'react';
import {
  FlexWidget,
  TextWidget,
  SvgWidget,
  ClickActionProps,
} from 'react-native-android-widget';

interface WaterWidgetProps {
  currentMl: number;
  goalMl: number;
}

const WATER_DROP_SVG = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" fill="#0288D1"/></svg>`;
const GLASS_SVG = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 4h14l-2 15a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2z" stroke="#0288D1" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M6.5 11h11" stroke="#38BDF8" stroke-width="2"/></svg>`;

const GLASS_SIZES = [
  { label: '+150ml', amount: 150 },
  { label: '+250ml', amount: 250 },
  { label: '+500ml', amount: 500 },
];

export function WaterWidget({ currentMl, goalMl }: WaterWidgetProps) {
  const percentage = Math.min(Math.round((currentMl / goalMl) * 100), 100);
  const remaining = Math.max(goalMl - currentMl, 0);
  const progressWidth = Math.max(percentage, 2);

  return (
    <FlexWidget
      style={{
        height: 'match_parent',
        width: 'match_parent',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 24,
        backgroundColor: '#F0F9FF',
      }}
    >
      {/* Header Row */}
      <FlexWidget
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: 'match_parent',
        }}
      >
        <FlexWidget
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <SvgWidget
            svg={WATER_DROP_SVG}
            style={{ width: 18, height: 18, marginRight: 6 }}
          />
          <TextWidget
            text="MyNum"
            style={{
              fontSize: 15,
              color: '#0288D1',
              fontWeight: 'bold',
            }}
          />
        </FlexWidget>
        <TextWidget
          text={`${percentage}%`}
          style={{
            fontSize: 14,
            color: percentage >= 100 ? '#66BB6A' : '#4FC3F7',
            fontWeight: 'bold',
          }}
        />
      </FlexWidget>

      {/* Progress Text */}
      <FlexWidget
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginTop: 8,
          width: 'match_parent',
        }}
      >
        <FlexWidget
          style={{
            flexDirection: 'row',
            alignItems: 'flex-end',
          }}
        >
          <TextWidget
            text={`${currentMl}`}
            style={{
              fontSize: 28,
              color: '#1A2138',
              fontWeight: 'bold',
            }}
          />
          <TextWidget
            text={` / ${goalMl}ml`}
            style={{
              fontSize: 14,
              color: '#6B7280',
            }}
          />
        </FlexWidget>
        <TextWidget
          text={remaining > 0 ? `-${remaining}ml` : 'Tercapai!'}
          style={{
            fontSize: 12,
            color: remaining > 0 ? '#0288D1' : '#66BB6A',
            fontWeight: '600',
          }}
        />
      </FlexWidget>

      {/* Progress Bar */}
      <FlexWidget
        style={{
          width: 'match_parent',
          height: 8,
          borderRadius: 4,
          backgroundColor: '#E0F2FE',
          marginTop: 8,
          overflow: 'hidden',
        }}
      >
        <FlexWidget
          style={{
            width: `${progressWidth}%` as any,
            height: 'match_parent',
            borderRadius: 4,
            backgroundColor: percentage >= 100 ? '#66BB6A' : '#4FC3F7',
          }}
        />
      </FlexWidget>

      {/* Quick Add Buttons */}
      <FlexWidget
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: 'match_parent',
          marginTop: 12,
        }}
      >
        {GLASS_SIZES.map((glass) => (
          <FlexWidget
            key={glass.amount}
            clickAction="WIDGET_CLICK"
            clickActionData={
              {
                action: 'add_water',
                amount: String(glass.amount),
              } as ClickActionProps['clickActionData']
            }
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: 8,
              paddingHorizontal: 4,
              marginHorizontal: 4,
              borderRadius: 12,
              backgroundColor: '#FFFFFF',
              borderWidth: 1,
              borderColor: '#B3E5FC',
            }}
          >
            <SvgWidget
              svg={GLASS_SVG}
              style={{ width: 14, height: 14, marginRight: 4 }}
            />
            <TextWidget
              text={glass.label}
              style={{
                fontSize: 12,
                color: '#0288D1',
                fontWeight: '600',
              }}
            />
          </FlexWidget>
        ))}
      </FlexWidget>
    </FlexWidget>
  );
}
