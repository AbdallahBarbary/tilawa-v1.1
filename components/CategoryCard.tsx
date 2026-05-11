import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, BorderRadius, Spacing, Shadows } from '../constants/theme';
import { BookOpenIcon } from './Icons';
import Svg, { Path, Circle } from 'react-native-svg';
import type { Category } from '../constants/mockData';

const CategoryIcon: React.FC<{ type: string; size?: number; color?: string }> = ({ type, size = 28, color = '#fff' }) => {
  const icons: Record<string, React.ReactElement> = {
    tajweed: (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M12 2L2 7L12 12L22 7L12 2Z" stroke={color} strokeWidth={1.5} strokeLinejoin="round" />
        <Path d="M2 17L12 22L22 17" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M2 12L12 17L22 12" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    ),
    hifz: (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth={1.5} />
        <Path d="M12 7V12L16 14" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      </Svg>
    ),
    tafseer: (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M2 3H8C10 3 12 5 12 7V21C12 19 10 18 9 18H2V3Z" stroke={color} strokeWidth={1.5} />
        <Path d="M22 3H16C14 3 12 5 12 7V21C12 19 14 18 15 18H22V3Z" stroke={color} strokeWidth={1.5} />
      </Svg>
    ),
    recitation: (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M12 1C12 1 9 4 9 8V16C9 18 11 20 13 20H16V8C16 4 12 1 12 1Z" stroke={color} strokeWidth={1.5} />
        <Path d="M16 20V23M13 23H19" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      </Svg>
    ),
    arabic: (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M4 21L8 10L12 21" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M5.5 17H10.5" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      </Svg>
    ),
    kids: (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="8" r="5" stroke={color} strokeWidth={1.5} />
        <Path d="M3 21C3 17 7 14 12 14C17 14 21 17 21 21" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      </Svg>
    ),
  };
  return icons[type] || <BookOpenIcon size={size} color={color} />;
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
          colors={[category.color, adjustBrightness(category.color, -30)]}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={isLarge ? styles.largeGradient : styles.gradient}
        >
          <View style={styles.iconWrap}>
            <CategoryIcon type={category.icon} size={isLarge ? 30 : 24} />
          </View>
          <Text style={[styles.title, isLarge && styles.lgTitle]}>{category.title}</Text>
          <Text style={styles.titleAr}>{category.titleAr}</Text>
          {isLarge && <Text style={styles.desc} numberOfLines={2}>{category.description}</Text>}
          <Text style={styles.count}>{category.teacherCount} teachers</Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: { width: 140, marginRight: Spacing.md, borderRadius: BorderRadius.xl, overflow: 'hidden', ...Shadows.md },
  largeCard: { flex: 1, minWidth: '47%', marginBottom: Spacing.md, borderRadius: BorderRadius.xl, overflow: 'hidden', ...Shadows.md },
  gradient: { padding: Spacing.lg, paddingTop: Spacing.xl, minHeight: 140, justifyContent: 'space-between' },
  largeGradient: { padding: Spacing.xl, minHeight: 160, justifyContent: 'space-between' },
  iconWrap: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.md },
  title: { fontSize: 16, fontFamily: 'Inter-SemiBold', color: '#fff' },
  lgTitle: { fontSize: 18 },
  titleAr: { fontSize: 14, color: 'rgba(255,255,255,0.7)', fontFamily: 'Inter', marginTop: 2 },
  desc: { fontSize: 12, color: 'rgba(255,255,255,0.75)', fontFamily: 'Inter', marginTop: 4, lineHeight: 17 },
  count: { fontSize: 12, color: 'rgba(255,255,255,0.6)', fontFamily: 'Inter', marginTop: Spacing.sm },
});
