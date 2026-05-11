import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated } from 'react-native';
import { Colors, BorderRadius, Spacing, Shadows } from '../constants/theme';
import { ClockIcon, VideoIcon } from './Icons';
import type { Session } from '../constants/mockData';

const typeColors: Record<string, string> = {
  tajweed: Colors.primary[500],
  hifz: Colors.primary[700],
  tafseer: Colors.gold[500],
  recitation: Colors.primary[400],
};

interface SessionCardProps {
  session: Session;
  onPress?: () => void;
}

export const SessionCard: React.FC<SessionCardProps> = ({ session, onPress }) => {
  const scale = useRef(new Animated.Value(1)).current;
  const isUpcoming = session.status === 'upcoming';
  const accentColor = typeColors[session.type] || Colors.primary[500];

  return (
    <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={() => Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, damping: 18, stiffness: 220 }).start()}
        onPressOut={() => Animated.spring(scale, { toValue: 1, useNativeDriver: true, damping: 18, stiffness: 220 }).start()}
        activeOpacity={1}
      >
        <View style={[styles.accent, { backgroundColor: accentColor }]} />
        <View style={styles.content}>
          <View style={styles.topRow}>
            <Image source={{ uri: session.teacherAvatar }} style={styles.avatar} />
            <View style={styles.info}>
              <Text style={styles.subject} numberOfLines={1}>{session.subject}</Text>
              <Text style={styles.teacher}>{session.teacherName}</Text>
            </View>
            {isUpcoming && (
              <View style={styles.joinBtn}>
                <VideoIcon size={16} color="#fff" />
                <Text style={styles.joinText}>Join</Text>
              </View>
            )}
          </View>
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <ClockIcon size={14} color={Colors.neutral[400]} />
              <Text style={styles.metaText}>{session.date} · {session.time}</Text>
            </View>
            <View style={[styles.typeBadge, { backgroundColor: accentColor + '15' }]}>
              <Text style={[styles.typeText, { color: accentColor }]}>
                {session.type.charAt(0).toUpperCase() + session.type.slice(1)}
              </Text>
            </View>
            <Text style={styles.duration}>{session.duration}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: { flexDirection: 'row', backgroundColor: Colors.neutral[0], borderRadius: BorderRadius.lg, marginBottom: Spacing.md, overflow: 'hidden', ...Shadows.sm },
  accent: { width: 4, borderTopLeftRadius: BorderRadius.lg, borderBottomLeftRadius: BorderRadius.lg },
  content: { flex: 1, padding: Spacing.lg },
  topRow: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.md },
  avatar: { width: 42, height: 42, borderRadius: 21, marginRight: Spacing.md },
  info: { flex: 1 },
  subject: { fontSize: 15, fontFamily: 'Inter-SemiBold', color: Colors.neutral[800] },
  teacher: { fontSize: 13, color: Colors.neutral[500], fontFamily: 'Inter', marginTop: 2 },
  joinBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: Colors.primary[500], paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: BorderRadius.full },
  joinText: { color: '#fff', fontSize: 13, fontFamily: 'Inter-SemiBold' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 12, color: Colors.neutral[400], fontFamily: 'Inter' },
  typeBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: BorderRadius.full },
  typeText: { fontSize: 11, fontFamily: 'Inter-SemiBold' },
  duration: { fontSize: 12, color: Colors.neutral[400], fontFamily: 'Inter', marginLeft: 'auto' },
});
