import React, { useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  FlatList, Animated, Dimensions, Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Svg, { Path, Circle, G, Line } from 'react-native-svg';
import { Colors, Spacing, Shadows } from '../../constants/theme';
import { featuredTeachers, categories, userStats, upcomingSessions } from '../../constants/mockData';
import { BellIcon, FireIcon, ChevronRightIcon, StarIcon } from '../../components/Icons';

const { width: SW } = Dimensions.get('window');

// ─── Fade-in hook ─────────────────────────────────────────────────────
function useFadeIn(delay = 0) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 480, delay, useNativeDriver: true }),
      Animated.spring(translateY, { toValue: 0, delay, useNativeDriver: true, damping: 24, stiffness: 200 }),
    ]).start();
  }, []);
  return { opacity, transform: [{ translateY }] };
}

// ─── Tajweed Progress Ring ─────────────────────────────────────────────
// Signature moment: circular arc compass, not a flat progress bar
const RING_R = 50;
const RING_CIRC = 2 * Math.PI * RING_R; // ≈ 314.16

const ProgressRing: React.FC<{ pct: number }> = ({ pct }) => {
  const filled = RING_CIRC * (pct / 100);
  return (
    <Svg width={126} height={126} viewBox="0 0 126 126">
      {/* Dashed outer ring — suggests a compass or measuring tool */}
      <Circle cx="63" cy="63" r="60" stroke="rgba(201,168,76,0.10)" strokeWidth={1} fill="none" strokeDasharray="2 6" />
      {/* Grey track */}
      <Circle cx="63" cy="63" r={RING_R} stroke="rgba(255,255,255,0.08)" strokeWidth={8} fill="none" strokeLinecap="round" />
      {/* Gold fill — starts at 12 o'clock via SVG transform rotate */}
      <Circle
        cx="63" cy="63" r={RING_R}
        stroke={Colors.gold[500]}
        strokeWidth={8}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={`${filled} ${RING_CIRC - filled}`}
        transform="rotate(-90, 63, 63)"
      />
      {/* Terminal dot — end cap marker */}
      <Circle
        cx="63" cy="63" r={RING_R}
        stroke={Colors.gold[300]}
        strokeWidth={2}
        fill="none"
        strokeDasharray={`0 ${filled} 3 ${RING_CIRC}`}
        transform="rotate(-90, 63, 63)"
      />
      {/* Inner void circle */}
      <Circle cx="63" cy="63" r="38" fill="rgba(0,0,0,0.18)" />
    </Svg>
  );
};

// ─── Islamic Geometric Lattice ─────────────────────────────────────────
// Muqarnas-inspired — subtler than stars, more architectural
const IslamicLattice = () => (
  <Svg
    width={200} height={200}
    viewBox="0 0 200 200"
    style={StyleSheet.absoluteFillObject}
    opacity={0.06}
  >
    <G stroke="#C9A84C" strokeWidth={0.8} fill="none">
      {/* Central star octagon */}
      <Path d="M100 18L118 55L158 55L128 78L140 118L100 96L60 118L72 78L42 55L82 55Z" />
      <Path d="M100 44L112 66L136 66L118 80L126 104L100 89L74 104L82 80L64 66L88 66Z" />
      <Circle cx="100" cy="100" r="26" />
      <Circle cx="100" cy="100" r="16" strokeDasharray="2 6" />
      {/* Corner quarter-stars */}
      <Path d="M8 8L28 38M192 8L172 38M8 192L28 162M192 192L172 162" />
      <Path d="M8 8L38 8L38 28M192 8L162 8L162 28M8 192L8 162L28 162M192 192L192 162L172 162" />
      {/* Mid-edge accents */}
      <Line x1="100" y1="0" x2="100" y2="18" />
      <Line x1="100" y1="182" x2="100" y2="200" />
      <Line x1="0" y1="100" x2="18" y2="100" />
      <Line x1="182" y1="100" x2="200" y2="100" />
    </G>
  </Svg>
);

