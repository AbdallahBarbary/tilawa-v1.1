import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Spacing, Shadows } from '../constants/theme';
import Svg, { Path, Circle, Line, Rect } from 'react-native-svg';
import type { Category } from '../constants/mockData';

// ─── Brand-weight category icons ──────────────────────────────────────
// Filled with partial opacity background + solid stroke — heavier than outline-only
const CategoryIcon: React.FC<{ type: string; size?: number; color?: string }> = ({ type, size = 28, color = '#fff' }) => {
  const icons: Record<string, React.ReactElement> = {
    // Tajweed — stacked sound waves: the visual metaphor of voice & rule
    tajweed: (
      <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
        <Path d="M14 4L4 9L14 14L24 9L14 4Z" fill={`${color}30`} stroke={color} strokeWidth={1.6} strokeLinejoin="round" />
        <Path d="M4 19L14 24L24 19" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M4 14L14 19L24 14" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    ),
    // Hifz — clock with heart: time dedicated to memorization
    hifz: (
      <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
        <Circle cx="14" cy="13" r="9" fill={`${color}25`} stroke={color} strokeWidth={1.6} />
        <Path d="M14 8V13L18 15.5" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
        <Circle cx="14" cy="13" r="1.5" fill={color} />
        <Path d="M10 21C10 21 10 23 14 25C18 23 18 21 18 21" stroke={color} strokeWidth={1.2} strokeLinecap="round" opacity={0.6} />
      </Svg>
    ),
    // Tafseer — open dual-page mushaf with text lines: exegesis = reading deeply
    tafseer: (
      <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
        <Path d="M2 5H9C11 5 13 6.5 13 8V24C13 22.5 11 21.5 10 21.5H2V5Z" fill={`${color}28`} stroke={color} strokeWidth={1.6} />
        <Path d="M26 5H19C17 5 15 6.5 15 8V24C15 22.5 17 21.5 18 21.5H26V5Z" fill={`${color}18`} stroke={color} strokeWidth={1.6} />
        <Line x1="4" y1="9" x2="11" y2="9" stroke={color} strokeWidth={1} strokeLinecap="round" />
        <Line x1="4" y1="12" x2="11" y2="12" stroke={color} strokeWidth={1} strokeLinecap="round" />
        <Line x1="4" y1="15" x2="8" y2="15" stroke={color} strokeWidth={1} strokeLinecap="round" />
        <Line x1="17" y1="9" x2="24" y2="9" stroke={color} strokeWidth={1} strokeLinecap="round" />
        <Line x1="17" y1="12" x2="24" y2="12" stroke={color} strokeWidth={1} strokeLinecap="round" />
        <Line x1="17" y1="15" x2="21" y2="15" stroke={color} strokeWidth={1} strokeLinecap="round" />
      </Svg>
    ),
    // Recitation — microphone with sound arc: voice raised in worship
    recitation: (
      <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
        <Rect x="10" y="3" width="8" height="14" rx="4" fill={`${color}28`} stroke={color} strokeWidth={1.6} />
        <Path d="M6 16C6 20.4 9.58 24 14 24C18.42 24 22 20.4 22 16" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
        <Line x1="14" y1="24" x2="14" y2="27" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
        <Line x1="10" y1="27" x2="18" y2="27" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
        <Line x1="12" y1="8" x2="16" y2="8" stroke={color} strokeWidth={1} strokeLinecap="round" opacity={0.6} />
        <Line x1="12" y1="11" x2="16" y2="11" stroke={color} strokeWidth={1} strokeLinecap="round" opacity={0.6} />
      </Svg>
    ),
    // Arabic — a stylized ع (Ayn) — the first letter of Arabic (عربي)
    arabic: (
      <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
        <Path
          d="M6 9C6 9 7 6 10 6C13 6 14 8.5 14 11C14 14 12 16 10 16C8 16 7 14.5 8 13C9 11.5 12 12 12 14"
          stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"
        />
        <Path d="M14 11C14 11 16 9 19 10C21 11 22 13 21 15C20 17 18 17.5 18 20" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
        <Path d="M5 22H23" stroke={color} strokeWidth={1.2} strokeLinecap="round" opacity={0.5} />
        <Circle cx="8" cy="22" r="1.2" fill={color} />
        <Circle cx="14" cy="22" r="1.2" fill={color} />
        <Circle cx="20" cy="22" r="1.2" fill={color} />
      </Svg>
    ),
    // Kids — a smiling crescent: gentle, welcoming, nurturing
    kids: (
      <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
        <Circle cx="14" cy="11" r="7" fill={`${color}28`} stroke={color} strokeWidth={1.6} />
        <Path d="M11 11C11.5 13 12.5 14 14 14C15.5 14 16.5 13 17 11" stroke={color} strokeWidth={1.4} strokeLinecap="round" />
        <Circle cx="12" cy="9.5" r="1" fill={color} />
        <Circle cx="16" cy="9.5" r="1" fill={color} />
        <Path d="M4 24C4 20.13 8.48 17 14 17C19.52 17 24 20.13 24 24" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
        <Path d="M11 19L9 22M17 19L19 22" stroke={color} strokeWidth={1} strokeLinecap="round" opacity={0.5} />
      </Svg>
    ),
  };
  return icons[type] ?? (
    <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <Circle cx="14" cy="14" r="10" fill={`${color}25`} stroke={color} strokeWidth={1.6} />
    </Svg>
  );
};

function adjustBrightness(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, Math.min(255, (num >> 16) + amount));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0xFF) + amount));
  const b = Math.max(0, Math.min(255, (num & 0xFF) + amount));
  return '#' + (0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1);
}

