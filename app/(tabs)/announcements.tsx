import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native'
import { Container, Card } from '@/components/ui'
import { colors, spacing, typography, shadows, borderRadius } from '@/constants/design'
import { useState, useEffect } from 'react'
import { blink } from '@/lib/blink'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'

export default function AnnouncementsScreen() {
  const [announcements, setAnnouncements] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const SAMPLE_ANNOUNCEMENTS = [
    {
      id: '1',
      title: 'New Service Times',
      content: 'Starting next month, our first service will begin at 8:00 AM instead of 8:30 AM.',
      category: 'Worship',
      priority: 'high',
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Youth Camp 2026',
      content: 'Registration for the annual youth camp is now open. Pick your forms at the desk.',
      category: 'Youth',
      priority: 'normal',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    }
  ]

  useEffect(() => {
    loadAnnouncements()
  }, [])

  const loadAnnouncements = async () => {
    try {
      const data = await blink.db.announcements.list({
        orderBy: { createdAt: 'desc' }
      })
      if (data.length > 0) {
        setAnnouncements(data)
      } else {
        setAnnouncements(SAMPLE_ANNOUNCEMENTS)
      }
    } catch (error) {
      setAnnouncements(SAMPLE_ANNOUNCEMENTS)
    } finally {
      setIsLoading(false)
    }
  }

  const renderAnnouncementItem = ({ item }: { item: any }) => (
    <View style={styles.announcementCard}>
      <View style={[styles.priorityIndicator, { backgroundColor: item.priority === 'high' ? colors.secondary : colors.primary }]} />
      <View style={styles.announcementContent}>
        <View style={styles.metaHeader}>
          <View style={styles.categoryBox}>
            <Text style={styles.categoryLabel}>{item.category || 'General'}</Text>
          </View>
          <Text style={styles.timeText}>{new Date(item.createdAt).toLocaleDateString()}</Text>
        </View>
        <Text style={styles.announcementTitle}>{item.title}</Text>
        <Text style={styles.announcementText}>{item.content}</Text>
      </View>
    </View>
  )

  return (
    <Container safeArea edges={['top']}>
      <View style={styles.screenHeader}>
        <Text style={styles.screenTitle}>Church News</Text>
        <Text style={styles.screenSubtitle}>Latest updates and announcements</Text>
      </View>

      <FlatList
        data={announcements}
        keyExtractor={(item) => item.id}
        renderItem={renderAnnouncementItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </Container>
  )
}

const styles = StyleSheet.create({
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
  announcementCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 24,
    marginBottom: spacing.md,
    overflow: 'hidden',
    ...shadows.sm,
  },
  priorityIndicator: {
    width: 6,
    height: '100%',
  },
  announcementContent: {
    flex: 1,
    padding: spacing.lg,
  },
  metaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryBox: {
    backgroundColor: colors.primaryTint,
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 8,
  },
  categoryLabel: {
    ...typography.tiny,
    color: colors.primary,
    fontWeight: 'bold',
  },
  timeText: {
    ...typography.tiny,
    color: colors.textTertiary,
  },
  announcementTitle: {
    ...typography.bodyBold,
    color: colors.text,
    fontSize: 17,
    marginBottom: 6,
  },
  announcementText: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
  },
})
