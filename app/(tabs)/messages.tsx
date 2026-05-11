import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { SearchIcon } from '../../components/Icons';

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  isOnline: boolean;
  subject: string;
}

// Updated with scholarly portraits — consistent with mockData
const CONVERSATIONS: Conversation[] = [
  { id: '1', name: 'Sheikh Ahmad Al-Hasan', avatar: 'https://randomuser.me/api/portraits/men/76.jpg', lastMessage: 'JazakAllah khair, see you at 4pm in sha Allah!', time: '2m', unread: 2, isOnline: true, subject: 'Tajweed' },
  { id: '2', name: 'Ustadha Maryam Khan', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', lastMessage: 'Please review the homework before our next session.', time: '1h', unread: 0, isOnline: false, subject: 'Hifz' },
  { id: '3', name: 'Sheikh Omar Farooq', avatar: 'https://randomuser.me/api/portraits/men/80.jpg', lastMessage: 'The Tafseer of Surah Yusuf is beautiful, is it not?', time: '3h', unread: 1, isOnline: true, subject: 'Tafseer' },
  { id: '4', name: 'Ustadh Ibrahim Yusuf', avatar: 'https://randomuser.me/api/portraits/men/72.jpg', lastMessage: 'Your recitation is improving mashAllah!', time: 'Yesterday', unread: 0, isOnline: true, subject: 'Recitation' },
  { id: '5', name: 'Ustadha Fatima Al-Rashid', avatar: 'https://randomuser.me/api/portraits/women/68.jpg', lastMessage: 'In sha Allah we will continue Juz 28 tomorrow.', time: 'Yesterday', unread: 0, isOnline: false, subject: 'Hifz' },
];

const SUBJECT_COLORS: Record<string, string> = {
  Tajweed: Colors.primary[500],
  Hifz: Colors.primary[700],
  Tafseer: Colors.gold[500],
  Recitation: Colors.primary[400],
};

export default function MessagesScreen() {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [activeConv, setActiveConv] = useState<string | null>(null);

  const filtered = CONVERSATIONS.filter((c) =>
    !query || c.name.toLowerCase().includes(query.toLowerCase())
  );

  const totalUnread = CONVERSATIONS.reduce((a, c) => a + c.unread, 0);

  if (activeConv) {
    const conv = CONVERSATIONS.find((c) => c.id === activeConv)!;
    return <ChatView conv={conv} onBack={() => setActiveConv(null)} insetTop={insets.top} />;
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Messages</Text>
          <Text style={styles.subtitle}>Your scholars, your conversations</Text>
        </View>
        {totalUnread > 0 && (
          <View style={styles.unreadTotal}>
            <Text style={styles.unreadTotalText}>{totalUnread} unread</Text>
          </View>
        )}
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <SearchIcon size={17} color={Colors.neutral[400]} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search conversations…"
          placeholderTextColor={Colors.neutral[400]}
          value={query}
          onChangeText={setQuery}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const isUnread = item.unread > 0;
          const accentColor = SUBJECT_COLORS[item.subject] || Colors.primary[500];

          return (
            <TouchableOpacity
              onPress={() => setActiveConv(item.id)}
              activeOpacity={0.88}
            >
              <View style={[styles.convCard, isUnread && styles.convCardUnread]}>
                {/* Left ribbon — present only on unread, signals priority */}
                {isUnread && (
                  <View style={[styles.unreadRibbon, { backgroundColor: accentColor }]} />
                )}

                <View style={styles.cardInner}>
                  {/* Avatar with gold ring on unread */}
                  <View style={[styles.avatarFrame, isUnread && styles.avatarFrameUnread]}>
                    <Image source={{ uri: item.avatar }} style={styles.avatar} />
                    {item.isOnline && <View style={styles.onlineDot} />}
                  </View>

                  <View style={styles.convInfo}>
                    {/* Top row */}
                    <View style={styles.convTop}>
                      <Text
                        style={[styles.convName, isUnread && styles.convNameUnread]}
                        numberOfLines={1}
                      >
                        {item.name}
                      </Text>
                      <Text style={[styles.convTime, isUnread && styles.convTimeUnread]}>
                        {item.time}
                      </Text>
                    </View>

                    {/* Last message */}
                    <Text
                      style={[styles.convLast, isUnread && styles.convLastUnread]}
                      numberOfLines={1}
                    >
                      {item.lastMessage}
                    </Text>

                    {/* Footer: subject + unread count */}
                    <View style={styles.convFooter}>
                      <View style={[styles.subjectTag, { backgroundColor: `${accentColor}18`, borderColor: `${accentColor}30`, borderWidth: 1 }]}>
                        <Text style={[styles.subjectText, { color: accentColor }]}>{item.subject}</Text>
                      </View>
                      {isUnread && (
                        <LinearGradient
                          colors={[Colors.primary[600], Colors.primary[500]]}
                          style={styles.unreadBadge}
                        >
                          <Text style={styles.unreadText}>{item.unread}</Text>
                        </LinearGradient>
                      )}
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyAr}>لا رسائل</Text>
            <Text style={styles.emptyTitle}>No conversations yet</Text>
            <Text style={styles.emptySub}>Book a session to begin your learning dialogue</Text>
          </View>
        }
      />
    </View>
  );
}