// ─── Section Header ────────────────────────────────────────────────────
const SectionHeader: React.FC<{ title: string; sub?: string; onSeeAll?: () => void }> = ({ title, sub, onSeeAll }) => (
  <View style={sh.wrap}>
    <View>
      <Text style={sh.title}>{title}</Text>
      {sub && <Text style={sh.sub}>{sub}</Text>}
    </View>
    {onSeeAll && (
      <TouchableOpacity onPress={onSeeAll} style={sh.btn} activeOpacity={0.7}>
        <Text style={sh.btnTxt}>See all</Text>
        <ChevronRightIcon size={13} color={Colors.gold[600]} />
      </TouchableOpacity>
    )}
  </View>
);

const sh = StyleSheet.create({
  wrap: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 14, marginTop: 30 },
  title: { fontFamily: 'PlayfairDisplay-Bold', fontSize: 21, color: Colors.neutral[900], letterSpacing: -0.3 },
  sub: { fontFamily: 'Inter', fontSize: 11, color: Colors.neutral[400], marginTop: 3, letterSpacing: 0.3 },
  btn: { flexDirection: 'row', alignItems: 'center', gap: 1, paddingVertical: 4, paddingLeft: 10 },
  btnTxt: { fontFamily: 'Inter-Medium', fontSize: 12, color: Colors.gold[600] },
});

// ─── Invitation Session Card ───────────────────────────────────────────
// Feels like a personal letter, not a calendar entry
const InvitationCard: React.FC<{ session: typeof upcomingSessions[0] }> = ({ session }) => {
  const accent: Record<string, string> = {
    tajweed: Colors.primary[500],
    hifz: Colors.primary[700],
    tafseer: Colors.gold[500],
    recitation: Colors.primary[400],
  };
  const color = accent[session.type] || Colors.primary[500];

  return (
    <View style={inv.card}>
      {/* Ink ribbon — replaces default left border */}
      <View style={[inv.ribbon, { backgroundColor: color }]} />

      <View style={inv.body}>
        {/* Type + time row */}
        <View style={inv.metaRow}>
          <View style={[inv.typePill, { backgroundColor: `${color}18` }]}>
            <View style={[inv.typeDot, { backgroundColor: color }]} />
            <Text style={[inv.typeText, { color }]}>
              {session.type.charAt(0).toUpperCase() + session.type.slice(1)}
            </Text>
          </View>
          <Text style={inv.timeText}>{session.date} · {session.time}</Text>
        </View>

        {/* Subject — Playfair gives it editorial weight */}
        <Text style={inv.subject} numberOfLines={2}>{session.subject}</Text>

        {/* Teacher row + join */}
        <View style={inv.footerRow}>
          <View style={inv.teacherRow}>
            <View style={inv.avatarFrame}>
              <Image source={{ uri: session.teacherAvatar }} style={inv.avatar} />
            </View>
            <View>
              <Text style={inv.withLabel}>with</Text>
              <Text style={inv.teacherName} numberOfLines={1}>
                {session.teacherName.split(' ').slice(0, 3).join(' ')}
              </Text>
            </View>
          </View>

          <TouchableOpacity activeOpacity={0.85} style={inv.joinWrap}>
            <LinearGradient
              colors={[Colors.primary[600], Colors.primary[500]]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={inv.joinBtn}
            >
              <Text style={inv.joinText}>Join  →</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <Text style={inv.durationText}>{session.duration} session</Text>
      </View>
    </View>
  );
};

const inv = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.neutral[0],
    borderRadius: 20,
    overflow: 'hidden',
    ...Shadows.md,
    borderWidth: 1,
    borderColor: Colors.neutral[150],
  },
  ribbon: { width: 3.5, borderTopLeftRadius: 20, borderBottomLeftRadius: 20 },
  body: { flex: 1, paddingHorizontal: 16, paddingVertical: 16 },
  metaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  typePill: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  typeDot: { width: 5, height: 5, borderRadius: 2.5 },
  typeText: { fontFamily: 'Inter-Medium', fontSize: 11, letterSpacing: 0.3 },
  timeText: { fontFamily: 'Inter', fontSize: 11, color: Colors.neutral[400] },
  subject: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 17,
    color: Colors.neutral[900],
    letterSpacing: -0.2,
    lineHeight: 25,
    marginBottom: 14,
  },
  footerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  teacherRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatarFrame: { padding: 2, borderRadius: 999, borderWidth: 1.5, borderColor: `${Colors.gold[500]}70` },
  avatar: { width: 32, height: 32, borderRadius: 16 },
  withLabel: { fontFamily: 'Inter', fontSize: 10, color: Colors.neutral[400], letterSpacing: 0.4 },
  teacherName: { fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.neutral[800] },
  joinWrap: { borderRadius: 12, overflow: 'hidden' },
  joinBtn: { paddingHorizontal: 16, paddingVertical: 10, alignItems: 'center', justifyContent: 'center' },
  joinText: { fontFamily: 'Inter-SemiBold', fontSize: 13, color: '#fff', letterSpacing: 0.2 },
  durationText: { fontFamily: 'Inter', fontSize: 10, color: Colors.neutral[300], marginTop: 10, letterSpacing: 0.3 },
});

