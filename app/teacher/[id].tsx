import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Svg, { Path, Circle, G, Line } from 'react-native-svg';
import { Colors, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { featuredTeachers } from '../../constants/mockData';
import { ArrowLeftIcon, StarIcon, VerifiedIcon, OnlineIcon, HeartIcon, VideoIcon, MessageIcon, GlobeIcon, ChevronRightIcon } from '../../components/Icons';

// ─── Spec icon map — distinct SVG per discipline ──────────────────────
// Each icon is filled/heavier weight to match the brand palette cards
const SpecIcon: React.FC<{ spec: string; color: string; size?: number }> = ({ spec, color, size = 20 }) => {
  const icons: Record<string, React.ReactElement> = {
    Tajweed: (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M12 2L2 7L12 12L22 7L12 2Z" fill={`${color}25`} stroke={color} strokeWidth={1.6} strokeLinejoin="round" />
        <Path d="M2 17L12 22L22 17" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M2 12L12 17L22 12" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    ),
    Hifz: (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="12" r="9" fill={`${color}18`} stroke={color} strokeWidth={1.6} />
        <Path d="M12 7V12L16 14" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
        <Circle cx="12" cy="12" r="1.5" fill={color} />
      </Svg>
    ),
    Tafseer: (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M2 3H8C10 3 12 5 12 7V21C12 19 10 18 9 18H2V3Z" fill={`${color}20`} stroke={color} strokeWidth={1.6} />
        <Path d="M22 3H16C14 3 12 5 12 7V21C12 19 14 18 15 18H22V3Z" fill={`${color}15`} stroke={color} strokeWidth={1.6} />
        <Line x1="4" y1="8" x2="10" y2="8" stroke={color} strokeWidth={1} strokeLinecap="round" />
        <Line x1="4" y1="11" x2="10" y2="11" stroke={color} strokeWidth={1} strokeLinecap="round" />
      </Svg>
    ),
    Recitation: (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M12 1C12 1 9 4 9 8V16C9 18 11 20 13 20H16V8C16 4 12 1 12 1Z" fill={`${color}20`} stroke={color} strokeWidth={1.6} />
        <Path d="M16 20V23M13 23H19" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
        <Circle cx="12" cy="10" r="1.5" fill={color} opacity={0.6} />
      </Svg>
    ),
    Arabic: (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M4 21L8 10L12 21" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M5.5 17H10.5" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
        <Path d="M15 10C15 8 17 7 18 8C19 9 18.5 11 17 12C15.5 13 15 14 15 14H19" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    ),
    Kids: (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="8" r="4" fill={`${color}20`} stroke={color} strokeWidth={1.6} />
        <Path d="M4 21C4 17.13 7.58 14 12 14C16.42 14 20 17.13 20 21" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
        <Path d="M9 8C9.5 9 10.5 10 12 10C13.5 10 14.5 9 15 8" stroke={color} strokeWidth={1} strokeLinecap="round" />
      </Svg>
    ),
  };
  return icons[spec] ?? (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth={1.6} />
    </Svg>
  );
};

// ─── Islamic geometric decoration for About section ───────────────────
const AboutDecor = () => (
  <Svg width={60} height={60} viewBox="0 0 60 60" style={aboutDecorStyle} opacity={0.07}>
    <G stroke={Colors.gold[500]} strokeWidth={0.8} fill="none">
      <Path d="M30 5L35 15L45 12L42 22L52 25L42 28L45 38L35 35L30 45L25 35L15 38L18 28L8 25L18 22L15 12L25 15Z" />
      <Circle cx="30" cy="25" r="8" />
      <Circle cx="30" cy="25" r="4" strokeDasharray="2 4" />
    </G>
  </Svg>
);
const aboutDecorStyle = { position: 'absolute' as const, top: 0, right: 0 };

// ─── Spec color map ───────────────────────────────────────────────────
const SPEC_META: Record<string, { color: string; arabicName: string; tagline: string }> = {
  Tajweed: { color: Colors.primary[500], arabicName: 'تجويد', tagline: 'Rules of recitation' },
  Hifz: { color: Colors.primary[700], arabicName: 'حفظ', tagline: 'Quran memorization' },
  Tafseer: { color: Colors.gold[500], arabicName: 'تفسير', tagline: 'Quranic exegesis' },
  Recitation: { color: Colors.primary[400], arabicName: 'تلاوة', tagline: 'Melodious reading' },
  Arabic: { color: '#5B9A5F', arabicName: 'عربية', tagline: 'Quranic language' },
  Kids: { color: Colors.gold[600], arabicName: 'أطفال', tagline: 'For young learners' },
};

export default function TeacherDetailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [isFav, setIsFav] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;
  const bottomAnim = useRef(new Animated.Value(60)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 380, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, damping: 22, stiffness: 200 }),
      Animated.spring(bottomAnim, { toValue: 0, delay: 300, useNativeDriver: true, damping: 22, stiffness: 200 }),
    ]).start();
  }, []);

  const teacher = featuredTeachers.find((t) => t.id === id) || featuredTeachers[0];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn} activeOpacity={0.75}>
          <ArrowLeftIcon size={20} color={Colors.neutral[800]} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsFav(!isFav)} style={styles.iconBtn} activeOpacity={0.75}>
          <HeartIcon size={20} color={isFav ? Colors.error : Colors.neutral[400]} filled={isFav} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Profile Card */}
        <Animated.View style={[styles.profileCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.avatarWrap}>
            <Image source={{ uri: teacher.avatar }} style={styles.avatar} />
            {teacher.isOnline && (
              <View style={styles.onlineBadge}>
                <OnlineIcon size={9} />
                <Text style={styles.onlineText}>Online</Text>
              </View>
            )}
          </View>

          <View style={styles.nameRow}>
            <Text style={styles.name}>{teacher.name}</Text>
            {teacher.isVerified && <VerifiedIcon size={18} />}
          </View>
          <Text style={styles.nameAr}>{teacher.nameAr}</Text>
          <Text style={styles.country}>{teacher.country} · {teacher.experience} experience</Text>

          {/* Quick stats */}
          <View style={styles.statsRow}>
            {[
              { val: teacher.rating.toString(), lbl: 'Rating', star: true },
              { val: teacher.totalStudents.toString(), lbl: 'Students' },
              { val: teacher.sessionsCompleted.toString(), lbl: 'Sessions' },
            ].map((s, i) => (
              <React.Fragment key={i}>
                {i > 0 && <View style={styles.statDiv} />}
                <View style={styles.statItem}>
                  <View style={styles.statValRow}>
                    {s.star && <StarIcon size={14} />}
                    <Text style={styles.statVal}>{s.val}</Text>
                  </View>
                  <Text style={styles.statLbl}>{s.lbl}</Text>
                </View>
              </React.Fragment>
            ))}
          </View>
        </Animated.View>

        {/* About — elevated to manuscript feel ──────────────────────── */}
        <Animated.View style={[styles.aboutSection, { opacity: fadeAnim }]}>
          {/* Dark green left border — scholarly, not decorative */}
          <View style={styles.aboutAccent} />
          <View style={styles.aboutInner}>
            <AboutDecor />
            <Text style={styles.aboutHeading}>ABOUT</Text>
            <Text style={styles.aboutArabicHint}>نبذة</Text>
            <Text style={styles.bio}>{teacher.bio}</Text>
            {/* Credential strip */}
            <View style={styles.credStrip}>
              <View style={styles.credItem}>
                <Text style={styles.credVal}>{teacher.experience}</Text>
                <Text style={styles.credLbl}>Experience</Text>
              </View>
              <View style={styles.credDot} />
              <View style={styles.credItem}>
                <Text style={styles.credVal}>{teacher.country}</Text>
                <Text style={styles.credLbl}>Country</Text>
              </View>
              <View style={styles.credDot} />
              <View style={styles.credItem}>
                <Text style={styles.credVal}>Verified</Text>
                <Text style={styles.credLbl}>Ijazah</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Specializations — rich cards, not pills ─────────────────── */}
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <Text style={styles.sectionTitle}>Specializations</Text>
          <Text style={styles.sectionAr}>التخصصات</Text>
          <View style={styles.specGrid}>
            {teacher.specializations.map((spec) => {
              const meta = SPEC_META[spec] || { color: Colors.primary[500], arabicName: '', tagline: '' };
              return (
                <View key={spec} style={styles.specCard}>
                  <LinearGradient
                    colors={[`${meta.color}15`, `${meta.color}06`]}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                    style={styles.specGradient}
                  >
                    {/* Colored left accent */}
                    <View style={[styles.specAccent, { backgroundColor: meta.color }]} />
                    <View style={styles.specContent}>
                      <View style={styles.specIconWrap}>
                        <SpecIcon spec={spec} color={meta.color} size={18} />
                      </View>
                      <View style={styles.specText}>
                        <View style={styles.specNameRow}>
                          <Text style={[styles.specName, { color: meta.color }]}>{spec}</Text>
                          <Text style={styles.specAr}>{meta.arabicName}</Text>
                        </View>
                        <Text style={styles.specTagline}>{meta.tagline}</Text>
                      </View>
                    </View>
                  </LinearGradient>
                </View>
              );
            })}
          </View>
        </Animated.View>

        {/* Languages */}
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <Text style={styles.sectionTitle}>Languages</Text>
          <View style={styles.langRow}>
            {teacher.languages.map((lang) => (
              <View key={lang} style={styles.langBadge}>
                <GlobeIcon size={13} color={Colors.primary[500]} />
                <Text style={styles.langText}>{lang}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Reviews */}
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <View style={styles.reviewHeader}>
            <Text style={styles.sectionTitle}>Reviews</Text>
            <TouchableOpacity style={styles.seeAllBtn} activeOpacity={0.75}>
              <Text style={styles.seeAllText}>See all ({teacher.reviewCount})</Text>
              <ChevronRightIcon size={14} color={Colors.primary[500]} />
            </TouchableOpacity>
          </View>
          <View style={styles.reviewCard}>
            <View style={styles.reviewTop}>
              <Image source={{ uri: 'https://randomuser.me/api/portraits/women/33.jpg' }} style={styles.reviewAvatar} />
              <View style={styles.reviewMeta}>
                <Text style={styles.reviewName}>Sarah M.</Text>
                <View style={styles.starsRow}>
                  {[1, 2, 3, 4, 5].map((s) => <StarIcon key={s} size={11} />)}
                </View>
              </View>
              <Text style={styles.reviewDate}>2 days ago</Text>
            </View>
            <Text style={styles.reviewText}>
              Excellent teacher with deep knowledge. Very patient and explains tajweed rules with clarity and warmth. Highly recommend.
            </Text>
          </View>
        </Animated.View>

        {/* Next available */}
        <Animated.View style={[styles.availCard, { opacity: fadeAnim }]}>
          <LinearGradient
            colors={[`${Colors.primary[500]}14`, `${Colors.primary[500]}05`]}
            style={styles.availGradient}
          >
            <View>
              <Text style={styles.availLabel}>Next Available</Text>
              <Text style={styles.availNote}>Sessions · 45–60 min</Text>
            </View>
            <View style={styles.availTimeWrap}>
              <Text style={styles.availTime}>{teacher.nextAvailable}</Text>
            </View>
          </LinearGradient>
        </Animated.View>

        <View style={{ height: 110 }} />
      </ScrollView>

      {/* Bottom CTA — unified price pill */}
      <Animated.View style={[styles.bottomBar, {
        paddingBottom: insets.bottom > 0 ? insets.bottom : 16,
        transform: [{ translateY: bottomAnim }],
      }]}>
        <View style={styles.priceCol}>
          <Text style={styles.priceLabel}>Per session</Text>
          {/* Unified price pill — gold border, brand green value */}
          <View style={styles.pricePill}>
            <Text style={styles.priceVal}>{teacher.pricePerSession}</Text>
            <Text style={styles.priceSuffix}>/session</Text>
          </View>
        </View>
        <View style={styles.ctaRow}>
          <TouchableOpacity style={styles.msgBtn} activeOpacity={0.8}>
            <MessageIcon size={20} color={Colors.primary[500]} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.bookBtn} activeOpacity={0.85}>
            <LinearGradient
              colors={[Colors.primary[700], Colors.primary[500]]}
              style={styles.bookBtnInner}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            >
              <VideoIcon size={17} color="#fff" />
              <Text style={styles.bookText}>Book Session</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.neutral[100] },
  topBar: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md,
  },
  iconBtn: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: Colors.neutral[0],
    alignItems: 'center', justifyContent: 'center',
    ...Shadows.sm,
  },
  scroll: { paddingHorizontal: Spacing.xl },

  // Profile card
  profileCard: {
    backgroundColor: Colors.neutral[0],
    borderRadius: BorderRadius['2xl'],
    padding: Spacing.xl,
    alignItems: 'center',
    ...Shadows.md,
    marginBottom: Spacing.lg,
  },
  avatarWrap: { position: 'relative', marginBottom: Spacing.lg },
  avatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: Colors.gold[500] },
  onlineBadge: {
    position: 'absolute', bottom: 4, left: '50%',
    transform: [{ translateX: -32 }],
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: `${Colors.success}E6`,
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: BorderRadius.full,
  },
  onlineText: { fontFamily: 'Inter-SemiBold', fontSize: 11, color: '#fff' },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 4 },
  name: { fontFamily: 'PlayfairDisplay-Bold', fontSize: 22, color: Colors.neutral[900], letterSpacing: -0.2 },
  nameAr: { fontSize: 15, color: Colors.neutral[500], marginBottom: 4 },
  country: { fontFamily: 'Inter', fontSize: 13, color: Colors.neutral[400], marginBottom: Spacing.xl },

  statsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.neutral[50],
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.lg, paddingHorizontal: Spacing.md,
    width: '100%',
  },
  statItem: { flex: 1, alignItems: 'center' },
  statValRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginBottom: 4 },
  statVal: { fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: Colors.neutral[800] },
  statLbl: { fontFamily: 'Inter', fontSize: 11, color: Colors.neutral[400] },
  statDiv: { width: 1, backgroundColor: Colors.neutral[200] },

  // About section — manuscript/scholarly treatment
  aboutSection: {
    flexDirection: 'row',
    backgroundColor: Colors.neutral[0],
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.lg,
    overflow: 'hidden',
    ...Shadows.sm,
    // Subtle warm shadow — not generic grey
    shadowColor: Colors.primary[800],
    shadowOpacity: 0.10,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 4 },
  },
  // Dark green left border — 4px, the scholarly marker
  aboutAccent: {
    width: 4,
    backgroundColor: Colors.primary[600],
    borderTopLeftRadius: BorderRadius.xl,
    borderBottomLeftRadius: BorderRadius.xl,
  },
  aboutInner: {
    flex: 1,
    padding: Spacing.xl,
    position: 'relative',
    overflow: 'hidden',
  },
  aboutHeading: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 10,
    color: Colors.neutral[400],
    letterSpacing: 2.5,
    marginBottom: 2,
  },
  aboutArabicHint: {
    fontSize: 18,
    color: Colors.primary[500],
    opacity: 0.6,
    marginBottom: Spacing.md,
    lineHeight: 28,
  },
  bio: {
    fontFamily: 'Inter',
    fontSize: 14,
    lineHeight: 24,
    color: Colors.neutral[600],
    marginBottom: Spacing.lg,
  },
  // Credential strip below bio
  credStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral[50],
    borderRadius: BorderRadius.lg,
    paddingVertical: 10,
    paddingHorizontal: Spacing.md,
  },
  credItem: { flex: 1, alignItems: 'center' },
  credVal: { fontFamily: 'Inter-SemiBold', fontSize: 12, color: Colors.primary[600] },
  credLbl: { fontFamily: 'Inter', fontSize: 10, color: Colors.neutral[400], marginTop: 2, letterSpacing: 0.3 },
  credDot: { width: 1, height: 24, backgroundColor: Colors.neutral[200] },

  // Specialization section
  section: {
    backgroundColor: Colors.neutral[0],
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
    ...Shadows.xs,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.neutral[800],
    marginBottom: 2,
  },
  sectionAr: {
    fontSize: 14,
    color: Colors.neutral[400],
    marginBottom: Spacing.md,
    opacity: 0.7,
  },

  // Spec cards — horizontal ribbon cards, not pills
  specGrid: { gap: Spacing.sm },
  specCard: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.neutral[150],
  },
  specGradient: { borderRadius: BorderRadius.lg },
  specContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingRight: 14,
  },
  specAccent: { width: 3.5, height: '100%', marginRight: 12, alignSelf: 'stretch' },
  specIconWrap: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.7)',
    alignItems: 'center', justifyContent: 'center',
    marginRight: 10,
  },
  specText: { flex: 1 },
  specNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 3 },
  specName: { fontFamily: 'Inter-SemiBold', fontSize: 14 },
  specAr: { fontSize: 13, color: Colors.neutral[400], opacity: 0.8 },
  specTagline: { fontFamily: 'Inter', fontSize: 11, color: Colors.neutral[400], letterSpacing: 0.2 },

  // Languages
  langRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  langBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: Colors.neutral[50],
    paddingHorizontal: 12, paddingVertical: 7,
    borderRadius: BorderRadius.full,
    borderWidth: 1, borderColor: Colors.neutral[200],
  },
  langText: { fontFamily: 'Inter-Medium', fontSize: 13, color: Colors.neutral[700] },

  // Reviews
  reviewHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: Spacing.md,
  },
  seeAllBtn: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  seeAllText: { fontFamily: 'Inter-Medium', fontSize: 13, color: Colors.primary[500] },
  reviewCard: {
    backgroundColor: Colors.neutral[50],
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.neutral[150],
  },
  reviewTop: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.md },
  reviewAvatar: { width: 36, height: 36, borderRadius: 18, marginRight: Spacing.md },
  reviewMeta: { flex: 1 },
  reviewName: { fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.neutral[800] },
  starsRow: { flexDirection: 'row', gap: 2, marginTop: 2 },
  reviewDate: { fontFamily: 'Inter', fontSize: 11, color: Colors.neutral[400] },
  reviewText: { fontFamily: 'Inter', fontSize: 13, lineHeight: 21, color: Colors.neutral[600] },

  // Next available
  availCard: { borderRadius: BorderRadius.xl, overflow: 'hidden', marginBottom: Spacing.lg },
  availGradient: {
    padding: Spacing.xl,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    borderWidth: 1, borderColor: `${Colors.primary[500]}20`, borderRadius: BorderRadius.xl,
  },
  availLabel: { fontFamily: 'Inter-SemiBold', fontSize: 14, color: Colors.neutral[700] },
  availNote: { fontFamily: 'Inter', fontSize: 11, color: Colors.neutral[400], marginTop: 2 },
  availTimeWrap: {
    backgroundColor: Colors.primary[500],
    paddingHorizontal: 14, paddingVertical: 7,
    borderRadius: BorderRadius.full,
  },
  availTime: { fontFamily: 'Inter-SemiBold', fontSize: 14, color: '#fff' },

  // Bottom bar — unified price pill
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.neutral[0],
    paddingHorizontal: Spacing.xl, paddingTop: Spacing.lg,
    borderTopWidth: 1, borderTopColor: Colors.neutral[150],
  },
  priceCol: { flex: 1 },
  priceLabel: { fontFamily: 'Inter', fontSize: 10, color: Colors.neutral[400], letterSpacing: 0.5, marginBottom: 4 },
  pricePill: { flexDirection: 'row', alignItems: 'baseline', gap: 2 },
  priceVal: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 28,
    color: Colors.primary[600],
    letterSpacing: -0.8,
  },
  priceSuffix: {
    fontFamily: 'Inter',
    fontSize: 11,
    color: Colors.neutral[400],
  },
  ctaRow: { flexDirection: 'row', gap: Spacing.md },
  msgBtn: {
    width: 48, height: 48, borderRadius: BorderRadius.lg,
    borderWidth: 1.5, borderColor: Colors.primary[500],
    alignItems: 'center', justifyContent: 'center',
  },
  bookBtn: { borderRadius: BorderRadius.lg, overflow: 'hidden' },
  bookBtnInner: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: Spacing.xl, height: 48,
  },
  bookText: { fontFamily: 'Inter-SemiBold', fontSize: 15, color: '#fff' },
});
