import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native'
import { Card, Container } from '@/components/ui'
import { colors, spacing, typography, shadows, borderRadius } from '@/constants/design'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'

export default function DevotionalScreen() {
  const devotion = {
    date: 'March 12, 2026',
    verse: 'John 3:16',
    text: 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.',
    title: 'The Greatest Love',
    reflection:
      'God\'s love is not merely an emotion or sentiment. It is an active, sacrificial love demonstrated through the giving of His Son. This verse encompasses the entire gospel message: God\'s love, Christ\'s sacrifice, and the offer of eternal life to all who believe.',
    prayer:
      'Dear Father, help us to truly understand the magnitude of Your love. Thank You for sending Jesus to die for our sins. Help us to live in the reality of Your forgiveness and grace, and to share Your love with others. In Jesus\' name, Amen.',
  }

  const previousDevotions = [
    { date: 'Mar 11', verse: '1 John 4:8', title: 'God is Love' },
    { date: 'Mar 10', verse: 'Romans 5:8', title: 'Christ Died for Us' },
    { date: 'Mar 9', verse: 'Psalm 23:1', title: 'The Lord is My Shepherd' },
  ]

  return (
    <Container safeArea edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.headerSection}>
          <Text style={styles.screenTitle}>Daily Devotional</Text>
          <Text style={styles.date}>{devotion.date}</Text>
        </View>

        {/* Featured Devotion */}
        <View style={styles.devotionCard}>
          <LinearGradient
            colors={[colors.primary, colors.primaryDark]}
            style={styles.devotionGradient}
          >
            <View style={styles.verseBox}>
              <Ionicons name="book" size={24} color={colors.white} />
              <Text style={styles.verse}>{devotion.verse}</Text>
            </View>
            <Text style={styles.verseText}>{devotion.text}</Text>
          </LinearGradient>

          <View style={styles.devotionContent}>
            <Text style={styles.devotionTitle}>{devotion.title}</Text>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Reflection</Text>
              <Text style={styles.sectionText}>{devotion.reflection}</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Prayer</Text>
              <Text style={styles.sectionText}>{devotion.prayer}</Text>
            </View>
          </View>
        </View>

        {/* Previous Devotions */}
        <View style={styles.previousSection}>
          <Text style={styles.sectionTitle}>Previous Devotions</Text>
          {previousDevotions.map((dev, index) => (
            <Card key={index} variant="elevated" style={styles.previousCard}>
              <Card.Content style={styles.previousContent}>
                <View>
                  <Text style={styles.previousDate}>{dev.date}</Text>
                  <Text style={styles.previousVerse}>{dev.verse}</Text>
                  <Text style={styles.previousTitle}>{dev.title}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
              </Card.Content>
            </Card>
          ))}
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
  },
  screenTitle: {
    ...typography.h2,
    color: colors.text,
    fontWeight: '800',
  },
  date: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  devotionCard: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.lg,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    ...shadows.md,
  },
  devotionGradient: {
    padding: spacing.xl,
  },
  verseBox: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  verse: {
    ...typography.h3,
    color: colors.white,
    fontWeight: '700',
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  verseText: {
    ...typography.body,
    color: colors.white,
    lineHeight: 26,
    textAlign: 'center',
  },
  devotionContent: {
    backgroundColor: colors.white,
    padding: spacing.xl,
  },
  devotionTitle: {
    ...typography.h3,
    color: colors.text,
    fontWeight: '700',
    marginBottom: spacing.lg,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.bodyBold,
    color: colors.primary,
    marginBottom: spacing.md,
    fontSize: 16,
  },
  sectionText: {
    ...typography.body,
    color: colors.text,
    lineHeight: 24,
  },
  previousSection: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.xl,
  },
  previousCard: {
    marginBottom: spacing.md,
    borderRadius: borderRadius.lg,
  },
  previousContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  previousDate: {
    ...typography.tiny,
    color: colors.textSecondary,
  },
  previousVerse: {
    ...typography.bodyBold,
    color: colors.primary,
    marginTop: spacing.xs,
  },
  previousTitle: {
    ...typography.body,
    color: colors.text,
    marginTop: spacing.xs,
  },
  bottomPadding: {
    height: spacing.xxl,
  },
})
