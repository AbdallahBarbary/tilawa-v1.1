import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet, Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/theme';
import { HomeIcon, SearchIcon, MapPinIcon, ChatIcon, ProfileIcon } from '../../components/Icons';

const TABS = [
  { name: 'index', label: 'Home', Icon: HomeIcon },
  { name: 'search', label: 'Search', Icon: SearchIcon },
  { name: 'map', label: 'Nearby', Icon: MapPinIcon },
  { name: 'messages', label: 'Messages', Icon: ChatIcon },
  { name: 'profile', label: 'Profile', Icon: ProfileIcon },
];

const TabItem: React.FC<{ label: string; Icon: any; focused: boolean; onPress: () => void }> = ({
  label, Icon, focused, onPress,
}) => {
  const scale = useRef(new Animated.Value(focused ? 1 : 0.92)).current;
  const dotOpacity = useRef(new Animated.Value(focused ? 1 : 0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, { toValue: focused ? 1 : 0.92, useNativeDriver: true, damping: 20, stiffness: 260 }),
      Animated.timing(dotOpacity, { toValue: focused ? 1 : 0, duration: 200, useNativeDriver: true }),
    ]).start();
  }, [focused]);

  return (
    <TouchableOpacity onPress={onPress} style={styles.tabItem} activeOpacity={0.7}>
      <Animated.View style={[styles.tabIconWrap, { transform: [{ scale }] }]}>
        <Icon size={22} color={focused ? Colors.primary[500] : Colors.neutral[400]} filled={focused} />
      </Animated.View>
      <Text style={[styles.tabLabel, focused && styles.tabLabelActive]} numberOfLines={1}>
        {label}
      </Text>
      <Animated.View style={[styles.activeDot, { opacity: dotOpacity }]} />
    </TouchableOpacity>
  );
};

function CustomTabBar({ state, navigation }: any) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.tabBar, { paddingBottom: insets.bottom > 0 ? insets.bottom : 12 }]}>
      {state.routes.map((route: any, index: number) => {
        const tab = TABS.find((t) => t.name === route.name);
        if (!tab) return null;
        const focused = state.index === index;
        return (
          <TabItem
            key={route.key}
            label={tab.label}
            Icon={tab.Icon}
            focused={focused}
            onPress={() => {
              const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
              if (!focused && !event.defaultPrevented) navigation.navigate(route.name);
            }}
          />
        );
      })}
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="search" />
      <Tabs.Screen name="map" />
      <Tabs.Screen name="messages" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.neutral[0],
    paddingTop: 10,
    paddingHorizontal: 4,
    borderTopWidth: 0,
    ...Platform.select({
      ios: { shadowColor: '#081A12', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.07, shadowRadius: 16 },
      android: { elevation: 16 },
    }),
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
    minWidth: 0,
  },
  tabIconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 3,
  },
  tabLabel: {
    fontFamily: 'Inter',
    fontSize: 10,
    color: Colors.neutral[400],
    textAlign: 'center',
  },
  tabLabelActive: {
    fontFamily: 'Inter-SemiBold',
    color: Colors.primary[500],
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.gold[500],
    marginTop: 3,
  },
});