// ─── Category Card ─────────────────────────────────────────────────────
// Arabic script as dominant visual — not an icon or colored box
const CAT_COLORS: Record<string, [string, string]> = {
  '1': ['#1C3D1A', '#2D5A27'],
  '2': ['#112611', '#1E4620'],
  '3': ['#7A5500', '#B8930A'],
  '4': ['#0F2A1D', '#1E4620'],
  '5': ['#2B4A2E', '#3E6642'],
  '6': ['#6B4800', '#A37200'],
};

const CategoryCard: React.FC<{ category: typeof categories[0]; onPress: () => void }> = ({ category, onPress }) => {
  const grads = CAT_COLORS[category.id] || ['#1C3D1A', '#2D5A27'];
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.88} style={cc.outer}>
      <LinearGradient colors={grads} start={{ x: 0, y: 0 }} end={{ x: 0.5, y: 1 }} style={cc.card}>
        {/* Arabic letter as background texture — the design's soul */}
        <Text style={cc.watermark}>{category.titleAr}</Text>
        {/* Teacher count pill — top right */}
        <View style={cc.countPill}>
          <Text style={cc.countText}>{category.teacherCount}</Text>
        </View>
        {/* Bottom content */}
        <View style={cc.content}>
          <Text style={cc.arabic}>{category.titleAr}</Text>
          <Text style={cc.latin}>{category.title}</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const cc = StyleSheet.create({
  outer: { width: 116, marginRight: 12, borderRadius: 20, overflow: 'hidden', ...Shadows.md },
  card: { height: 148, paddingHorizontal: 14, paddingVertical: 14, position: 'relative', justifyContent: 'space-between' },
  watermark: {
    position: 'absolute',
    top: -4, right: 2,
    fontSize: 72,
    color: 'rgba(255,255,255,0.055)',
    lineHeight: 88,
    includeFontPadding: false,
  },
  countPill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(201,168,76,0.22)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(201,168,76,0.30)',
  },
  countText: { fontFamily: 'Inter-SemiBold', fontSize: 10, color: Colors.gold[300], letterSpacing: 0.3 },
  content: { gap: 2 },
  arabic: { fontSize: 22, color: 'rgba(255,255,255,0.88)', lineHeight: 32 },
  latin: { fontFamily: 'Inter-Medium', fontSize: 12, color: 'rgba(255,255,255,0.55)', letterSpacing: 0.3 },
});

// ─── Teacher Feature Card ──────────────────────────────────────────────
// Editorial photography-first layout — magazine, not widget
const CARD_W = SW * 0.57;

