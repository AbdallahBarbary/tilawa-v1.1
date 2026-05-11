import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { upcomingSessions, completedSessions } from '../../constants/mockData';
import { SessionCard } from '../../components/SessionCard';

type Tab = 'upcoming' | 'completed';

export default function SessionsScreen() {
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<Tab>('upcoming');
  const sessions = tab === 'upcoming' ? upcomingSessions : completedSessions;

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, delay: 60, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, delay: 60, useNativeDriver: true, damping: 22, stiffness: 200 }),
    ]).start();
  }, []);

  const switchTab = (t: Tab) => {
    Animated.timing(fadeAnim, { toValue: 0, duration: 120, useNativeDriver: true }).start(() => {
      setTab(t);
      Animated.timing(fadeAnim, { toValue: 1, duration: 220, useNativeDriver: true }).start();
    });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <Text style={styles.title}>My Sessions</Text>
        <Text style={styles.subtitle}>Track your learning journey</Text>
      </Animated.View>

      {/* Toggle */}
      <View style={styles.toggleWrap}>
        <View style={styles.toggle}>
          <TouchableOpacity
            onPress={() => switchTab('upcoming')}
            style={[styles.toggleBtn, tab === 'upcoming' && styles.toggleBtnActive]}
            activeOpacity={0.8}
          >
            <Text style={[styles.toggleText, tab === 'upcoming' && styles.toggleTextActive]}>
              Upcoming ({upcomingSessions.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => switchTab('completed')}
            style={[styles.toggleBtn, tab === 'completed' && styles.toggleBtnActive]}
            activeOpacity={0.8}
          >
            <Text style={[styles.toggleText, tab === 'completed' && styles.toggleTextActive]}>
              Completed ({completedSessions.length})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <Animated.ScrollView
        style={{ flex: 1, opacity: fadeAnim }}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      >
        {sessions.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📅</Text>
            <Text style={styles.emptyTitle}>No sessions yet</Text>
            <Text style={styles.emptyDesc}>
              {tab === 'upcoming'
                ? 'Book a session with a teacher to get started'
                : 'Your completed sessions will appear here'}
            </Text>
          </View>
        ) : (
          sessions.map((session) => (
            <SessionCard key={session.id} session={session} />
          ))
        )}
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.neutral[100] },
  header: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.lg },
  title: { fontFamily: 'PlayfairDisplay-Bold', fontSize: 26, color: Colors.neutral[900], letterSpacing: -0.3 },
  subtitle: { fontFamily: 'Inter', fontSize: 13, color: Colors.neutral[500], marginTop: 3 },
  toggleWrap: { paddingHorizontal: Spacing.xl, paddingVertical: Spacing.xl },
  toggle: {
    flexDirection: 'row', backgroundColor: Colors.neutral[0],
    borderRadius: BorderRadius.xl, padding: 4, ...Shadows.sm,
  },
  toggleBtn: { flex: 1, paddingVertical: 10, borderRadius: BorderRadius.lg, alignItems: 'center' },
  toggleBtnActive: { backgroundColor: Colors.primary[500] },
  toggleText: { fontFamily: 'Inter-Medium', fontSize: 13, color: Colors.neutral[500] },
  toggleTextActive: { fontFamily: 'Inter-SemiBold', color: '#fff' },
  list: { paddingHorizontal: Spacing.xl, paddingBottom: 24 },
  emptyState: { alignItems: 'center', paddingVertical: 56 },
  emptyIcon: { fontSize: 40, marginBottom: 16 },
  emptyTitle: { fontFamily: 'Inter-SemiBold', fontSize: 18, color: Colors.neutral[700] },
  emptyDesc: { fontFamily: 'Inter', fontSize: 14, color: Colors.neutral[400], marginTop: 8, textAlign: 'center', paddingHorizontal: 32 },
});
