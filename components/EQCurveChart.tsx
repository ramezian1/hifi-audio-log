import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import Svg, { Path, Line, Text as SvgText, Rect, Defs, LinearGradient, Stop } from 'react-native-svg';
import type { EQBand } from '../types';
import { useThemeStore } from '../store/useThemeStore';

interface EQCurveChartProps {
  bands: EQBand[];
  width?: number;
  height?: number;
}

const FREQ_MIN = 20;
const FREQ_MAX = 20000;
const DB_MIN = -18;
const DB_MAX = 18;
const SAMPLE_RATE = 48000;

// --- Biquad DSP math ---

function peakingEQ(f: number, freq: number, gain: number, q: number): number {
  const w0 = (2 * Math.PI * freq) / SAMPLE_RATE;
  const A = Math.pow(10, gain / 40);
  const alpha = Math.sin(w0) / (2 * q);
  const b0 = 1 + alpha * A;
  const b1 = -2 * Math.cos(w0);
  const b2 = 1 - alpha * A;
  const a0 = 1 + alpha / A;
  const a1 = -2 * Math.cos(w0);
  const a2 = 1 - alpha / A;
  return computeResponse(f, b0, b1, b2, a0, a1, a2);
}

function lowShelf(f: number, freq: number, gain: number, q: number): number {
  const w0 = (2 * Math.PI * freq) / SAMPLE_RATE;
  const A = Math.pow(10, gain / 40);
  const alpha = (Math.sin(w0) / 2) * Math.sqrt((A + 1 / A) * (1 / q - 1) + 2);
  const b0 = A * ((A + 1) - (A - 1) * Math.cos(w0) + 2 * Math.sqrt(A) * alpha);
  const b1 = 2 * A * ((A - 1) - (A + 1) * Math.cos(w0));
  const b2 = A * ((A + 1) - (A - 1) * Math.cos(w0) - 2 * Math.sqrt(A) * alpha);
  const a0 = (A + 1) + (A - 1) * Math.cos(w0) + 2 * Math.sqrt(A) * alpha;
  const a1 = -2 * ((A - 1) + (A + 1) * Math.cos(w0));
  const a2 = (A + 1) + (A - 1) * Math.cos(w0) - 2 * Math.sqrt(A) * alpha;
  return computeResponse(f, b0, b1, b2, a0, a1, a2);
}

function highShelf(f: number, freq: number, gain: number, q: number): number {
  const w0 = (2 * Math.PI * freq) / SAMPLE_RATE;
  const A = Math.pow(10, gain / 40);
  const alpha = (Math.sin(w0) / 2) * Math.sqrt((A + 1 / A) * (1 / q - 1) + 2);
  const b0 = A * ((A + 1) + (A - 1) * Math.cos(w0) + 2 * Math.sqrt(A) * alpha);
  const b1 = -2 * A * ((A - 1) + (A + 1) * Math.cos(w0));
  const b2 = A * ((A + 1) + (A - 1) * Math.cos(w0) - 2 * Math.sqrt(A) * alpha);
  const a0 = (A + 1) - (A - 1) * Math.cos(w0) + 2 * Math.sqrt(A) * alpha;
  const a1 = 2 * ((A - 1) - (A + 1) * Math.cos(w0));
  const a2 = (A + 1) - (A - 1) * Math.cos(w0) - 2 * Math.sqrt(A) * alpha;
  return computeResponse(f, b0, b1, b2, a0, a1, a2);
}

function computeResponse(
  f: number,
  b0: number, b1: number, b2: number,
  a0: number, a1: number, a2: number
): number {
  const w = (2 * Math.PI * f) / SAMPLE_RATE;
  // H(e^jw) magnitude squared via bilinear transform evaluation
  const cosW = Math.cos(w);
  const cos2W = Math.cos(2 * w);
  const numRe = b0 + b1 * cosW + b2 * cos2W;
  const numIm = -(b1 * Math.sin(w) + b2 * Math.sin(2 * w));
  const denRe = a0 + a1 * cosW + a2 * cos2W;
  const denIm = -(a1 * Math.sin(w) + a2 * Math.sin(2 * w));
  const numMag2 = numRe * numRe + numIm * numIm;
  const denMag2 = denRe * denRe + denIm * denIm;
  if (denMag2 === 0) return 0;
  return 10 * Math.log10(numMag2 / denMag2);
}

function bandResponse(f: number, band: EQBand): number {
  const { frequency, gain, q, type } = band;
  const safeQ = q > 0 ? q : 0.707;
  switch (type) {
    case 'peaking': return peakingEQ(f, frequency, gain, safeQ);
    case 'lowShelf': return lowShelf(f, frequency, gain, safeQ);
    case 'highShelf': return highShelf(f, frequency, gain, safeQ);
    case 'lowPass':
    case 'highPass':
    default: return 0; // flat for pass filters (no gain curve)
  }
}

function totalResponse(f: number, bands: EQBand[]): number {
  return bands.reduce((sum, band) => sum + bandResponse(f, band), 0);
}

// Map frequency (log scale) to SVG x coordinate
function freqToX(f: number, w: number): number {
  return ((Math.log10(f) - Math.log10(FREQ_MIN)) /
    (Math.log10(FREQ_MAX) - Math.log10(FREQ_MIN))) * w;
}

// Map dB to SVG y coordinate
function dbToY(db: number, h: number): number {
  return ((DB_MAX - db) / (DB_MAX - DB_MIN)) * h;
}

const FREQ_LABELS = [20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000];
const DB_LINES = [-12, -6, 0, 6, 12];

function freqLabel(f: number): string {
  if (f >= 1000) return `${f / 1000}k`;
  return `${f}`;
}

export function EQCurveChart({ bands, width = 320, height = 140 }: EQCurveChartProps) {
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

  // Build SVG path from 200 sample points
  const pathD = useMemo(() => {
    if (!bands || bands.length === 0) {
      // Flat 0dB line
      const y = dbToY(0, chartH);
      return `M0,${y} L${chartW},${y}`;
    }
    const points: string[] = [];
    const steps = 200;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const logF = Math.log10(FREQ_MIN) + t * (Math.log10(FREQ_MAX) - Math.log10(FREQ_MIN));
      const f = Math.pow(10, logF);
      let db = totalResponse(f, bands);
      db = Math.max(DB_MIN, Math.min(DB_MAX, db));
      const x = freqToX(f, chartW);
      const y = dbToY(db, chartH);
      points.push(`${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`);
    }
    return points.join(' ');
  }, [bands, chartW, chartH]);

  // Fill path (close below the curve)
  const fillD = useMemo(() => {
    if (!pathD) return '';
    const zeroY = dbToY(0, chartH);
    return `${pathD} L${chartW},${zeroY} L0,${zeroY} Z`;
  }, [pathD, chartW, chartH]);

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient id="curveGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={curveColor} stopOpacity="0.25" />
            <Stop offset="1" stopColor={curveColor} stopOpacity="0.02" />
          </LinearGradient>
        </Defs>

        {/* Chart area background */}
        <Rect
          x={PADDING.left}
          y={PADDING.top}
          width={chartW}
          height={chartH}
          fill={bgColor}
        />

        {/* dB grid lines */}
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

        {/* Frequency grid lines */}
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

        {/* Filled area under curve */}
        <Path
          d={fillD}
          fill="url(#curveGrad)"
          transform={`translate(${PADDING.left},${PADDING.top})`}
        />

        {/* Curve */}
        <Path
          d={pathD}
          stroke={curveColor}
          strokeWidth={2}
          fill="none"
          transform={`translate(${PADDING.left},${PADDING.top})`}
        />

        {/* Border */}
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
