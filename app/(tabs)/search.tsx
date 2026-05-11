import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, FlatList, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { featuredTeachers, categories } from '../../constants/mockData';
import { TeacherCard } from '../../components/TeacherCard';
import { CategoryCard } from '../../components/CategoryCard';
import { SearchIcon, FilterIcon } from '../../components/Icons';

const FILTERS = ['All', 'Tajweed', 'Hifz', 'Tafseer', 'Recitation', 'Arabic', 'Kids'];

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const headerAnim = useRef(new Animated.Value(0)).current;
  const headerY = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerAnim, { toValue: 1, duration: 400, delay: 60, useNativeDriver: true }),
      Animated.spring(headerY, { toValue: 0, delay: 60, useNativeDriver: true, damping: 22, stiffness: 200 }),
    ]).start();
  }, []);

  const filtered = featuredTeachers.filter((t) => {
    const matchesQuery = !query || t.name.toLowerCase().includes(query.toLowerCase())
      || t.specializations.some((s) => s.toLowerCase().includes(query.toLowerCase()));
    const matchesFilter = activeFilter === 'All' || t.specializations.includes(activeFilter);
    return matchesQuery && matchesFilter;
  });

  const showResults = query.length > 0 || activeFilter !== 'All';

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Animated.View style={[styles.headerSection, { opacity: headerAnim, transform: [{ translateY: headerY }] }]}>
        <Text style={styles.title}>Find Your Teacher</Text>
        <Text style={styles.subtitle}>500+ certified Quran scholars worldwide</Text>
        <View style={styles.searchBar}>
          <SearchIcon size={20} color={Colors.neutral[400]} />
          <TextInput
            style={styles.searchInput}
            placeholder="Name, specialization, country…"
            placeholderTextColor={Colors.neutral[400]}
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')} style={styles.clearBtn}>
              <Text style={styles.clearText}>✕</Text>
            </TouchableOpacity>
          )}
          <View style={styles.filterDivider} />
          <TouchableOpacity style={styles.filterBtn} activeOpacity={0.7}>
            <FilterIcon size={18} color={Colors.primary[500]} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Filter pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.pillRow}
        style={styles.pillScroll}
      >
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f}
            onPress={() => setActiveFilter(f)}
            style={[styles.pill, activeFilter === f && styles.pillActive]}
            activeOpacity={0.75}
          >
            <Text style={[styles.pillText, activeFilter === f && styles.pillTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Category grid */}
      {!showResults && (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.catScroll}>
          <Text style={styles.sectionTitle}>Browse Categories</Text>
          <View style={styles.catGrid}>
            {categories.map((cat) => (
              <CategoryCard
                key={cat.id}
                category={cat}
                size="large"
                onPress={() => setActiveFilter(cat.title)}
              />
            ))}
          </View>
        </ScrollView>
      )}

      {/* Results */}
      {showResults && (
        <View style={styles.resultsSection}>
          <Text style={styles.resultCount}>
            {filtered.length} teacher{filtered.length !== 1 ? 's' : ''} found
          </Text>
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.resultsList}
            renderItem={({ item }) => (
              <TeacherCard
                teacher={item}
                variant="list"
                onPress={() => router.push(`/teacher/${item.id}`)}
              />
            )}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={styles.emptyTitle}>No teachers found</Text>
                <Text style={styles.emptySub}>Try a different name or category</Text>
              </View>
            }
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.neutral[100] },
  headerSection: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.lg, paddingBottom: Spacing.md },
  title: { fontFamily: 'PlayfairDisplay-Bold', fontSize: 26, color: Colors.neutral[900], letterSpacing: -0.3 },
  subtitle: { fontFamily: 'Inter', fontSize: 13, color: Colors.neutral[500], marginTop: 3, marginBottom: Spacing.lg },
  searchBar: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.neutral[0], borderRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.lg, height: 52, ...Shadows.sm,
  },
  searchInput: { flex: 1, fontFamily: 'Inter', fontSize: 15, color: Colors.neutral[800], marginLeft: Spacing.md },
  clearBtn: { padding: 6 },
  clearText: { fontSize: 13, color: Colors.neutral[400] },
  filterDivider: { width: 1, height: 22, backgroundColor: Colors.neutral[200], marginHorizontal: Spacing.sm },
  filterBtn: { width: 32, height: 32, borderRadius: BorderRadius.md, backgroundColor: `${Colors.primary[500]}12`, alignItems: 'center', justifyContent: 'center' },
  pillScroll: { maxHeight: 56 },
  pillRow: { paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md, gap: Spacing.sm, alignItems: 'center' },
  pill: {
    paddingHorizontal: Spacing.lg, paddingVertical: 8,
    borderRadius: BorderRadius.full, backgroundColor: Colors.neutral[0],
    borderWidth: 1, borderColor: Colors.neutral[200],
  },
  pillActive: { backgroundColor: Colors.primary[500], borderColor: Colors.primary[500] },
  pillText: { fontFamily: 'Inter-Medium', fontSize: 13, color: Colors.neutral[600] },
  pillTextActive: { color: '#fff' },
  catScroll: { paddingHorizontal: Spacing.xl, paddingBottom: 24 },
  sectionTitle: { fontFamily: 'PlayfairDisplay-Bold', fontSize: 18, color: Colors.neutral[800], marginBottom: Spacing.lg, marginTop: Spacing.sm },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md },
  resultsSection: { flex: 1, paddingHorizontal: Spacing.xl },
  resultCount: { fontFamily: 'Inter-Medium', fontSize: 13, color: Colors.neutral[500], marginBottom: Spacing.md, marginTop: Spacing.sm },
  resultsList: { paddingBottom: 24 },
  emptyState: { alignItems: 'center', paddingVertical: 48 },
  emptyTitle: { fontFamily: 'Inter-SemiBold', fontSize: 17, color: Colors.neutral[700] },
  emptySub: { fontFamily: 'Inter', fontSize: 14, color: Colors.neutral[400], marginTop: 6 },
});
