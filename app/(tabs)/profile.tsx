import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { userStats } from '../../constants/mockData';
import { SettingsIcon, ChevronRightIcon, BookOpenIcon, HeartIcon, StarIcon, BellIcon, GlobeIcon } from '../../components/Icons';

const menuItems = [
  { icon: BookOpenIcon, label: 'My Learning', desc: 'Progress & achievements', color: Colors.primary[500] },
  { icon: HeartIcon, label: 'Saved Teachers', desc: 'Your favourites', color: Colors.error },
  { icon: StarIcon, label: 'Reviews', desc: 'Sessions you reviewed', color: Colors.gold[500] },
  { icon: BellIcon, label: 'Notifications', desc: 'Manage alerts', color: Colors.info },
  { icon: GlobeIcon, label: 'Language', desc: 'English', color: Colors.primary[400] },
  { icon: SettingsIcon, label: 'Settings', desc: 'Account & preferences', color: Colors.neutral[600] },
];

const achievements = [
  { emoji: '🌟', label: '47 Sessions' },
  { emoji: '🔥', label: '12 Day Streak' },
  { emoji: '📖', label: '8 Surahs' },
  { emoji: '🎓', label: '3 Juz' },
];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();

  const headerAnim = useRef(new Animated.Value(0)).current;
  const menuAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(headerAnim, { toValue: 1, duration: 450, useNativeDriver: true }),
      Animated.timing(menuAnim, { toValue: 1, duration: 350, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Profile Header */}
        <Animated.View style={{ opacity: headerAnim }}>
          <LinearGradient colors={['#040D09', '#0F2A1D', '#1E4620']} style={styles.profileHeader}>
            {/* Pattern */}
            <View style={styles.patternCircle1} />
            <View style={styles.patternCircle2} />

            <View style={styles.avatarContainer}>
              <View style={styles.avatarRing}>
                <Image source={{ uri: 'https://i.pravatar.cc/200?img=68' }} style={styles.avatar} />
              </View>
              <View style={styles.editBadge}>
                <Text style={styles.editBadgeText}>✏️</Text>
              </View>
            </View>

            <Text style={styles.name}>Abdullah Rahman</Text>
            <Text style={styles.email}>abdullah@example.com</Text>

            {/* Stats */}
            <View style={styles.statRow}>
              {[
                { val: userStats.sessionsCompleted, lbl: 'Sessions' },
                { val: `${userStats.hoursLearned}h`, lbl: 'Learned' },
                { val: userStats.surahsMemorized, lbl: 'Surahs' },
              ].map((s, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <View style={styles.statDiv} />}
                  <View style={styles.statBox}>
                    <Text style={styles.statVal}>{s.val}</Text>
                    <Text style={styles.statLbl}>{s.lbl}</Text>
                  </View>
                </React.Fragment>
              ))}
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Achievements */}
        <Animated.View style={[styles.achievementsSection, { opacity: menuAnim }]}>
          <Text style={styles.achievementsTitle}>Achievements</Text>
          <View style={styles.achievementsRow}>
            {achievements.map((a, i) => (
              <View key={i} style={styles.achievementCard}>
                <Text style={styles.achievementEmoji}>{a.emoji}</Text>
                <Text style={styles.achievementLabel}>{a.label}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Menu */}
        <Animated.View style={[styles.menuSection, { opacity: menuAnim }]}>
          {menuItems.map((item) => (
            <TouchableOpacity key={item.label} style={styles.menuItem} activeOpacity={0.82}>
              <View style={[styles.menuIcon, { backgroundColor: `${item.color}15` }]}>
                <item.icon size={20} color={item.color} />
              </View>
              <View style={styles.menuInfo}>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Text style={styles.menuDesc}>{item.desc}</Text>
              </View>
              <ChevronRightIcon size={17} color={Colors.neutral[300]} />
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* Logout */}
        <Animated.View style={{ opacity: menuAnim }}>
          <TouchableOpacity style={styles.logoutBtn} activeOpacity={0.8}>
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </Animated.View>

        <Text style={styles.version}>Tilawa v1.0.0</Text>
        <View style={{ height: 16 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.neutral[100] },
  scroll: { paddingBottom: 24 },

  profileHeader: {
    alignItems: 'center',
    paddingVertical: Spacing['4xl'],
    paddingHorizontal: Spacing.xl,
    borderBottomLeftRadius: BorderRadius['3xl'],
    borderBottomRightRadius: BorderRadius['3xl'],
    overflow: 'hidden',
  },
  patternCircle1: { position: 'absolute', width: 200, height: 200, borderRadius: 100, borderWidth: 1, borderColor: 'rgba(201,168,76,0.12)', top: -60, right: -40 },
  patternCircle2: { position: 'absolute', width: 140, height: 140, borderRadius: 70, borderWidth: 1, borderColor: 'rgba(201,168,76,0.08)', bottom: -20, left: -30 },

  avatarContainer: { position: 'relative', marginBottom: Spacing.lg },
  avatarRing: { padding: 3, borderRadius: 52, borderWidth: 2.5, borderColor: Colors.gold[500] },
  avatar: { width: 88, height: 88, borderRadius: 44 },
  editBadge: { position: 'absolute', bottom: 2, right: 2, width: 26, height: 26, borderRadius: 13, backgroundColor: Colors.neutral[0], alignItems: 'center', justifyContent: 'center', ...Shadows.sm },
  editBadgeText: { fontSize: 12 },

  name: { fontFamily: 'PlayfairDisplay-Bold', fontSize: 22, color: '#fff', letterSpacing: -0.2 },
  email: { fontFamily: 'Inter', fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 4 },

  statRow: { flexDirection: 'row', marginTop: Spacing.xl, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: BorderRadius.xl, paddingVertical: Spacing.lg, paddingHorizontal: Spacing.xl, width: '100%' },
  statBox: { flex: 1, alignItems: 'center' },
  statVal: { fontFamily: 'PlayfairDisplay-Bold', fontSize: 22, color: '#fff', letterSpacing: -0.3 },
  statLbl: { fontFamily: 'Inter', fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 4 },
  statDiv: { width: 1, backgroundColor: 'rgba(255,255,255,0.12)' },

  achievementsSection: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.xl },
  achievementsTitle: { fontFamily: 'Inter-SemiBold', fontSize: 14, color: Colors.neutral[600], letterSpacing: 0.5, marginBottom: Spacing.md },
  achievementsRow: { flexDirection: 'row', gap: Spacing.md },
  achievementCard: { flex: 1, backgroundColor: Colors.neutral[0], borderRadius: BorderRadius.lg, paddingVertical: 14, alignItems: 'center', gap: 6, ...Shadows.xs },
  achievementEmoji: { fontSize: 22 },
  achievementLabel: { fontFamily: 'Inter-Medium', fontSize: 11, color: Colors.neutral[600], textAlign: 'center' },

  menuSection: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.xl },
  menuItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.neutral[0], borderRadius: BorderRadius.xl, padding: Spacing.lg, marginBottom: Spacing.md, ...Shadows.xs },
  menuIcon: { width: 44, height: 44, borderRadius: BorderRadius.md, justifyContent: 'center', alignItems: 'center', marginRight: Spacing.md },
  menuInfo: { flex: 1 },
  menuLabel: { fontFamily: 'Inter-SemiBold', fontSize: 15, color: Colors.neutral[800] },
  menuDesc: { fontFamily: 'Inter', fontSize: 12, color: Colors.neutral[400], marginTop: 2 },

  logoutBtn: { marginHorizontal: Spacing.xl, marginTop: Spacing.lg, paddingVertical: Spacing.lg, borderRadius: BorderRadius.xl, borderWidth: 1.5, borderColor: `${Colors.error}35`, alignItems: 'center' },
  logoutText: { fontFamily: 'Inter-SemiBold', fontSize: 15, color: Colors.error },
  version: { textAlign: 'center', fontFamily: 'Inter', fontSize: 12, color: Colors.neutral[400], marginTop: Spacing.xl },
});