const TeacherCard: React.FC<{ teacher: typeof featuredTeachers[0]; onPress: () => void }> = ({ teacher, onPress }) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={fc.card}>
    <Image source={{ uri: teacher.avatar }} style={fc.photo} />
    <LinearGradient
      colors={['transparent', 'rgba(6,15,10,0.55)', 'rgba(4,13,9,0.97)']}
      locations={[0.35, 0.65, 1]}
      style={fc.overlay}
    />
    {teacher.isOnline && (
      <View style={fc.onlinePill}>
        <View style={fc.onlineDot} />
        <Text style={fc.onlineText}>Online</Text>
      </View>
    )}
    <View style={fc.pricePill}>
      <Text style={fc.priceText}>{teacher.pricePerSession}</Text>
    </View>
    <View style={fc.info}>
      <Text style={fc.name} numberOfLines={1}>{teacher.name}</Text>
      <Text style={fc.specs} numberOfLines={1}>{teacher.specializations.slice(0, 2).join(' · ')}</Text>
      <View style={fc.ratingRow}>
        <StarIcon size={11} color={Colors.gold[400]} />
        <Text style={fc.ratingVal}>{teacher.rating}</Text>
        <Text style={fc.ratingCt}>({teacher.reviewCount})</Text>
        <View style={fc.dot} />
        <Text style={fc.country}>{teacher.country}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

const fc = StyleSheet.create({
  card: { width: CARD_W, marginRight: 14, borderRadius: 20, overflow: 'hidden', ...Shadows.lg },
  photo: { width: '100%', height: 230, resizeMode: 'cover' },
  overlay: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 170 },
  onlinePill: {
    position: 'absolute', top: 12, left: 12,
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(4,13,9,0.72)',
    paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: 999,
  },
  onlineDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.success },
  onlineText: { fontFamily: 'Inter-Medium', fontSize: 11, color: '#fff' },
  pricePill: {
    position: 'absolute', top: 12, right: 12,
    backgroundColor: Colors.gold[500],
    paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: 999,
  },
  priceText: { fontFamily: 'Inter-SemiBold', fontSize: 12, color: Colors.neutral[950] },
  info: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 14, gap: 4 },
  name: { fontFamily: 'Inter-SemiBold', fontSize: 15, color: '#fff', letterSpacing: -0.1 },
  specs: { fontFamily: 'Inter', fontSize: 12, color: 'rgba(255,255,255,0.55)' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingVal: { fontFamily: 'Inter-SemiBold', fontSize: 12, color: Colors.gold[400] },
  ratingCt: { fontFamily: 'Inter', fontSize: 11, color: 'rgba(255,255,255,0.35)' },
  dot: { width: 2.5, height: 2.5, borderRadius: 1.5, backgroundColor: 'rgba(255,255,255,0.25)' },
  country: { fontFamily: 'Inter', fontSize: 11, color: 'rgba(255,255,255,0.40)' },
});

// ─── Online Now Compact ────────────────────────────────────────────────
const OnlineCard: React.FC<{ teacher: typeof featuredTeachers[0]; onPress: () => void }> = ({ teacher, onPress }) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={oc.card}>
    <View style={oc.ringWrap}>
      {/* Gold halo ring */}
      <View style={oc.halo} />
      <Image source={{ uri: teacher.avatar }} style={oc.avatar} />
      <View style={oc.liveDot} />
    </View>
    <Text style={oc.name} numberOfLines={1}>{teacher.name.split(' ').slice(0, 2).join(' ')}</Text>
    <Text style={oc.spec} numberOfLines={1}>{teacher.specializations[0]}</Text>
    <View style={oc.priceBadge}>
      <Text style={oc.priceText}>{teacher.pricePerSession}</Text>
    </View>
  </TouchableOpacity>
);

