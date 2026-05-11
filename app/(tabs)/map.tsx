import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Dimensions, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Svg, { Circle, Path, G, Line, Rect } from 'react-native-svg';
import { Colors, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { featuredTeachers } from '../../constants/mockData';
import { MapPinIcon, SearchIcon, StarIcon, VerifiedIcon } from '../../components/Icons';

const { width: SW, height: SH } = Dimensions.get('window');

const MAP_H = SH * 0.46;

const DISTANCE = ['0.8 km', '1.2 km', '2.4 km', '3.1 km', '5.6 km'];

const MapBackground = () => (
  <Svg width={SW} height={MAP_H} viewBox={`0 0 ${SW} ${MAP_H}`} style={StyleSheet.absoluteFillObject}>
    {/* Road grid */}
    <G stroke={`${Colors.neutral[0]}18`} strokeWidth={1.5} fill="none">
      <Line x1="0" y1={MAP_H * 0.28} x2={SW} y2={MAP_H * 0.28} />
      <Line x1="0" y1={MAP_H * 0.55} x2={SW} y2={MAP_H * 0.55} />
      <Line x1="0" y1={MAP_H * 0.8} x2={SW} y2={MAP_H * 0.8} />
      <Line x1={SW * 0.2} y1="0" x2={SW * 0.2} y2={MAP_H} />
      <Line x1={SW * 0.5} y1="0" x2={SW * 0.5} y2={MAP_H} />
      <Line x1={SW * 0.78} y1="0" x2={SW * 0.78} y2={MAP_H} />
    </G>
    {/* Main roads */}
    <G stroke={`${Colors.neutral[0]}30`} strokeWidth={3} fill="none">
      <Line x1="0" y1={MAP_H * 0.42} x2={SW} y2={MAP_H * 0.42} />
      <Line x1={SW * 0.38} y1="0" x2={SW * 0.38} y2={MAP_H} />
    </G>
    {/* Blocks */}
    <G fill={`${Colors.primary[800]}55`}>
      <Rect x={SW * 0.05} y={MAP_H * 0.08} width={SW * 0.12} height={MAP_H * 0.17} rx={4} />
      <Rect x={SW * 0.22} y={MAP_H * 0.08} width={SW * 0.13} height={MAP_H * 0.17} rx={4} />
      <Rect x={SW * 0.55} y={MAP_H * 0.08} width={SW * 0.18} height={MAP_H * 0.17} rx={4} />
      <Rect x={SW * 0.05} y={MAP_H * 0.46} width={SW * 0.10} height={MAP_H * 0.25} rx={4} />
      <Rect x={SW * 0.20} y={MAP_H * 0.46} width={SW * 0.15} height={MAP_H * 0.12} rx={4} />
      <Rect x={SW * 0.55} y={MAP_H * 0.46} width={SW * 0.20} height={MAP_H * 0.20} rx={4} />
      <Rect x={SW * 0.80} y={MAP_H * 0.46} width={SW * 0.15} height={MAP_H * 0.30} rx={4} />
    </G>
    {/* Park */}
    <Rect x={SW * 0.20} y={MAP_H * 0.60} width={SW * 0.15} height={MAP_H * 0.12} rx={6} fill={`${Colors.primary[600]}40`} />
  </Svg>
);

const TeacherPin: React.FC<{ x: number; y: number; price: string; active: boolean; onPress: () => void }> = ({ x, y, price, active, onPress }) => {
  const scale = useRef(new Animated.Value(active ? 1 : 0.85)).current;
  useEffect(() => {
    Animated.spring(scale, { toValue: active ? 1 : 0.85, useNativeDriver: true, damping: 18, stiffness: 220 }).start();
  }, [active]);
  return (
    <Animated.View style={[styles.pin, { left: x - 32, top: y - 22, transform: [{ scale }] }]}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
        <View style={[styles.pinBubble, active && styles.pinBubbleActive]}>
          <Text style={[styles.pinText, active && styles.pinTextActive]}>{price}</Text>
        </View>
        <View style={[styles.pinTail, active && styles.pinTailActive]} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const PINS = [
  { x: SW * 0.15, y: MAP_H * 0.35, teacherIdx: 0 },
  { x: SW * 0.48, y: MAP_H * 0.22, teacherIdx: 1 },
  { x: SW * 0.68, y: MAP_H * 0.38, teacherIdx: 2 },
  { x: SW * 0.30, y: MAP_H * 0.65, teacherIdx: 3 },
  { x: SW * 0.80, y: MAP_H * 0.25, teacherIdx: 4 },
];

export default function MapScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [activePin, setActivePin] = useState(0);
  const [filter, setFilter] = useState('All');

  const teacher = featuredTeachers[PINS[activePin].teacherIdx];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Nearby Teachers</Text>
          <Text style={styles.subtitle}>Teachers in your area</Text>
        </View>
        <TouchableOpacity style={styles.searchBtn} activeOpacity={0.75}>
          <SearchIcon size={18} color={Colors.primary[500]} />
        </TouchableOpacity>
      </View>

      {/* Map area */}
      <View style={styles.mapContainer}>
        <LinearGradient colors={['#0F2A1D', '#1E4620', '#2D5A27']} style={StyleSheet.absoluteFillObject} />
        <MapBackground />

        {/* Teacher pins */}
        {PINS.map((pin, i) => (
          <TeacherPin
            key={i}
            x={pin.x}
            y={pin.y}
            price={featuredTeachers[pin.teacherIdx].pricePerSession}
            active={activePin === i}
            onPress={() => setActivePin(i)}
          />
        ))}

        {/* My location dot */}
        <View style={styles.myLocation}>
          <View style={styles.myLocationRing} />
          <View style={styles.myLocationDot} />
        </View>

        {/* Map overlay gradient */}
        <LinearGradient
          colors={['transparent', `${Colors.neutral[100]}FF`]}
          style={styles.mapFade}
        />
      </View>

      {/* Active teacher card */}
      <View style={styles.activeCard}>
        <TouchableOpacity
          onPress={() => router.push(`/teacher/${teacher.id}`)}
          style={styles.activeCardInner}
          activeOpacity={0.92}
        >
          <Image source={{ uri: teacher.avatar }} style={styles.activeAvatar} />
          <View style={styles.activeInfo}>
            <View style={styles.activeNameRow}>
              <Text style={styles.activeName} numberOfLines={1}>{teacher.name}</Text>
              {teacher.isVerified && <VerifiedIcon size={14} />}
            </View>
            <Text style={styles.activeSpec} numberOfLines={1}>{teacher.specializations.join(' · ')}</Text>
            <View style={styles.activeMeta}>
              <StarIcon size={12} />
              <Text style={styles.activeRating}>{teacher.rating}</Text>
              <View style={styles.activeDot} />
              <Text style={styles.activeDistance}>{DISTANCE[activePin]}</Text>
            </View>
          </View>
          <View style={styles.activePriceCol}>
            <Text style={styles.activePriceLabel}>per session</Text>
            <Text style={styles.activePrice}>{teacher.pricePerSession}</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Nearby list */}
      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>All Nearby</Text>
        <Text style={styles.listCount}>{featuredTeachers.length} teachers</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
        {featuredTeachers.map((t, i) => (
          <TouchableOpacity
            key={t.id}
            style={[styles.listCard, i === activePin && styles.listCardActive]}
            onPress={() => { setActivePin(i); router.push(`/teacher/${t.id}`); }}
            activeOpacity={0.85}
          >
            <Image source={{ uri: t.avatar }} style={styles.listAvatar} />
            <View style={styles.listInfo}>
              <Text style={styles.listName} numberOfLines={1}>{t.name}</Text>
              <Text style={styles.listSpec} numberOfLines={1}>{t.specializations[0]}</Text>
              <View style={styles.listMeta}>
                <StarIcon size={11} />
                <Text style={styles.listRating}>{t.rating}</Text>
                <Text style={styles.listDistance}>· {DISTANCE[i] || '4.2 km'}</Text>
              </View>
            </View>
            <View style={styles.listRight}>
              {t.isOnline && <View style={styles.onlinePip} />}
              <Text style={styles.listPrice}>{t.pricePerSession}</Text>
            </View>
          </TouchableOpacity>
        ))}
        <View style={{ height: 16 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.neutral[100] },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.xl, paddingTop: Spacing.lg, paddingBottom: Spacing.md },
  title: { fontFamily: 'PlayfairDisplay-Bold', fontSize: 26, color: Colors.neutral[900], letterSpacing: -0.3 },
  subtitle: { fontFamily: 'Inter', fontSize: 13, color: Colors.neutral[500], marginTop: 2 },
  searchBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: Colors.neutral[0], alignItems: 'center', justifyContent: 'center', ...Shadows.sm },

  mapContainer: { height: MAP_H, overflow: 'hidden', position: 'relative' },
  mapFade: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 60 },
  myLocation: { position: 'absolute', left: SW * 0.5 - 10, top: MAP_H * 0.42 - 10, alignItems: 'center', justifyContent: 'center' },
  myLocationRing: { position: 'absolute', width: 28, height: 28, borderRadius: 14, backgroundColor: `${Colors.primary[500]}30`, borderWidth: 1, borderColor: `${Colors.primary[500]}60` },
  myLocationDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: Colors.primary[500], borderWidth: 2, borderColor: '#fff' },

  pin: { position: 'absolute', alignItems: 'center' },
  pinBubble: { backgroundColor: Colors.neutral[0], borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5, ...Shadows.md },
  pinBubbleActive: { backgroundColor: Colors.primary[500] },
  pinText: { fontFamily: 'Inter-SemiBold', fontSize: 12, color: Colors.primary[600] },
  pinTextActive: { color: '#fff' },
  pinTail: { width: 6, height: 6, backgroundColor: Colors.neutral[0], transform: [{ rotate: '45deg' }], marginTop: -3 },
  pinTailActive: { backgroundColor: Colors.primary[500] },

  activeCard: { marginHorizontal: Spacing.xl, marginTop: -2, backgroundColor: Colors.neutral[0], borderRadius: BorderRadius.xl, ...Shadows.md, zIndex: 10 },
  activeCardInner: { flexDirection: 'row', alignItems: 'center', padding: Spacing.lg },
  activeAvatar: { width: 52, height: 52, borderRadius: 26, marginRight: Spacing.md, borderWidth: 2, borderColor: Colors.gold[400] },
  activeInfo: { flex: 1 },
  activeNameRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 2 },
  activeName: { fontFamily: 'Inter-SemiBold', fontSize: 15, color: Colors.neutral[900], flex: 1 },
  activeSpec: { fontFamily: 'Inter', fontSize: 12, color: Colors.neutral[500], marginBottom: 4 },
  activeMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  activeRating: { fontFamily: 'Inter-SemiBold', fontSize: 12, color: Colors.neutral[700] },
  activeDot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: Colors.neutral[300] },
  activeDistance: { fontFamily: 'Inter', fontSize: 12, color: Colors.neutral[500] },
  activePriceCol: { alignItems: 'flex-end' },
  activePriceLabel: { fontFamily: 'Inter', fontSize: 10, color: Colors.neutral[400] },
  activePrice: { fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: Colors.primary[500] },

  listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.xl, paddingTop: Spacing.xl, paddingBottom: Spacing.md },
  listTitle: { fontFamily: 'Inter-SemiBold', fontSize: 15, color: Colors.neutral[800] },
  listCount: { fontFamily: 'Inter', fontSize: 13, color: Colors.neutral[400] },
  list: { paddingHorizontal: Spacing.xl },
  listCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.neutral[0], borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.md, ...Shadows.xs },
  listCardActive: { borderWidth: 1.5, borderColor: Colors.primary[500] },
  listAvatar: { width: 44, height: 44, borderRadius: 22, marginRight: Spacing.md },
  listInfo: { flex: 1 },
  listName: { fontFamily: 'Inter-SemiBold', fontSize: 14, color: Colors.neutral[800] },
  listSpec: { fontFamily: 'Inter', fontSize: 12, color: Colors.neutral[500], marginTop: 1 },
  listMeta: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 3 },
  listRating: { fontFamily: 'Inter-SemiBold', fontSize: 11, color: Colors.neutral[600] },
  listDistance: { fontFamily: 'Inter', fontSize: 11, color: Colors.neutral[400] },
  listRight: { alignItems: 'flex-end', gap: 6 },
  onlinePip: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.success },
  listPrice: { fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.primary[500] },
});
