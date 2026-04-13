import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Line, Text as SvgText, Rect, Defs, LinearGradient, Stop } from 'react-native-svg';
import type { EQBand } from '../types';
import { useThemeStore } from '../store/useThemeStore';

interface EQCurveChartProps {
  bands: EQBand[];
  width?: number;
  height?: number;
  preamp?: number;
}

const FREQ_MIN = 20;
const FREQ_MAX = 20000;
const DB_MIN = -18;
const DB_MAX = 18;

const FREQ_LABELS = [20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000];
const DB_LINES = [-12, -6, 0, 6, 12];

function freqToX(freq: number, width: number): number {
  return (
    ((Math.log10(freq) - Math.log10(FREQ_MIN)) /
      (Math.log10(FREQ_MAX) - Math.log10(FREQ_MIN))) *
    width
  );
}

function xToFreq(x: number, width: number): number {
  const t = x / width;
  const logF = Math.log10(FREQ_MIN) + t * (Math.log10(FREQ_MAX) - Math.log10(FREQ_MIN));
  return Math.pow(10, logF);
}

function dbToY(db: number, height: number): number {
  return ((DB_MAX - db) / (DB_MAX - DB_MIN)) * height;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function freqLabel(f: number): string {
  return f >= 1000 ? `${f / 1000}k` : `${f}`;
}

function safeQ(q?: number): number {
  if (!q || q <= 0) return 1;
  return q;
}

function peakingContribution(freq: number, band: EQBand): number {
  const center = Math.max(FREQ_MIN, Math.min(FREQ_MAX, band.frequency));
  const q = safeQ(band.q);
  const distance = Math.log2(freq / center);
  const width = 1.8 / q;
  return band.gain * Math.exp(-0.5 * Math.pow(distance / width, 2));
}

function lowShelfContribution(freq: number, band: EQBand): number {
  const center = Math.max(FREQ_MIN, Math.min(FREQ_MAX, band.frequency));
  const q = safeQ(band.q);
  const slope = 3.5 * q;
  const distance = Math.log2(freq / center);
  return band.gain / (1 + Math.exp(slope * distance));
}

function highShelfContribution(freq: number, band: EQBand): number {
  const center = Math.max(FREQ_MIN, Math.min(FREQ_MAX, band.frequency));
  const q = safeQ(band.q);
  const slope = 3.5 * q;
  const distance = Math.log2(freq / center);
  return band.gain / (1 + Math.exp(-slope * distance));
}

function bandContribution(freq: number, band: EQBand): number {
  switch (band.type) {
    case 'lowShelf':
      return lowShelfContribution(freq, band);
    case 'highShelf':
      return highShelfContribution(freq, band);
    case 'peaking':
      return peakingContribution(freq, band);
    case 'lowPass':
    case 'highPass':
    default:
      return 0;
  }
}

function totalResponse(freq: number, bands: EQBand[], preamp = 0): number {
  const sum = bands.reduce((acc, band) => acc + bandContribution(freq, band), preamp);
  return clamp(sum, DB_MIN, DB_MAX);
}

export function EQCurveChart({
  bands,
  width = 320,
  height = 140,
  preamp = 0,
}: EQCurveChartProps) {
  const isDark = useThemeStore((s) => s.isDark);

  const PADDING = { top: 8, bottom: 22, left: 28, right: 8 };
  const chartW = width - PADDING.left - PADDING.right;
  const chartH = height - PADDING.top - PADDING.bottom;

  const gridColor = isDark ? '#2a2927' : '#e0dedd';
  const axisColor = isDark ? '#393836' : '#c8c6c3';
  const labelColor = isDark ? '#797876' : '#9a9896';
  const curveColor = '#4f98a3';
  const zeroLineColor = isDark ? '#4a4846' : '#b0aead';
  const bgColor = isDark ? '#171614' : '#f5f4f2';

  const { pathD, fillD } = useMemo(() => {
    const steps = 240;
    const points: string[] = [];

    for (let i = 0; i <= steps; i++) {
      const x = (i / steps) * chartW;
      const freq = xToFreq(x, chartW);
      const db = totalResponse(freq, bands, preamp);
      const y = dbToY(db, chartH);
      points.push(`${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`);
    }

    const curve = points.join(' ');
    const zeroY = dbToY(0, chartH);
    const fill = `${curve} L${chartW},${zeroY} L0,${zeroY} Z`;

    return { pathD: curve, fillD: fill };
  }, [bands, chartW, chartH, preamp]);

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient id="curveGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={curveColor} stopOpacity="0.28" />
            <Stop offset="1" stopColor={curveColor} stopOpacity="0.03" />
          </LinearGradient>
        </Defs>

        <Rect
          x={PADDING.left}
          y={PADDING.top}
          width={chartW}
          height={chartH}
          fill={bgColor}
        />

        {DB_LINES.map((db) => {
          const y = PADDING.top + dbToY(db, chartH);
          return (
            <React.Fragment key={`db-${db}`}>
              <Line
                x1={PADDING.left}
                y1={y}
                x2={PADDING.left + chartW}
                y2={y}
                stroke={db === 0 ? zeroLineColor : gridColor}
                strokeWidth={db === 0 ? 1.5 : 0.75}
                strokeDasharray={db === 0 ? undefined : '3,3'}
              />
              <SvgText
                x={PADDING.left - 4}
                y={y + 4}
                fontSize={9}
                fill={labelColor}
                textAnchor="end"
              >
                {db > 0 ? `+${db}` : `${db}`}
              </SvgText>
            </React.Fragment>
          );
        })}

        {FREQ_LABELS.map((f) => {
          const x = PADDING.left + freqToX(f, chartW);
          return (
            <React.Fragment key={`f-${f}`}>
              <Line
                x1={x}
                y1={PADDING.top}
                x2={x}
                y2={PADDING.top + chartH}
                stroke={gridColor}
                strokeWidth={0.75}
                strokeDasharray="3,3"
              />
              <SvgText
                x={x}
                y={PADDING.top + chartH + 14}
                fontSize={9}
                fill={labelColor}
                textAnchor="middle"
              >
                {freqLabel(f)}
              </SvgText>
            </React.Fragment>
          );
        })}

        <Path
          d={fillD}
          fill="url(#curveGrad)"
          transform={`translate(${PADDING.left},${PADDING.top})`}
        />

        <Path
          d={pathD}
          stroke={curveColor}
          strokeWidth={2}
          fill="none"
          transform={`translate(${PADDING.left},${PADDING.top})`}
        />

        <Rect
          x={PADDING.left}
          y={PADDING.top}
          width={chartW}
          height={chartH}
          fill="none"
          stroke={axisColor}
          strokeWidth={1}
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    overflow: 'hidden',
  },
});
