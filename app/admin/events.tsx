import { View, Text, StyleSheet, ScrollView, FlatList } from 'react-native'
import { Card, Container, Button, Input } from '@/components/ui'
import { colors, spacing, typography, borderRadius } from '@/constants/design'
import { useState } from 'react'

export default function EventsScreen() {
  const [eventTitle, setEventTitle] = useState('')

  const events = [
    { id: '1', title: 'Sunday Service', date: 'Mar 15' },
    { id: '2', title: 'Youth Fellowship', date: 'Mar 20' },
  ]

  return (
    <Container safeArea edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Event Management</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.label}>Event Title</Text>
          <Input
            value={eventTitle}
            onChangeText={setEventTitle}
            placeholder="Enter event title..."
          />
        </View>

        <Button variant="primary" onPress={() => {}}>
          Create Event
        </Button>

        <Text style={[styles.label, { marginTop: spacing.xl }]}>Upcoming Events</Text>
        {events.map((event) => (
          <Card key={event.id} variant="elevated" style={styles.eventCard}>
            <Card.Content>
              <Text style={styles.eventTitle}>{event.title}</Text>
              <Text style={styles.eventDate}>{event.date}</Text>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
    </Container>
  )
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
  },
  title: {
    ...typography.h2,
    color: colors.text,
    fontWeight: '800',
  },
  content: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
  },
  section: {
    marginBottom: spacing.lg,
  },
  label: {
    ...typography.bodyBold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  eventCard: {
    marginBottom: spacing.md,
    borderRadius: borderRadius.lg,
  },
  eventTitle: {
    ...typography.bodyBold,
    color: colors.text,
  },
  eventDate: {
    ...typography.tiny,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
})
