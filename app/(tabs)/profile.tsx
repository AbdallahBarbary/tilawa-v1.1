import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle, Line, Polygon } from 'react-native-svg';
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

// ─── Ceremonial badge SVG icons — brand palette only ──────────────────
// Sessions: 8-pointed Islamic star seal — conveys mastery, completion
const SessionsBadgeIcon = () => (
  <Svg width={36} height={36} viewBox="0 0 36 36" fill="none">
    <Polygon
      points="18,3 21.5,10.5 29.5,8 27,16 34.5,18 27,20 29.5,28 21.5,25.5 18,33 14.5,25.5 6.5,28 9,20 1.5,18 9,16 6.5,8 14.5,10.5"
      fill={Colors.primary[700]}
      stroke={Colors.gold[500]}
      strokeWidth="0.8"
    />
    <Circle cx="18" cy="18" r="7" fill={Colors.primary[800]} stroke={Colors.gold[400]} strokeWidth="0.6" />
    <Path d="M15 18L17 20L21 16" stroke={Colors.gold[400]} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// Streak: Flame — the fire of consistent devotion
const StreakBadgeIcon = () => (
  <Svg width={36} height={36} viewBox="0 0 36 36" fill="none">
    <Circle cx="18" cy="18" r="16" fill={Colors.primary[700]} stroke={Colors.gold[500]} strokeWidth="0.8" />
    <Path
      d="M18 6C18 6 12 12 12 19C12 23.4 14.8 26 18 26C21.2 26 24 23.4 24 19C24 12 18 6 18 6Z"
      fill={Colors.gold[600]}
      opacity={0.3}
    />
    <Path
      d="M18 10C18 10 14 15 14 20C14 22.8 15.8 25 18 25C20.2 25 22 22.8 22 20C22 15 18 10 18 10Z"
      fill={Colors.gold[500]}
    />
    <Circle cx="18" cy="20" r="3.5" fill={Colors.primary[800]} />
    <Circle cx="18" cy="20" r="1.5" fill={Colors.gold[300]} />
  </Svg>
);

// Surahs: Open mushaf (Quran) — the source and goal
const SurahsBadgeIcon = () => (
  <Svg width={36} height={36} viewBox="0 0 36 36" fill="none">
    <Circle cx="18" cy="18" r="16" fill={Colors.primary[600]} stroke={Colors.gold[500]} strokeWidth="0.8" />
    <Path d="M8 10H15C16.7 10 18 11.3 18 13V28C18 26.3 16.7 25 15 25H8V10Z" fill="rgba(255,255,255,0.25)" />
    <Path d="M28 10H21C19.3 10 18 11.3 18 13V28C18 26.3 19.3 25 21 25H28V10Z" fill="rgba(255,255,255,0.18)" />
    <Line x1="18" y1="13" x2="18" y2="28" stroke={Colors.gold[400]} strokeWidth="0.8" />
    <Line x1="10" y1="14" x2="16" y2="14" stroke="rgba(255,255,255,0.5)" strokeWidth="0.8" />
    <Line x1="10" y1="16.5" x2="16" y2="16.5" stroke="rgba(255,255,255,0.5)" strokeWidth="0.8" />
    <Line x1="10" y1="19" x2="14" y2="19" stroke="rgba(255,255,255,0.5)" strokeWidth="0.8" />
    <Line x1="20" y1="14" x2="26" y2="14" stroke="rgba(255,255,255,0.5)" strokeWidth="0.8" />
    <Line x1="20" y1="16.5" x2="26" y2="16.5" stroke="rgba(255,255,255,0.5)" strokeWidth="0.8" />
    <Line x1="20" y1="19" x2="24" y2="19" stroke="rgba(255,255,255,0.5)" strokeWidth="0.8" />
  </Svg>
);

// Juz: Crescent with dot — the Islamic marker of divine completion
const JuzBadgeIcon = () => (
  <Svg width={36} height={36} viewBox="0 0 36 36" fill="none">
    <Circle cx="18" cy="18" r="16" fill={Colors.primary[800]} stroke={Colors.gold[500]} strokeWidth="0.8" />
    <Path
      d="M22 10C19.5 10 17.2 11 15.5 12.7C13.8 14.4 13 16.6 13 19C13 21.4 13.9 23.6 15.5 25.3C17.2 27 19.5 28 22 28C19 28 16.3 26.6 14.5 24.4C12.7 22.2 12 19.6 12.5 17C13.3 12.5 17.3 9 22 10Z"
      fill={Colors.gold[500]}
      opacity={0.9}
    />
    <Circle cx="24" cy="12" r="2" fill={Colors.gold[400]} />
  </Svg>
);

// ─── Achievement data with custom badge components ─────────────────────
const achievements = [
  { BadgeIcon: SessionsBadgeIcon, num: '47', label: 'Sessions', sub: 'Completed' },
  { BadgeIcon: StreakBadgeIcon, num: '12', label: 'Day Streak', sub: 'Active' },
  { BadgeIcon: SurahsBadgeIcon, num: '8', label: 'Surahs', sub: 'Memorized' },
  { BadgeIcon: JuzBadgeIcon, num: '3', label: 'Juz', sub: 'Completed' },
];

// ─── Edit icon — replaces emoji pencil ────────────────────────────────
const PencilIcon = () => (
  <Svg width={12} height={12} viewBox="0 0 12 12" fill="none">
    <Path d="M8.5 1.5L10.5 3.5L4 10H2V8L8.5 1.5Z" stroke={Colors.primary[600]} strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

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
            <View style={styles.patternCircle1} />
            <View style={styles.patternCircle2} />

            <View style={styles.avatarContainer}>
              <View style={styles.avatarRing}>
                <Image source={{ uri: 'https://randomuser.me/api/portraits/men/90.jpg' }} style={styles.avatar} />
              </View>
              <View style={styles.editBadge}>
                <PencilIcon />
              </View>
            </View>

            <Text style={styles.name}>Abdullah Rahman</Text>
            <Text style={styles.nameAr}>عبد الله رحمن</Text>
            <Text style={styles.email}>abdullah@example.com</Text>

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

        {/* Achievements — ceremonial badge grid */}
        <Animated.View style={[styles.achievementsSection, { opacity: menuAnim }]}>
          <Text style={styles.achievementsTitle}>ACHIEVEMENTS</Text>
          <View style={styles.achievementsRow}>
            {achievements.map((a, i) => (
              <View key={i} style={styles.achievementCard}>
                {/* Dark green gradient background — medal feel */}
                <LinearGradient
                  colors={['#0F2A1D', '#1E4620']}
                  style={styles.achievementGradient}
                >
                  {/* Gold top accent line */}
                  <View style={styles.achievementAccent} />

                  <a.BadgeIcon />

                  <Text style={styles.achievementNum}>{a.num}</Text>
                  <Text style={styles.achievementLabel}>{a.label}</Text>
                  <Text style={styles.achievementSub}>{a.sub}</Text>
                </LinearGradient>
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
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>
        </Animated.View>

        <Text style={styles.version}>Tilawa v1.1.0 · For the love of the Quran</Text>
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
  patternCircle1: {
    position: 'absolute', width: 200, height: 200, borderRadius: 100,
    borderWidth: 1, borderColor: 'rgba(201,168,76,0.12)', top: -60, right: -40,
  },
  patternCircle2: {
    position: 'absolute', width: 140, height: 140, borderRadius: 70,
    borderWidth: 1, borderColor: 'rgba(201,168,76,0.08)', bottom: -20, left: -30,
  },

  avatarContainer: { position: 'relative', marginBottom: Spacing.lg },
  avatarRing: { padding: 3, borderRadius: 52, borderWidth: 2.5, borderColor: Colors.gold[500] },
  avatar: { width: 88, height: 88, borderRadius: 44 },
  editBadge: {
    position: 'absolute', bottom: 2, right: 2,
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: Colors.neutral[0],
    alignItems: 'center', justifyContent: 'center',
    ...Shadows.sm,
    borderWidth: 1,
    borderColor: Colors.neutral[150],
  },

  name: { fontFamily: 'PlayfairDisplay-Bold', fontSize: 22, color: '#fff', letterSpacing: -0.2 },
  nameAr: { fontSize: 15, color: 'rgba(201,168,76,0.7)', marginTop: 2, marginBottom: 4 },
  email: { fontFamily: 'Inter', fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 4 },

  statRow: {
    flexDirection: 'row', marginTop: Spacing.xl,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.lg, paddingHorizontal: Spacing.xl, width: '100%',
  },
  statBox: { flex: 1, alignItems: 'center' },
  statVal: { fontFamily: 'PlayfairDisplay-Bold', fontSize: 22, color: '#fff', letterSpacing: -0.3 },
  statLbl: { fontFamily: 'Inter', fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 4 },
  statDiv: { width: 1, backgroundColor: 'rgba(255,255,255,0.12)' },

  // Achievement badges — ceremonial, earned, scholarly
  achievementsSection: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.xl },
  achievementsTitle: {
    fontFamily: 'Inter-SemiBold', fontSize: 10, color: Colors.neutral[500],
    letterSpacing: 2.5, marginBottom: Spacing.md,
  },
  achievementsRow: { flexDirection: 'row', gap: Spacing.sm },
  achievementCard: {
    flex: 1,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Shadows.md,
    // Warm gold shadow — not generic grey
    shadowColor: Colors.gold[500],
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  achievementGradient: {
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 6,
    gap: 4,
    position: 'relative',
  },
  achievementAccent: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: 2,
    backgroundColor: Colors.gold[500],
    opacity: 0.7,
  },
  achievementNum: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 18,
    color: '#fff',
    letterSpacing: -0.5,
    marginTop: 2,
  },
  achievementLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 10,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  achievementSub: {
    fontFamily: 'Inter',
    fontSize: 9,
    color: Colors.gold[400],
    textAlign: 'center',
    letterSpacing: 0.5,
    opacity: 0.8,
  },

  menuSection: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.xl },
  menuItem: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.neutral[0], borderRadius: BorderRadius.xl,
    padding: Spacing.lg, marginBottom: Spacing.md, ...Shadows.xs,
  },
  menuIcon: {
    width: 44, height: 44, borderRadius: BorderRadius.md,
    justifyContent: 'center', alignItems: 'center', marginRight: Spacing.md,
  },
  menuInfo: { flex: 1 },
  menuLabel: { fontFamily: 'Inter-SemiBold', fontSize: 15, color: Colors.neutral[800] },
  menuDesc: { fontFamily: 'Inter', fontSize: 12, color: Colors.neutral[400], marginTop: 2 },

  logoutBtn: {
    marginHorizontal: Spacing.xl, marginTop: Spacing.lg,
    paddingVertical: Spacing.lg, borderRadius: BorderRadius.xl,
    borderWidth: 1.5, borderColor: `${Colors.error}35`, alignItems: 'center',
  },
  logoutText: { fontFamily: 'Inter-SemiBold', fontSize: 15, color: Colors.error },
  version: {
    textAlign: 'center', fontFamily: 'Inter', fontSize: 11,
    color: Colors.neutral[400], marginTop: Spacing.xl, letterSpacing: 0.2,
  },
});