// ─── Chat View ────────────────────────────────────────────────────────
const ChatView: React.FC<{ conv: Conversation; onBack: () => void; insetTop: number }> = ({ conv, onBack, insetTop }) => {
  const [msg, setMsg] = useState('');
  const accentColor = ({ Tajweed: Colors.primary[500], Hifz: Colors.primary[700], Tafseer: Colors.gold[500], Recitation: Colors.primary[400] } as Record<string, string>)[conv.subject] || Colors.primary[500];

  const [messages] = useState([
    { id: '1', text: 'Assalamu Alaikum! Are we still on for today\'s session?', mine: true, time: '3:45 PM' },
    { id: '2', text: 'Wa Alaikum Assalam wa Rahmatullahi wa Barakatuh. Yes, in sha Allah at 4pm.', mine: false, time: '3:47 PM' },
    { id: '3', text: 'Please review Surah Al-Mulk verses 1–10 before we begin. Focus on the madd letters.', mine: false, time: '3:48 PM' },
    { id: '4', text: 'JazakAllah khair, I will prepare.', mine: true, time: '3:50 PM' },
    { id: '5', text: conv.lastMessage, mine: false, time: '3:52 PM' },
  ]);

  return (
    <View style={[chatStyles.container, { paddingTop: insetTop }]}>
      {/* Chat header with brand treatment */}
      <View style={chatStyles.chatHeader}>
        <View style={[chatStyles.headerAccent, { backgroundColor: accentColor }]} />
        <TouchableOpacity onPress={onBack} style={chatStyles.backBtn} activeOpacity={0.7}>
          <Text style={chatStyles.backArrow}>←</Text>
        </TouchableOpacity>
        <View style={[chatStyles.avatarFrame, conv.isOnline && chatStyles.avatarFrameOnline]}>
          <Image source={{ uri: conv.avatar }} style={chatStyles.avatar} />
          {conv.isOnline && <View style={chatStyles.onlineDot} />}
        </View>
        <View style={chatStyles.chatInfo}>
          <Text style={chatStyles.chatName} numberOfLines={1}>{conv.name}</Text>
          <View style={chatStyles.statusRow}>
            {conv.isOnline && <View style={chatStyles.statusDot} />}
            <Text style={[chatStyles.chatStatus, { color: conv.isOnline ? Colors.success : Colors.neutral[400] }]}>
              {conv.isOnline ? 'Online now' : 'Offline'}
            </Text>
          </View>
        </View>
        <View style={[chatStyles.subjectPill, { backgroundColor: `${accentColor}18` }]}>
          <Text style={[chatStyles.subjectText, { color: accentColor }]}>{conv.subject}</Text>
        </View>
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={chatStyles.messageList}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={[chatStyles.bubble, item.mine ? chatStyles.bubbleMine : chatStyles.bubbleTheirs]}>
            <Text style={[chatStyles.bubbleText, item.mine && chatStyles.bubbleTextMine]}>
              {item.text}
            </Text>
            <Text style={[chatStyles.bubbleTime, item.mine && chatStyles.bubbleTimeMine]}>
              {item.time}
            </Text>
          </View>
        )}
      />

      <View style={chatStyles.inputBar}>
        <TextInput
          style={chatStyles.input}
          placeholder="Type a message…"
          placeholderTextColor={Colors.neutral[400]}
          value={msg}
          onChangeText={setMsg}
          multiline
        />
        <TouchableOpacity
          style={[chatStyles.sendBtn, msg.length > 0 && chatStyles.sendBtnActive]}
          activeOpacity={0.8}
        >
          <Text style={chatStyles.sendIcon}>↑</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.neutral[100] },

  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  title: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 26,
    color: Colors.neutral[900],
    letterSpacing: -0.3,
  },
  subtitle: {
    fontFamily: 'Inter',
    fontSize: 12,
    color: Colors.neutral[400],
    marginTop: 3,
    letterSpacing: 0.2,
  },
  unreadTotal: {
    backgroundColor: `${Colors.primary[500]}18`,
    borderWidth: 1,
    borderColor: `${Colors.primary[500]}30`,
    borderRadius: BorderRadius.full,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginTop: 4,
  },
  unreadTotalText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 11,
    color: Colors.primary[600],
    letterSpacing: 0.3,
  },

  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral[0],
    borderRadius: BorderRadius.xl,
    marginHorizontal: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    height: 46,
    gap: 10,
    ...Shadows.xs,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.neutral[150],
  },
  searchInput: { flex: 1, fontFamily: 'Inter', fontSize: 14, color: Colors.neutral[800] },

  list: { paddingHorizontal: Spacing.xl, paddingBottom: 24 },

  // Conversation card — unread gets left ribbon + tinted background
  convCard: {
    flexDirection: 'row',
    backgroundColor: Colors.neutral[0],
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.md,
    overflow: 'hidden',
    ...Shadows.xs,
    borderWidth: 1,
    borderColor: Colors.neutral[150],
  },
  convCardUnread: {
    backgroundColor: `${Colors.primary[500]}06`,
    borderColor: `${Colors.primary[500]}20`,
  },
  // Left ribbon — 3.5px brand-colored accent, same design language as InvitationCard
  unreadRibbon: {
    width: 3.5,
    borderTopLeftRadius: BorderRadius.xl,
    borderBottomLeftRadius: BorderRadius.xl,
  },
  cardInner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: Spacing.lg,
  },

  avatarFrame: {
    position: 'relative',
    marginRight: Spacing.md,
    borderRadius: 30,
    padding: 2,
  },
  avatarFrameUnread: {
    borderWidth: 1.5,
    borderColor: Colors.gold[500],
  },
  avatar: { width: 50, height: 50, borderRadius: 25 },
  onlineDot: {
    position: 'absolute', bottom: 2, right: 2,
    width: 11, height: 11, borderRadius: 6,
    backgroundColor: Colors.success,
    borderWidth: 2, borderColor: Colors.neutral[0],
  },

  convInfo: { flex: 1 },
  convTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
  },
  convName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: Colors.neutral[700],
    flex: 1,
    marginRight: 8,
  },
  convNameUnread: {
    fontFamily: 'Inter-SemiBold',
    color: Colors.neutral[900],
    fontSize: 15,
  },
  convTime: { fontFamily: 'Inter', fontSize: 11, color: Colors.neutral[400] },
  convTimeUnread: { color: Colors.primary[500], fontFamily: 'Inter-Medium' },

  convLast: {
    fontFamily: 'Inter',
    fontSize: 13,
    color: Colors.neutral[400],
    marginBottom: 8,
    lineHeight: 18,
  },
  convLastUnread: {
    color: Colors.neutral[600],
    fontFamily: 'Inter-Medium',
  },

  convFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  subjectTag: {
    alignSelf: 'flex-start',
    borderRadius: BorderRadius.full,
    paddingHorizontal: 9,
    paddingVertical: 3,
  },
  subjectText: { fontFamily: 'Inter-Medium', fontSize: 10, letterSpacing: 0.3 },
  unreadBadge: {
    borderRadius: BorderRadius.full,
    minWidth: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadText: { fontFamily: 'Inter-SemiBold', fontSize: 11, color: '#fff' },

  empty: { alignItems: 'center', paddingVertical: 64 },
  emptyAr: { fontSize: 28, color: Colors.neutral[300], marginBottom: 8 },
  emptyTitle: { fontFamily: 'Inter-SemiBold', fontSize: 17, color: Colors.neutral[700] },
  emptySub: {
    fontFamily: 'Inter', fontSize: 13, color: Colors.neutral[400],
    marginTop: 6, textAlign: 'center', lineHeight: 20,
  },
});

const chatStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.neutral[100] },

  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral[0],
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    ...Shadows.sm,
    position: 'relative',
    overflow: 'hidden',
  },
  // Top accent line on chat header — echoes the card ribbon
  headerAccent: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: 2.5,
  },

  backBtn: { marginRight: Spacing.md, padding: 4 },
  backArrow: { fontSize: 22, color: Colors.neutral[700] },

  avatarFrame: {
    position: 'relative',
    marginRight: Spacing.md,
    borderRadius: 24,
    padding: 2,
  },
  avatarFrameOnline: {
    borderWidth: 1.5,
    borderColor: `${Colors.gold[500]}80`,
  },
  avatar: { width: 38, height: 38, borderRadius: 19 },
  onlineDot: {
    position: 'absolute', bottom: 1, right: 1,
    width: 9, height: 9, borderRadius: 5,
    backgroundColor: Colors.success,
    borderWidth: 1.5, borderColor: Colors.neutral[0],
  },

  chatInfo: { flex: 1 },
  chatName: { fontFamily: 'Inter-SemiBold', fontSize: 14, color: Colors.neutral[900] },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  statusDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: Colors.success },
  chatStatus: { fontFamily: 'Inter', fontSize: 11 },

  subjectPill: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  subjectText: { fontFamily: 'Inter-Medium', fontSize: 10, letterSpacing: 0.3 },

  messageList: { padding: Spacing.xl, gap: Spacing.sm },
  bubble: { maxWidth: '78%', borderRadius: BorderRadius.xl, padding: Spacing.md, marginBottom: 2 },
  bubbleMine: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.primary[500],
    borderBottomRightRadius: 6,
  },
  bubbleTheirs: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.neutral[0],
    borderBottomLeftRadius: 6,
    ...Shadows.xs,
    borderWidth: 1,
    borderColor: Colors.neutral[150],
  },
  bubbleText: { fontFamily: 'Inter', fontSize: 14, color: Colors.neutral[800], lineHeight: 22 },
  bubbleTextMine: { color: '#fff' },
  bubbleTime: {
    fontFamily: 'Inter', fontSize: 10, color: Colors.neutral[400],
    marginTop: 4, textAlign: 'right',
  },
  bubbleTimeMine: { color: 'rgba(255,255,255,0.6)' },

  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: Colors.neutral[0],
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
    ...Shadows.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[150],
  },
  input: {
    flex: 1,
    fontFamily: 'Inter',
    fontSize: 15,
    color: Colors.neutral[800],
    maxHeight: 100,
    backgroundColor: Colors.neutral[100],
    borderRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 10,
  },
  sendBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.neutral[200],
    alignItems: 'center', justifyContent: 'center',
  },
  sendBtnActive: { backgroundColor: Colors.primary[500] },
  sendIcon: { fontSize: 18, color: '#fff', fontWeight: '700' },
});
