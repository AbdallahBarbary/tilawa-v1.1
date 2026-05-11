import React, { useRef, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Animated,
  StyleSheet, Dimensions, StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Svg, { Path, Circle, G, Line, Polygon } from 'react-native-svg';
import { Colors, BorderRadius } from '../constants/theme';

const { width: SW, height: SH } = Dimensions.get('window');

const IslamicBg = () => (
  <Svg width={SW} height={SH} viewBox={`0 0 ${SW} ${SH}`} style={StyleSheet.absoluteFillObject}>
    <G opacity={0.07} fill="none" stroke={Colors.gold[500]} strokeWidth={0.8}>
      <Circle cx={SW / 2} cy={SH * 0.3} r={120} />
      <Circle cx={SW / 2} cy={SH * 0.3} r={80} />
      <Circle cx={SW / 2} cy={SH * 0.3} r={40} />
      <Polygon points={`${SW / 2},${SH * 0.1} ${SW * 0.85},${SH * 0.22} ${SW * 0.78},${SH * 0.5} ${SW * 0.22},${SH * 0.5} ${SW * 0.15},${SH * 0.22}`} />
      <Line x1="0" y1={SH * 0.55} x2={SW} y2={SH * 0.55} />
      <Circle cx={0} cy={0} r={100} />
      <Circle cx={SW} cy={SH} r={140} />
      <Line x1={SW * 0.1} y1="0" x2={SW * 0.6} y2={SH * 0.5} />
      <Line x1={SW * 0.9} y1="0" x2={SW * 0.4} y2={SH * 0.5} />
    </G>
  </Svg>
);

const ArchDecor = () => (
  <Svg width={SW * 0.65} height={SW * 0.85} viewBox="0 0 260 340">
    <G fill="none">
      <Path d="M28 340 L28 168 Q28 20 130 20 Q232 20 232 168 L232 340"
        stroke={Colors.gold[500]} strokeWidth={1.5} opacity={0.7} />
      <Path d="M50 340 L50 176 Q50 52 130 52 Q210 52 210 176 L210 340"
        stroke={Colors.gold[500]} strokeWidth={0.8} opacity={0.4} />
      <Circle cx={130} cy={40} r={20} stroke={Colors.gold[500]} strokeWidth={1} opacity={0.6} />
      <Circle cx={130} cy={40} r={12} fill={`${Colors.gold[500]}20`} stroke={Colors.gold[500]} strokeWidth={0.8} opacity={0.7} />
      <Line x1="0" y1="335" x2="260" y2="335" stroke={Colors.gold[500]} strokeWidth={0.8} opacity={0.35} />
      <Line x1="50" y1="210" x2="210" y2="210" stroke={Colors.gold[500]} strokeWidth={0.5} opacity={0.25} />
      <Line x1="50" y1="260" x2="210" y2="260" stroke={Colors.gold[500]} strokeWidth={0.5} opacity={0.18} />
    </G>
  </Svg>
);

const SLIDES = [
  {
    tag: 'WELCOME',
    heading: 'The Art of\nQuranic Recitation',
    sub: 'Connect with world-class Quran teachers for a transformative learning experience.',
    arabicWord: 'تلاوة',
  },
  {
    tag: 'EXPERT TEACHERS',
    heading: 'Learn from\nCertified Scholars',
    sub: 'Handpicked teachers from Egypt, Saudi Arabia, Pakistan, Morocco and beyond — each rigorously verified.',
    teachers: [
      { name: 'Sheikh Ahmad', origin: 'Cairo', initial: 'A' },
      { name: 'Ustadha Maryam', origin: 'Karachi', initial: 'M' },
      { name: 'Sheikh Omar', origin: 'Fes', initial: 'O' },
    ],
  },
  {
    tag: 'YOUR PATH',
    heading: 'Choose Your\nLearning Journey',
    sub: 'Tajweed, Hifz, Tafseer, Recitation, Arabic — expert guidance for every goal.',
    pills: [
      { label: 'Tajweed', ar: 'تجويد', color: Colors.primary[500] },
      { label: 'Hifz', ar: 'حفظ', color: Colors.gold[500] },
      { label: 'Tafseer', ar: 'تفسير', color: Colors.primary[400] },
      { label: 'Recitation', ar: 'تلاوة', color: Colors.gold[400] },
      { label: 'Arabic', ar: 'عربية', color: Colors.primary[300] },
      { label: 'Kids', ar: 'أطفال', color: Colors.gold[300] },
    ],
  },
  {
    tag: 'JOIN US',
    heading: 'Begin Your\nQuranic Journey',
    sub: 'Join thousands of students learning the Holy Quran with expert teachers from around the world.',
    stats: [
      { value: '50K+', label: 'Students' },
      { value: '200+', label: 'Teachers' },
      { value: '150+', label: 'Countries' },
    ],
    ayah: 'اقْرَأْ بِاسْمِ رَبِّكَ',
    ayahTrans: '"Read in the name of your Lord"',
    ayahRef: '— Al-Alaq 96:1',
  },
];

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [slide, setSlide] = useState(0);

  const goNext = () => {
    if (slide < SLIDES.length - 1) {
      const next = slide + 1;
      setSlide(next);
      scrollRef.current?.scrollTo({ x: next * SW, animated: true });
    } else {
      router.replace('/(tabs)');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary[900]} />
      <LinearGradient colors={['#040D09', '#081A12', '#0F2A1D']} style={StyleSheet.absoluteFillObject} />
      <IslamicBg />

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false })}
        onMomentumScrollEnd={(e) => setSlide(Math.round(e.nativeEvent.contentOffset.x / SW))}
      >
        {/* SLIDE 1 — Welcome */}
        <View style={[styles.slide, { paddingTop: insets.top + 20 }]}>
          <View style={styles.archWrapper}>
            <ArchDecor />
            <View style={styles.archContent}>
              <Text style={styles.arabicHero}>{SLIDES[0].arabicWord}</Text>
              <Text style={styles.wordmark}>TILAWA</Text>
            </View>
          </View>
          <View style={styles.slideTextBlock}>
            <Text style={styles.slideTag}>{SLIDES[0].tag}</Text>
            <Text style={styles.slideHeading}>{SLIDES[0].heading}</Text>
            <Text style={styles.slideSub}>{SLIDES[0].sub}</Text>
          </View>
        </View>

        {/* SLIDE 2 — Teachers */}
        <View style={[styles.slide, { paddingTop: insets.top + 20 }]}>
          <View style={styles.teachersGrid}>
            {SLIDES[1].teachers!.map((t, i) => (
              <View
                key={i}
                style={[
                  styles.teacherMini,
                  i === 1 && { marginTop: 48, marginHorizontal: 8 },
                ]}
              >
                <View style={[styles.teacherMiniAvatar, { borderColor: i === 1 ? Colors.gold[500] : Colors.primary[400] }]}>
                  <Text style={styles.teacherMiniInitial}>{t.initial}</Text>
                </View>
                <Text style={styles.teacherMiniName}>{t.name}</Text>
                <Text style={styles.teacherMiniOrigin}>{t.origin}</Text>
                <View style={styles.starsRow}>
                  {[1, 2, 3, 4, 5].map((s) => <Text key={s} style={styles.star}>★</Text>)}
                </View>
              </View>
            ))}
          </View>
          <View style={styles.slideTextBlock}>
            <Text style={styles.slideTag}>{SLIDES[1].tag}</Text>
            <Text style={styles.slideHeading}>{SLIDES[1].heading}</Text>
            <Text style={styles.slideSub}>{SLIDES[1].sub}</Text>
          </View>
        </View>

        {/* SLIDE 3 — Categories */}
        <View style={[styles.slide, { paddingTop: insets.top + 20 }]}>
          <View style={styles.pillsArea}>
            {SLIDES[2].pills!.map((p, i) => (
              <View key={i} style={[styles.pill, { borderColor: p.color + '55', backgroundColor: p.color + '18' }]}>
                <Text style={[styles.pillLabel, { color: p.color }]}>{p.label}</Text>
                <Text style={[styles.pillAr, { color: p.color + 'BB' }]}>{p.ar}</Text>
              </View>
            ))}
          </View>
          <View style={styles.slideTextBlock}>
            <Text style={styles.slideTag}>{SLIDES[2].tag}</Text>
            <Text style={styles.slideHeading}>{SLIDES[2].heading}</Text>
            <Text style={styles.slideSub}>{SLIDES[2].sub}</Text>
          </View>
        </View>

        {/* SLIDE 4 — CTA */}
        <View style={[styles.slide, { paddingTop: insets.top + 20 }]}>
          <View style={styles.statsRow}>
            {SLIDES[3].stats!.map((s, i) => (
              <View key={i} style={styles.statCard}>
                <Text style={styles.statVal}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
          <View style={styles.ayahBlock}>
            <Text style={styles.ayahText}>{SLIDES[3].ayah}</Text>
            <Text style={styles.ayahTrans}>{SLIDES[3].ayahTrans}</Text>
            <Text style={styles.ayahRef}>{SLIDES[3].ayahRef}</Text>
          </View>
          <View style={styles.slideTextBlock}>
            <Text style={styles.slideTag}>{SLIDES[3].tag}</Text>
            <Text style={styles.slideHeading}>{SLIDES[3].heading}</Text>
            <Text style={styles.slideSub}>{SLIDES[3].sub}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Controls */}
      <View style={[styles.bottomArea, { paddingBottom: insets.bottom > 0 ? insets.bottom + 8 : 32 }]}>
        <View style={styles.dotsRow}>
          {SLIDES.map((_, i) => {
            const inputRange = [(i - 1) * SW, i * SW, (i + 1) * SW];
            const w = scrollX.interpolate({ inputRange, outputRange: [8, 24, 8], extrapolate: 'clamp' });
            const op = scrollX.interpolate({ inputRange, outputRange: [0.35, 1, 0.35], extrapolate: 'clamp' });
            return <Animated.View key={i} style={[styles.dot, { width: w, opacity: op }]} />;
          })}
        </View>

        {slide < SLIDES.length - 1 ? (
          <View style={styles.controlsRow}>
            <TouchableOpacity onPress={() => router.replace('/(tabs)')} style={styles.skipBtn}>
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={goNext} style={styles.nextBtn}>
              <LinearGradient colors={[Colors.gold[600], Colors.gold[500], Colors.gold[400]]} style={styles.nextBtnInner} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                <Text style={styles.nextBtnText}>Next  →</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.ctaBlock}>
            <TouchableOpacity onPress={() => router.replace('/(tabs)')} style={styles.getStartedBtn}>
              <LinearGradient colors={[Colors.gold[600], Colors.gold[500], Colors.gold[400]]} style={styles.getStartedInner} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                <Text style={styles.getStartedText}>Get Started</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity style={styles.signInBtn}>
              <Text style={styles.signInText}>
                Already have an account?{' '}
                <Text style={styles.signInBold}>Sign In</Text>
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.primary[900] },
  slide: { width: SW, height: SH, justifyContent: 'flex-end' },

  archWrapper: {
    position: 'absolute',
    top: SH * 0.04,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    width: SW * 0.65,
    height: SW * 0.85,
  },
  archContent: {
    position: 'absolute',
    alignItems: 'center',
    top: '30%',
  },
  arabicHero: {
    fontSize: 58,
    color: Colors.gold[500],
    fontFamily: 'PlayfairDisplay-Bold',
    letterSpacing: 4,
    textShadowColor: `${Colors.gold[500]}55`,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 24,
  },
  wordmark: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 11,
    letterSpacing: 8,
    color: 'rgba(255,255,255,0.4)',
    marginTop: 6,
  },

  teachersGrid: {
    position: 'absolute',
    top: SH * 0.1,
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'flex-start',
  },
  teacherMini: {
    width: SW * 0.28,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: `${Colors.gold[500]}25`,
    padding: 12,
    alignItems: 'center',
  },
  teacherMiniAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: `${Colors.primary[500]}60`,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  teacherMiniInitial: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 22,
    color: Colors.gold[400],
  },
  teacherMiniName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 11,
    color: '#fff',
    textAlign: 'center',
  },
  teacherMiniOrigin: {
    fontFamily: 'Inter',
    fontSize: 10,
    color: 'rgba(255,255,255,0.45)',
    marginTop: 2,
  },
  starsRow: { flexDirection: 'row', marginTop: 5, gap: 2 },
  star: { color: Colors.gold[500], fontSize: 9 },

  pillsArea: {
    position: 'absolute',
    top: SH * 0.12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 28,
    gap: 10,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    gap: 7,
  },
  pillLabel: { fontFamily: 'Inter-SemiBold', fontSize: 13 },
  pillAr: { fontFamily: 'Inter', fontSize: 14 },

  statsRow: {
    position: 'absolute',
    top: SH * 0.09,
    flexDirection: 'row',
    alignSelf: 'center',
    gap: 10,
  },
  statCard: {
    width: (SW - 80) / 3,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: `${Colors.gold[500]}30`,
    padding: 16,
    alignItems: 'center',
  },
  statVal: { fontFamily: 'PlayfairDisplay-Bold', fontSize: 24, color: Colors.gold[400], marginBottom: 4 },
  statLabel: { fontFamily: 'Inter', fontSize: 11, color: 'rgba(255,255,255,0.5)', textAlign: 'center' },

  ayahBlock: {
    position: 'absolute',
    top: SH * 0.33,
    alignSelf: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  ayahText: { fontSize: 28, color: Colors.gold[500], textAlign: 'center', lineHeight: 46, marginBottom: 8 },
  ayahTrans: { fontFamily: 'Inter', fontSize: 14, color: 'rgba(255,255,255,0.65)', fontStyle: 'italic', textAlign: 'center', marginBottom: 4 },
  ayahRef: { fontFamily: 'Inter-Medium', fontSize: 12, color: Colors.gold[500], textAlign: 'center' },

  slideTextBlock: {
    paddingHorizontal: 28,
    paddingBottom: 220,
    alignItems: 'center',
  },
  slideTag: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 10,
    letterSpacing: 2.5,
    color: Colors.gold[500],
    marginBottom: 10,
  },
  slideHeading: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 30,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 38,
    letterSpacing: -0.3,
    marginBottom: 12,
  },
  slideSub: {
    fontFamily: 'Inter',
    fontSize: 15,
    color: 'rgba(255,255,255,0.58)',
    textAlign: 'center',
    lineHeight: 24,
  },

  bottomArea: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 28 },
  dotsRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, marginBottom: 22 },
  dot: { height: 4, borderRadius: 2, backgroundColor: Colors.gold[500] },

  controlsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  skipBtn: { paddingVertical: 14, paddingHorizontal: 4 },
  skipText: { fontFamily: 'Inter-Medium', fontSize: 15, color: 'rgba(255,255,255,0.4)' },
  nextBtn: { borderRadius: BorderRadius.full, overflow: 'hidden' },
  nextBtnInner: { paddingVertical: 14, paddingHorizontal: 30, flexDirection: 'row', alignItems: 'center' },
  nextBtnText: { fontFamily: 'Inter-SemiBold', fontSize: 15, color: Colors.primary[900] },

  ctaBlock: { alignItems: 'center', gap: 16 },
  getStartedBtn: { width: '100%', borderRadius: BorderRadius.full, overflow: 'hidden' },
  getStartedInner: { paddingVertical: 17, alignItems: 'center' },
  getStartedText: { fontFamily: 'Inter-SemiBold', fontSize: 17, color: Colors.primary[900], letterSpacing: 0.2 },
  signInBtn: { paddingVertical: 4 },
  signInText: { fontFamily: 'Inter', fontSize: 14, color: 'rgba(255,255,255,0.45)', textAlign: 'center' },
  signInBold: { fontFamily: 'Inter-SemiBold', color: Colors.gold[500] },
});
