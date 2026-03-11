import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Dimensions } from 'react-native'
import { Container, Avatar } from '@/components/ui'
import { colors, spacing, typography, shadows, borderRadius } from '@/constants/design'
import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { blink } from '@/lib/blink'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'

const { width } = Dimensions.get('window')

export default function ChatScreen() {
  const { user, isAuthenticated } = useAuth()
  const [messages, setMessages] = useState<any[]>([])
  const [inputText, setInputText] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const flatListRef = useRef<FlatList>(null)

  useEffect(() => {
    loadMessages()
    // In production, setup real-time subscription here
  }, [])

  const loadMessages = async () => {
    try {
      const data = await blink.db.chatMessages.list({
        orderBy: { createdAt: 'asc' },
        limit: 50
      })
      setMessages(data)
    } catch (error) {
      // Sample messages for demo
      setMessages([
        { id: '1', senderName: 'Elder John', content: 'God bless you all! Welcome to our community chat.', senderId: 'e1', createdAt: new Date(Date.now() - 3600000).toISOString() },
        { id: '2', senderName: 'Mary W.', content: 'Amen! Looking forward to Sunday service.', senderId: 'u1', createdAt: new Date(Date.now() - 1800000).toISOString() }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendMessage = async () => {
    if (!inputText.trim() || !user) return

    const newMessage = {
      senderId: user.id,
      senderName: user.displayName || 'Member',
      content: inputText.trim(),
      messageType: 'text',
      createdAt: new Date().toISOString()
    }

    setMessages([...messages, newMessage])
    setInputText('')

    try {
      await blink.db.chatMessages.create({
        senderId: user.id,
        senderName: user.displayName || 'Member',
        content: inputText.trim()
      })
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  const renderMessageItem = ({ item }: { item: any }) => {
    const isMe = item.senderId === user?.id
    return (
      <View style={[styles.messageRow, isMe ? styles.myMessageRow : styles.otherMessageRow]}>
        {!isMe && (
          <Avatar 
            name={item.senderName} 
            size="sm" 
            style={styles.avatar}
          />
        )}
        <View style={[
          styles.messageBubble,
          isMe ? styles.myBubble : styles.otherBubble
        ]}>
          {!isMe && <Text style={styles.senderName}>{item.senderName}</Text>}
          <Text style={[styles.messageText, isMe && styles.myMessageText]}>
            {item.content}
          </Text>
          <Text style={[styles.messageTime, isMe && styles.myMessageTime]}>
            {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      </View>
    )
  }

  if (!isAuthenticated) {
    return (
      <Container safeArea style={styles.guestContainer}>
        <Ionicons name="chatbubbles-outline" size={80} color={colors.textTertiary} />
        <Text style={styles.guestTitle}>Join the Community</Text>
        <Text style={styles.guestSubtitle}>Please sign in to join the conversation.</Text>
      </Container>
    )
  }

  return (
    <Container safeArea edges={['top']}>
      <View style={styles.chatHeader}>
        <LinearGradient colors={[colors.primary, colors.primaryDark]} style={styles.headerGradient}>
          <Text style={styles.headerTitle}>Community Chat</Text>
          <View style={styles.onlineBadge}>
            <View style={styles.onlineDot} />
            <Text style={styles.onlineText}>Active</Text>
          </View>
        </LinearGradient>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
        keyboardVerticalOffset={100}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id || Math.random().toString()}
          renderItem={renderMessageItem}
          contentContainerStyle={styles.messageList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
          showsVerticalScrollIndicator={false}
        />

        <View style={styles.inputWrapper}>
          <View style={styles.inputContainer}>
            <TouchableOpacity style={styles.attachBtn}>
              <Ionicons name="add" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="Type a message..."
              value={inputText}
              onChangeText={setInputText}
              multiline
            />
            <TouchableOpacity 
              style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]}
              onPress={handleSendMessage}
              disabled={!inputText.trim()}
            >
              <Ionicons name="send" size={20} color={colors.white} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Container>
  )
}

const styles = StyleSheet.create({
  guestContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  guestTitle: {
    ...typography.h3,
    color: colors.text,
    marginTop: spacing.lg,
  },
  guestSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  chatHeader: {
    height: 80,
  },
  headerGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  headerTitle: {
    ...typography.h3,
    color: colors.white,
    fontWeight: '700',
  },
  onlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4ADE80',
    marginRight: 6,
  },
  onlineText: {
    ...typography.tiny,
    color: colors.white,
    fontWeight: 'bold',
  },
  keyboardView: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  messageList: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    maxWidth: '85%',
  },
  myMessageRow: {
    alignSelf: 'flex-end',
  },
  otherMessageRow: {
    alignSelf: 'flex-start',
  },
  avatar: {
    marginRight: spacing.sm,
    alignSelf: 'flex-end',
  },
  messageBubble: {
    padding: spacing.md,
    borderRadius: 20,
    ...shadows.xs,
  },
  myBubble: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: colors.white,
    borderBottomLeftRadius: 4,
  },
  senderName: {
    ...typography.tiny,
    color: colors.primary,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  messageText: {
    ...typography.body,
    color: colors.text,
    fontSize: 15,
  },
  myMessageText: {
    color: colors.white,
  },
  messageTime: {
    ...typography.tiny,
    color: colors.textTertiary,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  myMessageTime: {
    color: 'rgba(255,255,255,0.7)',
  },
  inputWrapper: {
    padding: spacing.md,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 24,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  attachBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    paddingHorizontal: spacing.sm,
    maxHeight: 100,
    ...typography.body,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: colors.textDisabled,
  },
})
