import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Image } from 'react-native';
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

const CONVERSATIONS: Conversation[] = [
  { id: '1', name: 'Sheikh Ahmad Al-Hasan', avatar: 'https://i.pravatar.cc/300?img=11', lastMessage: 'JazakAllah khair, see you at 4pm!', time: '2m', unread: 2, isOnline: true, subject: 'Tajweed' },
  { id: '2', name: 'Ustadha Maryam Khan', avatar: 'https://i.pravatar.cc/300?img=23', lastMessage: 'Please review the homework before our next session.', time: '1h', unread: 0, isOnline: false, subject: 'Hifz' },
  { id: '3', name: 'Sheikh Omar Farooq', avatar: 'https://i.pravatar.cc/300?img=33', lastMessage: 'The Tafseer of Surah Yusuf is beautiful, isn\'t it?', time: '3h', unread: 1, isOnline: true, subject: 'Tafseer' },
  { id: '4', name: 'Ustadh Ibrahim Yusuf', avatar: 'https://i.pravatar.cc/300?img=59', lastMessage: 'Your recitation is improving mashAllah!', time: 'Yesterday', unread: 0, isOnline: true, subject: 'Recitation' },
  { id: '5', name: 'Ustadha Fatima Al-Rashid', avatar: 'https://i.pravatar.cc/300?img=47', lastMessage: 'In sha Allah we will continue Juz 28 tomorrow.', time: 'Yesterday', unread: 0, isOnline: false, subject: 'Hifz' },
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

  if (activeConv) {
    const conv = CONVERSATIONS.find((c) => c.id === activeConv)!;
    return <ChatView conv={conv} onBack={() => setActiveConv(null)} insetTop={insets.top} />;
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
        <View style={styles.totalBadge}>
          <Text style={styles.totalBadgeText}>{CONVERSATIONS.reduce((a, c) => a + c.unread, 0)}</Text>
        </View>
      </View>

      <View style={styles.searchBar}>
        <SearchIcon size={18} color={Colors.neutral[400]} />
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
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.convCard} onPress={() => setActiveConv(item.id)} activeOpacity={0.85}>
            <View style={styles.avatarWrap}>
              <Image source={{ uri: item.avatar }} style={styles.avatar} />
              {item.isOnline && <View style={styles.onlineDot} />}
            </View>
            <View style={styles.convInfo}>
              <View style={styles.convTop}>
                <Text style={styles.convName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.convTime}>{item.time}</Text>
              </View>
              <View style={styles.convBottom}>
                <Text style={styles.convLast} numberOfLines={1}>{item.lastMessage}</Text>
                {item.unread > 0 && (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadText}>{item.unread}</Text>
                  </View>
                )}
              </View>
              <View style={[styles.subjectTag, { backgroundColor: `${SUBJECT_COLORS[item.subject] || Colors.primary[500]}15` }]}>
                <Text style={[styles.subjectText, { color: SUBJECT_COLORS[item.subject] || Colors.primary[500] }]}>{item.subject}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No conversations</Text>
            <Text style={styles.emptySub}>Book a session to start messaging teachers</Text>
          </View>
        }
      />
    </View>
  );
}