const oc = StyleSheet.create({
  card: { width: 86, alignItems: 'center', marginRight: 18 },
  ringWrap: { width: 72, height: 72, alignItems: 'center', justifyContent: 'center', marginBottom: 8, position: 'relative' },
  halo: {
    position: 'absolute',
    top: -4, bottom: -4, left: -4, right: -4,
    borderRadius: 40,
    borderWidth: 1.5,
    borderColor: `${Colors.gold[500]}55`,
  },
  avatar: { width: 66, height: 66, borderRadius: 33 },
  liveDot: {
    position: 'absolute',
    bottom: 2, right: 2,
    width: 12, height: 12,
    borderRadius: 6,
    backgroundColor: Colors.success,
    borderWidth: 2,
    borderColor: Colors.neutral[100],
  },
  name: { fontFamily: 'Inter-SemiBold', fontSize: 12, color: Colors.neutral[800], textAlign: 'center', marginBottom: 2 },
  spec: { fontFamily: 'Inter', fontSize: 10, color: Colors.neutral[400], textAlign: 'center', marginBottom: 7 },
  priceBadge: {
    backgroundColor: `${Colors.primary[500]}15`,
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 999,
  },
  priceText: { fontFamily: 'Inter-SemiBold', fontSize: 10, color: Colors.primary[600] },
});

// ─── Home Screen ───────────────────────────────────────────────────────
export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const a0 = useFadeIn(0);
  const a1 = useFadeIn(90);
  const a2 = useFadeIn(180);
  const a3 = useFadeIn(270);
  const a4 = useFadeIn(360);
  const a5 = useFadeIn(440);

  const score = userStats.tajweedScore;
  const onlineTeachers = featuredTeachers.filter((t) => t.isOnline);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* ── Header ───────────────────────────────────────────────── */}
        <Animated.View style={[styles.header, a0]}>
          <View>
            {/* Arabic greeting — understated, not decorative */}
            <Text style={styles.salaam}>السلام عليكم</Text>
            <Text style={styles.userName}>Abdullah</Text>
          </View>
          <TouchableOpacity style={styles.bellBtn} activeOpacity={0.75}>
            <BellIcon size={20} color={Colors.neutral[700]} />
            <View style={styles.notifPip} />
          </TouchableOpacity>
        </Animated.View>

        {/* ── Progress Hero ─────────────────────────────────────────── */}
        <Animated.View style={a1}>
          <LinearGradient
            colors={['#050F0A', '#0C1E14', '#14301E']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.hero}
          >
            <IslamicLattice />

            {/* Top: label + streak */}
            <View style={styles.heroTop}>
              <Text style={styles.heroLabel}>YOUR JOURNEY</Text>
              <View style={styles.streakPill}>
                <FireIcon size={12} color={Colors.gold[400]} />
                <Text style={styles.streakText}>{userStats.currentStreak} day streak</Text>
              </View>
            </View>

            {/* Ring + stats — the page's visual anchor */}
            <View style={styles.heroBody}>
              <View style={styles.ringContainer}>
                <ProgressRing pct={score} />
                {/* Centered label inside ring */}
                <View style={styles.ringInner}>
                  <Text style={styles.ringPct}>{score}<Text style={styles.ringPctSign}>%</Text></Text>
                  <Text style={styles.ringCaption}>TAJWEED</Text>
                </View>
              </View>

              {/* Four stats as a vertical list — breathes more than a grid */}
              <View style={styles.statsVert}>
                {[
                  { val: `${userStats.sessionsCompleted}`, lbl: 'Sessions' },
                  { val: `${userStats.hoursLearned}h`, lbl: 'Learned' },
                  { val: `${userStats.surahsMemorized}`, lbl: 'Surahs' },
                  { val: `${userStats.juzCompleted}`, lbl: 'Juz done' },
                ].map((s, i) => (
                  <View key={i} style={[styles.statRow, i < 3 && styles.statRowBorder]}>
                    <Text style={styles.statVal}>{s.val}</Text>
                    <Text style={styles.statLbl}>{s.lbl}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Gold rule + motivational line */}
            <View style={styles.goldRule} />
            <Text style={styles.heroHint}>
              {100 - score}% to mastery · keep your streak going
            </Text>
          </LinearGradient>
        </Animated.View>

        {/* ── Next Session ────────────────────────────────────────── */}
        {upcomingSessions.length > 0 && (
          <Animated.View style={a2}>
            <SectionHeader
              title="Next Session"
              sub="Tap join when you're ready"
              onSeeAll={() => router.push('/(tabs)/sessions')}
            />
            <InvitationCard session={upcomingSessions[0]} />
          </Animated.View>
        )}

        {/* ── Explore ─────────────────────────────────────────────── */}
        <Animated.View style={a3}>
          <SectionHeader
            title="Explore"
            sub="Choose your discipline"
            onSeeAll={() => router.push('/(tabs)/search')}
          />
          <FlatList
            data={categories}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingRight: 20 }}
            renderItem={({ item }) => (
              <CategoryCard category={item} onPress={() => router.push('/(tabs)/search')} />
            )}
          />
        </Animated.View>

        {/* ── Scholars ─────────────────────────────────────────────── */}
        <Animated.View style={a4}>
          <SectionHeader
            title="Scholars"
            sub="Highly rated · verified ijazah"
            onSeeAll={() => router.push('/(tabs)/search')}
          />
          <FlatList
            data={featuredTeachers}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingRight: 20 }}
            renderItem={({ item }) => (
              <TeacherCard teacher={item} onPress={() => router.push(`/teacher/${item.id}`)} />
            )}
          />
        </Animated.View>

        {/* ── Online Now ────────────────────────────────────────────── */}
        <Animated.View style={a5}>
          <SectionHeader
            title="Online Now"
            sub={`${onlineTeachers.length} teachers available`}
          />
          <FlatList
            data={onlineTeachers}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingRight: 20 }}
            renderItem={({ item }) => (
              <OnlineCard teacher={item} onPress={() => router.push(`/teacher/${item.id}`)} />
            )}
          />
        </Animated.View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

