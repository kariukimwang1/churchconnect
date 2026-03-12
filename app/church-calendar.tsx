import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Dimensions } from 'react-native'
import { Card, Container } from '@/components/ui'
import { colors, spacing, typography, shadows, borderRadius } from '@/constants/design'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'

const { width } = Dimensions.get('window')

export default function ChurchCalendarScreen() {
  const currentMonth = 'March 2026'

  const calendarEvents = [
    {
      id: '1',
      date: 'Mar 15, 2026',
      title: 'Sunday Worship Service',
      time: '9:00 AM - 12:30 PM',
      location: 'Main Sanctuary',
      type: 'worship',
      recurring: true,
    },
    {
      id: '2',
      date: 'Mar 17, 2026',
      title: 'Mid-Week Prayer Meeting',
      time: '6:30 PM - 7:30 PM',
      location: 'Prayer Chapel',
      type: 'prayer',
      recurring: true,
    },
    {
      id: '3',
      date: 'Mar 20, 2026',
      title: 'Youth Fellowship',
      time: '3:00 PM - 5:00 PM',
      location: 'Youth Hall',
      type: 'fellowship',
      recurring: false,
    },
    {
      id: '4',
      date: 'Mar 22, 2026',
      title: 'Monthly Business Meeting',
      time: '2:00 PM - 4:00 PM',
      location: 'Conference Room',
      type: 'meeting',
      recurring: false,
    },
    {
      id: '5',
      date: 'Mar 29, 2026',
      title: 'Easter Celebration',
      time: '8:00 AM - 1:00 PM',
      location: 'Main Sanctuary',
      type: 'special',
      recurring: false,
    },
  ]

  const getEventColor = (type: string) => {
    switch (type) {
      case 'worship':
        return colors.primary
      case 'prayer':
        return colors.secondary
      case 'fellowship':
        return colors.accent
      case 'meeting':
        return colors.info
      case 'special':
        return colors.success
      default:
        return colors.textSecondary
    }
  }

  const renderEvent = ({ item }: { item: any }) => (
    <Card variant="elevated" style={styles.eventCard}>
      <Card.Content style={styles.eventContent}>
        <View style={styles.eventHeader}>
          <View style={[styles.eventTypeIcon, { backgroundColor: getEventColor(item.type) + '15' }]}>
            <Ionicons
              name={
                item.type === 'worship'
                  ? 'musical-notes'
                  : item.type === 'prayer'
                  ? 'heart'
                  : item.type === 'fellowship'
                  ? 'people'
                  : item.type === 'meeting'
                  ? 'people-circle'
                  : 'star'
              }
              size={20}
              color={getEventColor(item.type)}
            />
          </View>
          <View style={styles.eventInfo}>
            <Text style={styles.eventDate}>{item.date}</Text>
            <Text style={styles.eventTime}>{item.time}</Text>
          </View>
          {item.recurring && (
            <View style={styles.recurringBadge}>
              <Text style={styles.recurringText}>Recurring</Text>
            </View>
          )}
        </View>
        <Text style={styles.eventTitle}>{item.title}</Text>
        <View style={styles.eventFooter}>
          <Ionicons name="location" size={14} color={colors.textSecondary} />
          <Text style={styles.eventLocation}>{item.location}</Text>
        </View>
      </Card.Content>
    </Card>
  )

  return (
    <Container safeArea edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.headerSection}>
          <View>
            <Text style={styles.screenTitle}>Church Calendar</Text>
            <Text style={styles.currentMonth}>{currentMonth}</Text>
          </View>
          <TouchableOpacity style={styles.viewToggleBtn}>
            <Ionicons name="calendar" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Liturgical Calendar Info */}
        <View style={styles.liturgicalSection}>
          <LinearGradient
            colors={[colors.primaryTint, colors.white]}
            style={styles.liturgicalCard}
          >
            <View style={styles.liturgicalContent}>
              <Ionicons name="cross" size={24} color={colors.primary} />
              <View style={styles.liturgicalInfo}>
                <Text style={styles.liturgicalLabel}>Current Season</Text>
                <Text style={styles.liturgicalValue}>Lent (Passion)</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Upcoming Events */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Events</Text>
          <FlatList
            data={calendarEvents}
            keyExtractor={(item) => item.id}
            renderItem={renderEvent}
            scrollEnabled={false}
            contentContainerStyle={styles.eventsList}
          />
        </View>

        {/* Special Dates Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Special Dates & Observances</Text>
          <View style={styles.specialDatesContainer}>
            {[
              { date: 'Easter Sunday', day: 'Mar 29' },
              { date: 'Pentecost Sunday', day: 'May 25' },
              { date: 'Thanksgiving', day: 'Nov 27' },
              { date: 'Christmas Day', day: 'Dec 25' },
            ].map((item, index) => (
              <Card key={index} variant="elevated" style={styles.specialDateCard}>
                <Card.Content style={styles.specialDateContent}>
                  <View>
                    <Text style={styles.specialDateName}>{item.date}</Text>
                    <Text style={styles.specialDateValue}>{item.day}</Text>
                  </View>
                  <Ionicons name="star" size={20} color={colors.accent} />
                </Card.Content>
              </Card>
            ))}
          </View>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </Container>
  )
}

const styles = StyleSheet.create({
  scrollContent: {
    backgroundColor: colors.backgroundSecondary,
  },
  headerSection: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  screenTitle: {
    ...typography.h2,
    color: colors.text,
    fontWeight: '800',
  },
  currentMonth: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  viewToggleBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.xs,
  },
  liturgicalSection: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  liturgicalCard: {
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    ...shadows.xs,
  },
  liturgicalContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  liturgicalInfo: {
    flex: 1,
  },
  liturgicalLabel: {
    ...typography.tiny,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  liturgicalValue: {
    ...typography.bodyBold,
    color: colors.primary,
    fontSize: 16,
  },
  section: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    fontWeight: '700',
    marginBottom: spacing.md,
    fontSize: 18,
  },
  eventsList: {
    gap: spacing.md,
  },
  eventCard: {
    borderRadius: borderRadius.lg,
  },
  eventContent: {
    flex: 1,
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  eventTypeIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventInfo: {
    flex: 1,
  },
  eventDate: {
    ...typography.tiny,
    color: colors.textSecondary,
  },
  eventTime: {
    ...typography.bodyBold,
    color: colors.text,
    marginTop: spacing.xs,
    fontSize: 15,
  },
  recurringBadge: {
    backgroundColor: colors.infoTint,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.md,
  },
  recurringText: {
    ...typography.tiny,
    color: colors.info,
    fontWeight: '600',
  },
  eventTitle: {
    ...typography.bodyBold,
    color: colors.text,
    fontSize: 16,
    marginBottom: spacing.md,
  },
  eventFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  eventLocation: {
    ...typography.tiny,
    color: colors.textSecondary,
  },
  specialDatesContainer: {
    gap: spacing.md,
  },
  specialDateCard: {
    borderRadius: borderRadius.lg,
  },
  specialDateContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  specialDateName: {
    ...typography.bodyBold,
    color: colors.text,
  },
  specialDateValue: {
    ...typography.tiny,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  bottomPadding: {
    height: spacing.xxl,
  },
})
