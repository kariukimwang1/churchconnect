import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, Dimensions } from 'react-native'
import { Container, Card } from '@/components/ui'
import { colors, spacing, typography, shadows, borderRadius } from '@/constants/design'
import { useState, useEffect } from 'react'
import { blink } from '@/lib/blink'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'

const { width } = Dimensions.get('window')

export default function EventsScreen() {
  const [events, setEvents] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const SAMPLE_EVENTS = [
    {
      id: '1',
      title: 'Annual Youth Conference',
      description: 'A three-day spiritual journey for the youth. Themes of identity and purpose.',
      venue: 'Main Sanctuary',
      startDate: '2026-04-15',
      startTime: '09:00 AM',
      category: 'Youth',
      image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=500&auto=format&fit=crop'
    },
    {
      id: '2',
      title: 'Easter Sunday Service',
      description: 'Celebrating the resurrection of our Lord Jesus Christ.',
      venue: 'Church Grounds',
      startDate: '2026-04-05',
      startTime: '08:30 AM',
      category: 'Worship',
      image: 'https://images.unsplash.com/photo-1544427928-c49cdfebf194?q=80&w=500&auto=format&fit=crop'
    }
  ]

  useEffect(() => {
    loadEvents()
  }, [])

  const loadEvents = async () => {
    try {
      const data = await blink.db.events.list({
        where: { isActive: '1' },
        orderBy: { startDate: 'asc' }
      })
      if (data.length > 0) {
        setEvents(data)
      } else {
        setEvents(SAMPLE_EVENTS)
      }
    } catch (error) {
      setEvents(SAMPLE_EVENTS)
    } finally {
      setIsLoading(false)
    }
  }

  const renderEventItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.eventCard} activeOpacity={0.9}>
      <View style={styles.eventContent}>
        <View style={styles.dateBadge}>
          <Text style={styles.dateMonth}>{new Date(item.startDate).toLocaleString('default', { month: 'short' }).toUpperCase()}</Text>
          <Text style={styles.dateDay}>{new Date(item.startDate).getDate()}</Text>
        </View>
        <View style={styles.infoContent}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{item.category || 'Event'}</Text>
          </View>
          <Text style={styles.eventTitle}>{item.title}</Text>
          <View style={styles.metaRow}>
            <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
            <Text style={styles.metaText}>{item.startTime}</Text>
            <View style={styles.dot} />
            <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
            <Text style={styles.metaText} numberOfLines={1}>{item.venue}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.addBtn}>
          <Ionicons name="add" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  )

  return (
    <Container safeArea edges={['top']}>
      <View style={styles.screenHeader}>
        <Text style={styles.screenTitle}>Events</Text>
        <Text style={styles.screenSubtitle}>Upcoming church activities</Text>
      </View>

      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={renderEventItem}
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
  eventCard: {
    backgroundColor: colors.white,
    borderRadius: 24,
    marginBottom: spacing.md,
    padding: spacing.md,
    ...shadows.sm,
  },
  eventContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateBadge: {
    width: 60,
    height: 70,
    backgroundColor: colors.primaryTint,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  dateMonth: {
    ...typography.tiny,
    color: colors.primary,
    fontWeight: '800',
  },
  dateDay: {
    ...typography.h3,
    color: colors.primary,
    fontWeight: '800',
  },
  infoContent: {
    flex: 1,
  },
  categoryBadge: {
    backgroundColor: colors.secondaryTint,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  categoryText: {
    ...typography.tiny,
    color: colors.secondary,
    fontWeight: '700',
  },
  eventTitle: {
    ...typography.bodyBold,
    color: colors.text,
    fontSize: 16,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  metaText: {
    ...typography.tiny,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: colors.textTertiary,
    marginHorizontal: 6,
  },
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
})