const ChatView: React.FC<{ conv: Conversation; onBack: () => void; insetTop: number }> = ({ conv, onBack, insetTop }) => {
  const [msg, setMsg] = useState('');
  const [messages] = useState([
    { id: '1', text: 'Assalamu Alaikum! Are we still on for today\'s session?', mine: true, time: '3:45 PM' },
    { id: '2', text: 'Wa Alaikum Assalam! Yes, in sha Allah at 4pm.', mine: false, time: '3:47 PM' },
    { id: '3', text: 'Please review Surah Al-Mulk verses 1-10 before we begin.', mine: false, time: '3:48 PM' },
    { id: '4', text: 'JazakAllah khair, I will prepare.', mine: true, time: '3:50 PM' },
    { id: '5', text: conv.lastMessage, mine: false, time: '3:52 PM' },
  ]);

  return (
    <View style={[chatStyles.container, { paddingTop: insetTop }]}>
      <View style={chatStyles.chatHeader}>
        <TouchableOpacity onPress={onBack} style={chatStyles.backBtn} activeOpacity={0.7}>
          <Text style={chatStyles.backArrow}>←</Text>
        </TouchableOpacity>
        <View style={chatStyles.avatarWrap}>
          <Image source={{ uri: conv.avatar }} style={chatStyles.avatar} />
          {conv.isOnline && <View style={chatStyles.onlineDot} />}
        </View>
        <View style={chatStyles.chatInfo}>
          <Text style={chatStyles.chatName} numberOfLines={1}>{conv.name}</Text>
          <Text style={chatStyles.chatStatus}>{conv.isOnline ? 'Online' : 'Offline'}</Text>
        </View>
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={chatStyles.messageList}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={[chatStyles.bubble, item.mine ? chatStyles.bubbleMine : chatStyles.bubbleTheirs]}>
            <Text style={[chatStyles.bubbleText, item.mine && chatStyles.bubbleTextMine]}>{item.text}</Text>
            <Text style={[chatStyles.bubbleTime, item.mine && chatStyles.bubbleTimeMine]}>{item.time}</Text>
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.neutral[100] },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.xl, paddingTop: Spacing.lg, paddingBottom: Spacing.md, gap: 10 },
  title: { fontFamily: 'PlayfairDisplay-Bold', fontSize: 26, color: Colors.neutral[900], letterSpacing: -0.3 },
  totalBadge: { backgroundColor: Colors.primary[500], borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2 },
  totalBadgeText: { fontFamily: 'Inter-SemiBold', fontSize: 12, color: '#fff' },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.neutral[0], borderRadius: BorderRadius.xl, marginHorizontal: Spacing.xl, paddingHorizontal: Spacing.lg, height: 46, gap: 10, ...Shadows.xs, marginBottom: Spacing.lg },
  searchInput: { flex: 1, fontFamily: 'Inter', fontSize: 14, color: Colors.neutral[800] },
  list: { paddingHorizontal: Spacing.xl, paddingBottom: 24 },
  convCard: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: Colors.neutral[0], borderRadius: BorderRadius.xl, padding: Spacing.lg, marginBottom: Spacing.md, ...Shadows.xs },
  avatarWrap: { position: 'relative', marginRight: Spacing.md },
  avatar: { width: 52, height: 52, borderRadius: 26 },
  onlineDot: { position: 'absolute', bottom: 1, right: 1, width: 12, height: 12, borderRadius: 6, backgroundColor: Colors.success, borderWidth: 2, borderColor: Colors.neutral[0] },
  convInfo: { flex: 1 },
  convTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 },
  convName: { fontFamily: 'Inter-SemiBold', fontSize: 15, color: Colors.neutral[900], flex: 1 },
  convTime: { fontFamily: 'Inter', fontSize: 11, color: Colors.neutral[400] },
  convBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  convLast: { fontFamily: 'Inter', fontSize: 13, color: Colors.neutral[500], flex: 1 },
  unreadBadge: { backgroundColor: Colors.primary[500], borderRadius: 10, minWidth: 20, height: 20, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 5, marginLeft: 8 },
  unreadText: { fontFamily: 'Inter-SemiBold', fontSize: 11, color: '#fff' },
  subjectTag: { alignSelf: 'flex-start', borderRadius: BorderRadius.full, paddingHorizontal: 8, paddingVertical: 2 },
  subjectText: { fontFamily: 'Inter-Medium', fontSize: 11 },
  empty: { alignItems: 'center', paddingVertical: 56 },
  emptyTitle: { fontFamily: 'Inter-SemiBold', fontSize: 18, color: Colors.neutral[700] },
  emptySub: { fontFamily: 'Inter', fontSize: 14, color: Colors.neutral[400], marginTop: 6, textAlign: 'center' },
});

const chatStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.neutral[100] },
  chatHeader: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.neutral[0], paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md, ...Shadows.sm },
  backBtn: { marginRight: Spacing.md, padding: 4 },
  backArrow: { fontSize: 22, color: Colors.neutral[700] },
  avatarWrap: { position: 'relative', marginRight: Spacing.md },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  onlineDot: { position: 'absolute', bottom: 0, right: 0, width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.success, borderWidth: 1.5, borderColor: Colors.neutral[0] },
  chatInfo: { flex: 1 },
  chatName: { fontFamily: 'Inter-SemiBold', fontSize: 15, color: Colors.neutral[900] },
  chatStatus: { fontFamily: 'Inter', fontSize: 12, color: Colors.success },
  messageList: { padding: Spacing.xl, gap: Spacing.sm },
  bubble: { maxWidth: '78%', borderRadius: BorderRadius.xl, padding: Spacing.md, marginBottom: 2 },
  bubbleMine: { alignSelf: 'flex-end', backgroundColor: Colors.primary[500], borderBottomRightRadius: 6 },
  bubbleTheirs: { alignSelf: 'flex-start', backgroundColor: Colors.neutral[0], borderBottomLeftRadius: 6, ...Shadows.xs },
  bubbleText: { fontFamily: 'Inter', fontSize: 14, color: Colors.neutral[800], lineHeight: 22 },
  bubbleTextMine: { color: '#fff' },
  bubbleTime: { fontFamily: 'Inter', fontSize: 10, color: Colors.neutral[400], marginTop: 4, textAlign: 'right' },
  bubbleTimeMine: { color: 'rgba(255,255,255,0.6)' },
  inputBar: { flexDirection: 'row', alignItems: 'flex-end', backgroundColor: Colors.neutral[0], paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, gap: Spacing.md, ...Shadows.sm },
  input: { flex: 1, fontFamily: 'Inter', fontSize: 15, color: Colors.neutral[800], maxHeight: 100, backgroundColor: Colors.neutral[100], borderRadius: BorderRadius.xl, paddingHorizontal: Spacing.lg, paddingVertical: 10 },
  sendBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.neutral[300], alignItems: 'center', justifyContent: 'center' },
  sendBtnActive: { backgroundColor: Colors.primary[500] },
  sendIcon: { fontSize: 18, color: '#fff', fontWeight: '700' },
});
