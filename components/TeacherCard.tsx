import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Shadows, BorderRadius, Spacing } from '../constants/theme';
import { StarIcon, VerifiedIcon, OnlineIcon } from './Icons';
import type { Teacher } from '../constants/mockData';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.72;

interface TeacherCardProps {
  teacher: Teacher;
  onPress?: () => void;
  variant?: 'featured' | 'compact' | 'list';
}

export const TeacherCard: React.FC<TeacherCardProps> = ({ teacher, onPress, variant = 'featured' }) => {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, damping: 18, stiffness: 220 }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, damping: 18, stiffness: 220 }).start();
  };

  if (variant === 'compact') {
    return (
      <Animated.View style={{ transform: [{ scale }] }}>
        <TouchableOpacity onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut} activeOpacity={1} style={styles.compactCard}>
          <View style={styles.compactAvatarContainer}>
            <Image source={{ uri: teacher.avatar }} style={styles.compactAvatar} />
            {teacher.isOnline && <View style={styles.onlineBadgeSmall}><OnlineIcon size={8} /></View>}
          </View>
          <Text style={styles.compactName} numberOfLines={1}>{teacher.name.split(' ').slice(0, 2).join(' ')}</Text>
          <View style={styles.compactRating}>
            <StarIcon size={12} />
            <Text style={styles.compactRatingText}>{teacher.rating}</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  if (variant === 'list') {
    return (
      <Animated.View style={{ transform: [{ scale }] }}>
        <TouchableOpacity onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut} activeOpacity={1} style={styles.listCard}>
          <View style={styles.listAvatarContainer}>
            <Image source={{ uri: teacher.avatar }} style={styles.listAvatar} />
            {teacher.isOnline && <View style={styles.onlineBadge}><OnlineIcon size={10} /></View>}
          </View>
          <View style={styles.listInfo}>
            <View style={styles.listNameRow}>
              <Text style={styles.listName} numberOfLines={1}>{teacher.name}</Text>
              {teacher.isVerified && <VerifiedIcon size={16} />}
            </View>
            <Text style={styles.listSpecialization} numberOfLines={1}>{teacher.specializations.join(' · ')}</Text>
            <View style={styles.listMeta}>
              <View style={styles.ratingBadge}>
                <StarIcon size={12} />
                <Text style={styles.ratingTextDark}>{teacher.rating}</Text>
                <Text style={styles.reviewCountDark}>({teacher.reviewCount})</Text>
              </View>
              <Text style={styles.listPrice}>{teacher.pricePerSession}/session</Text>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[styles.featuredCard, { transform: [{ scale }] }]}>
      <TouchableOpacity onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut} activeOpacity={1}>
        <View style={styles.featuredImageContainer}>
          <Image source={{ uri: teacher.avatar }} style={styles.featuredAvatar} />
          <LinearGradient colors={['transparent', 'rgba(15, 42, 29, 0.85)']} style={styles.featuredGradient} />
          {teacher.isOnline && (
            <View style={styles.featuredOnlineBadge}>
              <OnlineIcon size={8} />
              <Text style={styles.onlineText}>Online</Text>
            </View>
          )}
          <View style={styles.nextAvailableBadge}>
            <Text style={styles.nextAvailableText}>{teacher.nextAvailable}</Text>
          </View>
          <View style={styles.featuredOverlay}>
            <View style={styles.featuredNameRow}>
              <Text style={styles.featuredName} numberOfLines={1}>{teacher.name}</Text>
              {teacher.isVerified && <VerifiedIcon size={16} color="#fff" />}
            </View>
            <Text style={styles.featuredCountry}>{teacher.country}</Text>
          </View>
        </View>
        <View style={styles.featuredBody}>
          <View style={styles.specRow}>
            {teacher.specializations.slice(0, 3).map((spec, i) => (
              <View key={i} style={styles.specBadge}>
                <Text style={styles.specText}>{spec}</Text>
              </View>
            ))}
          </View>
          <View style={styles.featuredFooter}>
            <View style={styles.ratingBadge}>
              <StarIcon size={14} />
              <Text style={styles.ratingTextDark}>{teacher.rating}</Text>
              <Text style={styles.reviewCountDark}>({teacher.reviewCount})</Text>
            </View>
            <Text style={styles.featuredPrice}>{teacher.pricePerSession}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  featuredCard: { width: CARD_WIDTH, backgroundColor: Colors.neutral[0], borderRadius: BorderRadius.xl, marginRight: Spacing.lg, overflow: 'hidden', ...Shadows.md },
  featuredImageContainer: { width: '100%', height: 200, position: 'relative' },
  featuredAvatar: { width: '100%', height: '100%', resizeMode: 'cover' },
  featuredGradient: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 120 },
  featuredOnlineBadge: { position: 'absolute', top: Spacing.md, left: Spacing.md, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(45,159,90,0.9)', paddingHorizontal: Spacing.sm, paddingVertical: 4, borderRadius: BorderRadius.full, gap: 4 },
  onlineText: { color: '#fff', fontSize: 11, fontFamily: 'Inter-SemiBold' },
  nextAvailableBadge: { position: 'absolute', top: Spacing.md, right: Spacing.md, backgroundColor: 'rgba(201,168,76,0.9)', paddingHorizontal: Spacing.sm, paddingVertical: 4, borderRadius: BorderRadius.full },
  nextAvailableText: { color: '#fff', fontSize: 11, fontFamily: 'Inter-SemiBold' },
  featuredOverlay: { position: 'absolute', bottom: Spacing.md, left: Spacing.md, right: Spacing.md },
  featuredNameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  featuredName: { color: '#fff', fontSize: 17, fontFamily: 'Inter-SemiBold', flex: 1 },
  featuredCountry: { color: 'rgba(255,255,255,0.7)', fontSize: 13, fontFamily: 'Inter', marginTop: 2 },
  featuredBody: { padding: Spacing.lg },
  specRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.md },
  specBadge: { backgroundColor: `${Colors.primary[500]}15`, paddingHorizontal: Spacing.sm, paddingVertical: 4, borderRadius: BorderRadius.full },
  specText: { color: Colors.primary[600], fontSize: 12, fontFamily: 'Inter-Medium' },
  featuredFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  featuredPrice: { fontSize: 18, fontFamily: 'PlayfairDisplay-Bold', color: Colors.primary[600] },

  listCard: { flexDirection: 'row', backgroundColor: Colors.neutral[0], borderRadius: BorderRadius.lg, padding: Spacing.lg, marginBottom: Spacing.md, ...Shadows.sm },
  listAvatarContainer: { position: 'relative', marginRight: Spacing.md },
  listAvatar: { width: 56, height: 56, borderRadius: 28 },
  onlineBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#fff', borderRadius: BorderRadius.full, padding: 2 },
  listInfo: { flex: 1, justifyContent: 'center' },
  listNameRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 3 },
  listName: { fontSize: 16, fontFamily: 'Inter-SemiBold', color: Colors.neutral[800], flex: 1 },
  listSpecialization: { fontSize: 13, color: Colors.neutral[500], fontFamily: 'Inter', marginBottom: 6 },
  listMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  listPrice: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: Colors.primary[500] },

  compactCard: { alignItems: 'center', width: 80, marginRight: Spacing.lg },
  compactAvatarContainer: { position: 'relative', marginBottom: Spacing.sm },
  compactAvatar: { width: 64, height: 64, borderRadius: 32, borderWidth: 2, borderColor: Colors.gold[400] },
  onlineBadgeSmall: { position: 'absolute', bottom: 2, right: 2, backgroundColor: '#fff', borderRadius: BorderRadius.full, padding: 2 },
  compactName: { fontSize: 12, fontFamily: 'Inter-Medium', color: Colors.neutral[700], textAlign: 'center' },
  compactRating: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 2 },
  compactRatingText: { fontSize: 11, fontFamily: 'Inter-SemiBold', color: Colors.neutral[600] },

  ratingBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingTextDark: { fontSize: 14, fontFamily: 'Inter-SemiBold', color: Colors.neutral[800] },
  reviewCountDark: { fontSize: 12, color: Colors.neutral[400], fontFamily: 'Inter' },
});
