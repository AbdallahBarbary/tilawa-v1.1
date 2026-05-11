import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { featuredTeachers } from '../../constants/mockData';
import { ArrowLeftIcon, StarIcon, VerifiedIcon, OnlineIcon, HeartIcon, VideoIcon, MessageIcon, GlobeIcon, ChevronRightIcon } from '../../components/Icons';

const SPEC_COLORS: Record<string, string> = {
  Tajweed: Colors.primary[500],
  Hifz: Colors.primary[700],
  Tafseer: Colors.gold[500],
  Recitation: Colors.primary[400],
  Arabic: Colors.primary[300],
  Kids: Colors.gold[400],
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

        {/* About */}
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.bio}>{teacher.bio}</Text>
        </Animated.View>

        {/* Specializations */}
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <Text style={styles.sectionTitle}>Specializations</Text>
          <View style={styles.specRow}>
            {teacher.specializations.map((spec) => (
              <View key={spec} style={[styles.specBadge, { backgroundColor: `${SPEC_COLORS[spec] || Colors.primary[500]}15` }]}>
                <Text style={[styles.specText, { color: SPEC_COLORS[spec] || Colors.primary[500] }]}>{spec}</Text>
              </View>
            ))}
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
              <Image source={{ uri: 'https://i.pravatar.cc/100?img=15' }} style={styles.reviewAvatar} />
              <View style={styles.reviewMeta}>
                <Text style={styles.reviewName}>Sarah M.</Text>
                <View style={styles.starsRow}>
                  {[1, 2, 3, 4, 5].map((s) => <StarIcon key={s} size={11} />)}
                </View>
              </View>
              <Text style={styles.reviewDate}>2 days ago</Text>
            </View>
            <Text style={styles.reviewText}>Excellent teacher with deep knowledge. Very patient and explains tajweed rules clearly. Highly recommend!</Text>
          </View>
        </Animated.View>

        {/* Next available */}
        <Animated.View style={[styles.availCard, { opacity: fadeAnim }]}>
          <LinearGradient colors={[`${Colors.primary[500]}12`, `${Colors.primary[500]}04`]} style={styles.availGradient}>
            <Text style={styles.availLabel}>Next Available</Text>
            <Text style={styles.availTime}>{teacher.nextAvailable}</Text>
          </LinearGradient>
        </Animated.View>

        <View style={{ height: 110 }} />
      </ScrollView>

      {/* Bottom CTA */}
      <Animated.View style={[styles.bottomBar, { paddingBottom: insets.bottom > 0 ? insets.bottom : 16, transform: [{ translateY: bottomAnim }] }]}>
        <View style={styles.priceCol}>
          <Text style={styles.priceLabel}>Per session</Text>
          <Text style={styles.priceVal}>{teacher.pricePerSession}</Text>
        </View>
        <View style={styles.ctaRow}>
          <TouchableOpacity style={styles.msgBtn} activeOpacity={0.8}>
            <MessageIcon size={20} color={Colors.primary[500]} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.bookBtn} activeOpacity={0.85}>
            <LinearGradient colors={[Colors.primary[700], Colors.primary[500]]} style={styles.bookBtnInner} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
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
  topBar: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md },
  iconBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: Colors.neutral[0], alignItems: 'center', justifyContent: 'center', ...Shadows.sm },
  scroll: { paddingHorizontal: Spacing.xl },

  profileCard: { backgroundColor: Colors.neutral[0], borderRadius: BorderRadius['2xl'], padding: Spacing.xl, alignItems: 'center', ...Shadows.md, marginBottom: Spacing.lg },
  avatarWrap: { position: 'relative', marginBottom: Spacing.lg },
  avatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: Colors.gold[500] },
  onlineBadge: { position: 'absolute', bottom: 4, left: '50%', transform: [{ translateX: -32 }], flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: `${Colors.success}E6`, paddingHorizontal: 10, paddingVertical: 4, borderRadius: BorderRadius.full },
  onlineText: { fontFamily: 'Inter-SemiBold', fontSize: 11, color: '#fff' },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 4 },
  name: { fontFamily: 'PlayfairDisplay-Bold', fontSize: 22, color: Colors.neutral[900], letterSpacing: -0.2 },
  nameAr: { fontFamily: 'Inter', fontSize: 15, color: Colors.neutral[500], marginBottom: 4 },
  country: { fontFamily: 'Inter', fontSize: 13, color: Colors.neutral[400], marginBottom: Spacing.xl },

  statsRow: { flexDirection: 'row', backgroundColor: Colors.neutral[50], borderRadius: BorderRadius.xl, paddingVertical: Spacing.lg, paddingHorizontal: Spacing.md, width: '100%' },
  statItem: { flex: 1, alignItems: 'center' },
  statValRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginBottom: 4 },
  statVal: { fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: Colors.neutral[800] },
  statLbl: { fontFamily: 'Inter', fontSize: 11, color: Colors.neutral[400] },
  statDiv: { width: 1, backgroundColor: Colors.neutral[200] },

  section: { backgroundColor: Colors.neutral[0], borderRadius: BorderRadius.xl, padding: Spacing.xl, marginBottom: Spacing.lg, ...Shadows.xs },
  sectionTitle: { fontFamily: 'Inter-SemiBold', fontSize: 16, color: Colors.neutral[800], marginBottom: Spacing.md },
  bio: { fontFamily: 'Inter', fontSize: 14, lineHeight: 23, color: Colors.neutral[600] },
  specRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  specBadge: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: BorderRadius.full },
  specText: { fontFamily: 'Inter-Medium', fontSize: 13 },
  langRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  langBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: Colors.neutral[50], paddingHorizontal: 12, paddingVertical: 7, borderRadius: BorderRadius.full },
  langText: { fontFamily: 'Inter-Medium', fontSize: 13, color: Colors.neutral[700] },

  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  seeAllBtn: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  seeAllText: { fontFamily: 'Inter-Medium', fontSize: 13, color: Colors.primary[500] },
  reviewCard: { backgroundColor: Colors.neutral[50], borderRadius: BorderRadius.lg, padding: Spacing.md },
  reviewTop: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.md },
  reviewAvatar: { width: 36, height: 36, borderRadius: 18, marginRight: Spacing.md },
  reviewMeta: { flex: 1 },
  reviewName: { fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.neutral[800] },
  starsRow: { flexDirection: 'row', gap: 2, marginTop: 2 },
  reviewDate: { fontFamily: 'Inter', fontSize: 11, color: Colors.neutral[400] },
  reviewText: { fontFamily: 'Inter', fontSize: 13, lineHeight: 21, color: Colors.neutral[600] },

  availCard: { borderRadius: BorderRadius.xl, overflow: 'hidden', marginBottom: Spacing.lg },
  availGradient: { padding: Spacing.xl, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  availLabel: { fontFamily: 'Inter-Medium', fontSize: 13, color: Colors.neutral[600] },
  availTime: { fontFamily: 'Inter-SemiBold', fontSize: 15, color: Colors.primary[500] },

  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.neutral[0], paddingHorizontal: Spacing.xl, paddingTop: Spacing.lg, borderTopWidth: 1, borderTopColor: Colors.neutral[150] },
  priceCol: { flex: 1 },
  priceLabel: { fontFamily: 'Inter', fontSize: 11, color: Colors.neutral[400] },
  priceVal: { fontFamily: 'PlayfairDisplay-Bold', fontSize: 26, color: Colors.primary[600], letterSpacing: -0.5 },
  ctaRow: { flexDirection: 'row', gap: Spacing.md },
  msgBtn: { width: 48, height: 48, borderRadius: BorderRadius.lg, borderWidth: 1.5, borderColor: Colors.primary[500], alignItems: 'center', justifyContent: 'center' },
  bookBtn: { borderRadius: BorderRadius.lg, overflow: 'hidden' },
  bookBtnInner: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: Spacing.xl, height: 48 },
  bookText: { fontFamily: 'Inter-SemiBold', fontSize: 15, color: '#fff' },
});
