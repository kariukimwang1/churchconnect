import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native'
import { Container, Card } from '@/components/ui'
import { colors, spacing, typography, shadows, borderRadius } from '@/constants/design'
import { useState, useEffect } from 'react'
import { blink } from '@/lib/blink'
import { useAuth } from '@/hooks/useAuth'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'

export default function NotificationsScreen() {
  const { user, isAuthenticated } = useAuth()
  const [notifications, setNotifications] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const SAMPLE_NOTIFICATIONS = [
    {
      id: '1',
      title: 'Payment Received',
      message: 'Your tithe payment of KES 1,000 has been recorded. Thank you for your giving!',
      type: 'payment',
      isRead: '0',
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Event Reminder',
      message: 'Don\'t forget our Mid-Week prayer service today at 5:30 PM.',
      type: 'event',
      isRead: '1',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    }
  ]

  useEffect(() => {
    if (isAuthenticated) {
      loadNotifications()
    }
  }, [isAuthenticated])

  const loadNotifications = async () => {
    try {
      const data = await blink.db.notifications.list({
        where: { userId: user?.id },
        orderBy: { createdAt: 'desc' }
      })
      if (data.length > 0) {
        setNotifications(data)
      } else {
        setNotifications(SAMPLE_NOTIFICATIONS)
      }
    } catch (error) {
      setNotifications(SAMPLE_NOTIFICATIONS)
    } finally {
      setIsLoading(false)
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'payment': return 'wallet'
      case 'event': return 'calendar'
      case 'general': return 'notifications'
      default: return 'notifications'
    }
  }

  const renderNotificationItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={[styles.notificationCard, item.isRead === '0' && styles.unreadCard]} activeOpacity={0.7}>
      <View style={[styles.iconBox, { backgroundColor: item.isRead === '0' ? colors.primaryTint : colors.backgroundSecondary }]}>
        <Ionicons name={getIcon(item.type) as any} size={22} color={item.isRead === '0' ? colors.primary : colors.textTertiary} />
      </View>
      <View style={styles.notificationInfo}>
        <View style={styles.titleRow}>
          <Text style={[styles.notificationTitle, item.isRead === '0' && styles.unreadText]}>{item.title}</Text>
          {item.isRead === '0' && <View style={styles.unreadDot} />}
        </View>
        <Text style={styles.notificationMessage}>{item.message}</Text>
        <Text style={styles.timeText}>{new Date(item.createdAt).toLocaleString()}</Text>
      </View>
    </TouchableOpacity>
  )

  if (!isAuthenticated) {
    return (
      <Container safeArea style={styles.guestContainer}>
        <Ionicons name="notifications-outline" size={80} color={colors.textTertiary} />
        <Text style={styles.guestTitle}>Notifications</Text>
        <Text style={styles.guestSubtitle}>Sign in to view your personalized alerts and updates.</Text>
      </Container>
    )
  }

  return (
    <Container safeArea edges={['top']}>
      <View style={styles.screenHeader}>
        <Text style={styles.screenTitle}>Alerts</Text>
        <Text style={styles.screenSubtitle}>Your church notifications</Text>
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderNotificationItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="notifications-off-outline" size={60} color={colors.textTertiary} />
            <Text style={styles.emptyText}>You're all caught up!</Text>
          </View>
        }
      />
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
  screenHeader: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
  },
  screenTitle: {
    ...typography.h2,
    color: colors.text,
    fontWeight: '800',
  },
  screenSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    opacity: 0.8,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xxl,
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: 20,
    marginBottom: spacing.sm,
    ...shadows.xs,
    alignItems: 'flex-start',
  },
  unreadCard: {
    ...shadows.sm,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.primaryTint,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  notificationInfo: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  notificationTitle: {
    ...typography.body,
    color: colors.textSecondary,
    fontSize: 15,
  },
  unreadText: {
    ...typography.bodyBold,
    color: colors.text,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  notificationMessage: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  timeText: {
    ...typography.tiny,
    color: colors.textTertiary,
    marginTop: 6,
  },
  emptyContainer: {
    padding: spacing.xxl,
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.md,
  },
})