// ─── Global styles ─────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.neutral[100] },
  scroll: { paddingHorizontal: Spacing.xl, paddingBottom: 16 },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xs,
  },
  salaam: {
    fontFamily: 'Inter',
    fontSize: 13,
    color: Colors.neutral[400],
    letterSpacing: 0.4,
    marginBottom: 3,
  },
  userName: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 28,
    color: Colors.neutral[900],
    letterSpacing: -0.5,
  },
  bellBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.neutral[0],
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  notifPip: {
    position: 'absolute',
    top: 11,
    right: 11,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: Colors.error,
    borderWidth: 1.5,
    borderColor: Colors.neutral[100],
  },

  // Hero card
  hero: {
    borderRadius: 24,
    padding: 22,
    marginTop: 18,
    overflow: 'hidden',
    ...Shadows.lg,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 22,
  },
  heroLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 10,
    letterSpacing: 2.8,
    color: 'rgba(255,255,255,0.30)',
  },
  streakPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(201,168,76,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(201,168,76,0.24)',
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: 999,
  },
  streakText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: Colors.gold[400],
  },
  heroBody: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
    marginBottom: 22,
  },

  // Progress ring
  ringContainer: {
    width: 126,
    height: 126,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  ringInner: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringPct: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 30,
    color: '#fff',
    letterSpacing: -1,
    lineHeight: 36,
  },
  ringPctSign: {
    fontSize: 16,
    letterSpacing: 0,
  },
  ringCaption: {
    fontFamily: 'Inter-Medium',
    fontSize: 8,
    color: 'rgba(255,255,255,0.38)',
    letterSpacing: 2.2,
    marginTop: 2,
  },

  // Stats
  statsVert: { flex: 1, gap: 0 },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 9,
  },
  statRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.07)',
  },
  statVal: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 20,
    color: '#fff',
    letterSpacing: -0.5,
  },
  statLbl: {
    fontFamily: 'Inter',
    fontSize: 11,
    color: 'rgba(255,255,255,0.38)',
    letterSpacing: 0.5,
  },

  // Hero footer
  goldRule: {
    height: 1,
    backgroundColor: 'rgba(201,168,76,0.20)',
    marginBottom: 13,
  },
  heroHint: {
    fontFamily: 'Inter',
    fontSize: 11,
    color: 'rgba(255,255,255,0.28)',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
});
