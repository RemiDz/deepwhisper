'use client';

import { useMemo } from 'react';
import { getEnergyProfile } from '@/data/energyProfiles';

interface EnergyIntensityProps {
  sealIndex: number;  // 0-19
  toneIndex: number;  // 0-12
}

const DIMENSIONS = [
  'Communication',
  'Creativity',
  'Physical',
  'Emotional',
  'Intuition',
  'Transformation',
  'Connection',
  'Grounding',
];

function getColour(value: number) {
  if (value <= 3) return { fill: 'rgba(96,165,250,0.7)', text: '#93bbfd' };
  if (value <= 5) return { fill: 'rgba(74,222,128,0.65)', text: '#86efac' };
  if (value <= 7) return { fill: 'rgba(251,191,36,0.65)', text: '#fcd34d' };
  return { fill: 'rgba(248,113,113,0.7)', text: '#fca5a5' };
}

function getSegmentColour(index: number) {
  if (index < 3) return '#60a5fa';
  if (index < 5) return '#4ade80';
  if (index < 7) return '#fbbf24';
  return '#f87171';
}

function getOverallColour(value: number) {
  if (value <= 3) return '#93bbfd';
  if (value <= 5) return '#86efac';
  if (value <= 7) return '#fcd34d';
  return '#fca5a5';
}

export default function EnergyIntensity({ sealIndex, toneIndex }: EnergyIntensityProps) {
  const { values, overall } = useMemo(
    () => getEnergyProfile(sealIndex, toneIndex),
    [sealIndex, toneIndex],
  );

  const filledCount = Math.round(overall);

  return (
    <div className="px-4 space-y-3">
      {/* Part 1: Overall Intensity Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-[#a8a6a0]">Energy intensity</span>
          <span
            className="text-[10px] font-medium"
            style={{ color: getOverallColour(overall) }}
          >
            {overall.toFixed(1)} / 10
          </span>
        </div>
        <div className="flex gap-[2px]">
          {Array.from({ length: 10 }, (_, i) => {
            const filled = i < filledCount;
            return (
              <div
                key={i}
                className="flex-1 h-[5px] rounded-full"
                style={{
                  background: filled ? getSegmentColour(i) : 'rgba(255,255,255,0.06)',
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Separator */}
      <div style={{ height: 1, background: 'rgba(255,255,255,0.06)' }} />

      {/* Part 2: Glass Tube Columns (CSS Grid: values → tubes → labels) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(8, 1fr)',
        gridTemplateRows: 'auto 70px auto',
        gap: '4px 6px',
        justifyItems: 'center',
        width: '100%',
      }}>
        {/* Row 1: value numbers */}
        {values.map((val, i) => (
          <div key={`v${i}`} style={{ fontSize: 10, fontWeight: 500, color: getColour(val).text, alignSelf: 'end' }}>
            {val}
          </div>
        ))}
        {/* Row 2: glass tubes */}
        {values.map((val, i) => {
          const colour = getColour(val);
          return (
            <div
              key={`t${i}`}
              style={{
                width: 12,
                height: 70,
                borderRadius: 6,
                background: 'rgba(255,255,255,0.04)',
                border: '0.5px solid rgba(255,255,255,0.08)',
                position: 'relative',
                overflow: 'hidden',
                alignSelf: 'stretch',
              }}
            >
              {/* Fill */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 1,
                  right: 1,
                  height: `${val * 10}%`,
                  borderRadius: 5,
                  background: colour.fill,
                }}
              />
              {/* Glass shine */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 2,
                  width: 1.5,
                  height: '100%',
                  borderRadius: 1,
                  background: 'rgba(255,255,255,0.06)',
                }}
              />
            </div>
          );
        })}
        {/* Row 3: dimension labels */}
        {DIMENSIONS.map((d, i) => (
          <div key={`l${i}`} style={{
            fontSize: 8,
            color: 'rgba(255,255,255,0.45)',
            textAlign: 'center',
            lineHeight: 1.2,
            alignSelf: 'start',
          }}>
            {d}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-3">
        {[
          { colour: '#60a5fa', label: 'calm' },
          { colour: '#4ade80', label: 'balanced' },
          { colour: '#fbbf24', label: 'elevated' },
          { colour: '#f87171', label: 'intense' },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1">
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: 1,
                background: item.colour,
              }}
            />
            <span style={{ fontSize: 8, color: 'rgba(255,255,255,0.35)' }}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