interface CategoryCardProps {
  category: Category;
  onPress?: () => void;
  size?: 'normal' | 'large';
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, onPress, size = 'normal' }) => {
  const scale = useRef(new Animated.Value(1)).current;
  const isLarge = size === 'large';

  return (
    <Animated.View style={[isLarge ? styles.largeCard : styles.card, { transform: [{ scale }] }]}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={() => Animated.spring(scale, { toValue: 0.95, useNativeDriver: true, damping: 18, stiffness: 220 }).start()}
        onPressOut={() => Animated.spring(scale, { toValue: 1, useNativeDriver: true, damping: 18, stiffness: 220 }).start()}
        activeOpacity={1}
      >
        <LinearGradient
          colors={[category.color, adjustBrightness(category.color, -35)]}
          start={{ x: 0, y: 0 }} end={{ x: 0.8, y: 1 }}
          style={isLarge ? styles.largeGradient : styles.gradient}
        >
          {/* Arabic watermark — the card's soul */}
          <Text style={[styles.arabicWatermark, isLarge && styles.arabicWatermarkLg]}>
            {category.titleAr}
          </Text>

          {/* Gold top accent line — ceremonial marker */}
          <View style={styles.topAccent} />

          {/* Icon container — white frosted background */}
          <View style={[styles.iconWrap, isLarge && styles.iconWrapLg]}>
            <CategoryIcon type={category.icon} size={isLarge ? 26 : 22} />
          </View>

          <View style={styles.textBlock}>
            <Text style={[styles.arabic, isLarge && styles.arabicLg]}>{category.titleAr}</Text>
            <Text style={[styles.title, isLarge && styles.lgTitle]}>{category.title}</Text>
            {isLarge && <Text style={styles.desc} numberOfLines={1}>{category.description}</Text>}
            <View style={styles.countRow}>
              <View style={styles.countPill}>
                <Text style={styles.count}>{category.teacherCount} teachers</Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 118,
    marginRight: 12,
    borderRadius: 20,
    overflow: 'hidden',
    ...Shadows.md,
  },
  largeCard: {
    flex: 1,
    minWidth: '47%',
    marginBottom: Spacing.md,
    borderRadius: 20,
    overflow: 'hidden',
    ...Shadows.md,
  },
  gradient: {
    paddingTop: 14,
    paddingBottom: 14,
    paddingHorizontal: 14,
    minHeight: 150,
    justifyContent: 'space-between',
    position: 'relative',
  },
  largeGradient: {
    padding: Spacing.lg,
    minHeight: 172,
    justifyContent: 'space-between',
    position: 'relative',
  },

  // Arabic watermark — massive, ghosted, gives depth
  arabicWatermark: {
    position: 'absolute',
    top: -8, right: 4,
    fontSize: 68,
    color: 'rgba(255,255,255,0.055)',
    lineHeight: 82,
    includeFontPadding: false,
  },
  arabicWatermarkLg: {
    fontSize: 80,
    right: 6,
  },

  // Gold top accent line — 2px, subtle prestige marker
  topAccent: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: 2,
    backgroundColor: 'rgba(201,168,76,0.6)',
  },

  iconWrap: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.20)',
  },
  iconWrapLg: {
    width: 50,
    height: 50,
    borderRadius: 16,
  },

  textBlock: { gap: 2 },
  arabic: {
    fontSize: 20,
    color: 'rgba(255,255,255,0.88)',
    lineHeight: 30,
  },
  arabicLg: { fontSize: 24, lineHeight: 34 },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: 'rgba(255,255,255,0.65)',
    letterSpacing: 0.3,
  },
  lgTitle: { fontSize: 14 },
  desc: {
    fontFamily: 'Inter',
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 2,
    letterSpacing: 0.1,
  },
  countRow: { marginTop: 6 },
  countPill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(201,168,76,0.22)',
    borderWidth: 1,
    borderColor: 'rgba(201,168,76,0.35)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  count: {
    fontFamily: 'Inter-Medium',
    fontSize: 10,
    color: 'rgba(201,168,76,0.95)',
    letterSpacing: 0.3,
  },
});
