import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Dimensions } from 'react-native'
import { Card, Container, Button } from '@/components/ui'
import { GradientButton } from '@/components/GradientButton'
import { colors, spacing, typography, shadows, borderRadius } from '@/constants/design'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'

export default function ContactChurchScreen() {
  const contactInfo = [
    {
      id: 'phone',
      title: 'Main Phone',
      value: '+254 712 345 678',
      icon: 'call',
      action: () => Linking.openURL('tel:+254712345678'),
    },
    {
      id: 'email',
      title: 'Email',
      value: 'info@pceanyarugumu.org',
      icon: 'mail',
      action: () => Linking.openURL('mailto:info@pceanyarugumu.org'),
    },
    {
      id: 'address',
      title: 'Physical Address',
      value: 'Nyarugumu, Nyeri District, Kenya',
      icon: 'location',
      action: () => Linking.openURL('https://maps.google.com'),
    },
  ]

  const departments = [
    {
      id: 'pastor',
      name: 'Pastoral Office',
      contact: '+254 712 345 679',
      role: 'Pastoral Care',
      icon: 'person',
    },
    {
      id: 'admin',
      name: 'Church Administration',
      contact: '+254 712 345 680',
      role: 'Administrative Support',
      icon: 'briefcase',
    },
    {
      id: 'music',
      name: 'Music Ministry',
      contact: '+254 712 345 681',
      role: 'Worship & Music',
      icon: 'musical-notes',
    },
    {
      id: 'youth',
      name: 'Youth Ministry',
      contact: '+254 712 345 682',
      role: 'Young Adults (18-35)',
      icon: 'people',
    },
  ]

  const hours = [
    { day: 'Sunday', hours: '6:30 AM - 12:30 PM' },
    { day: 'Tuesday', hours: '6:30 PM - 8:30 PM' },
    { day: 'Wednesday', hours: '6:30 PM - 8:30 PM' },
    { day: 'Thursday', hours: '6:30 PM - 8:30 PM' },
    { day: 'Friday', hours: 'Closed' },
    { day: 'Saturday', hours: 'Closed' },
  ]

  return (
    <Container safeArea edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.headerSection}>
          <Text style={styles.screenTitle}>Contact Church</Text>
          <Text style={styles.screenSubtitle}>Get in touch with PCEA Nyarugumu</Text>
        </View>

        {/* Main Contact Info */}
        <View style={styles.mainContactSection}>
          {contactInfo.map((contact) => (
            <TouchableOpacity
              key={contact.id}
              style={styles.mainContactCard}
              onPress={contact.action}
              activeOpacity={0.7}
            >
              <View style={[styles.contactIcon, { backgroundColor: colors.primaryTint }]}>
                <Ionicons name={contact.icon as any} size={24} color={colors.primary} />
              </View>
              <View style={styles.contactDetails}>
                <Text style={styles.contactTitle}>{contact.title}</Text>
                <Text style={styles.contactValue}>{contact.value}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Service Hours */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Service Hours</Text>
          <Card variant="elevated" style={styles.hoursCard}>
            <Card.Content>
              {hours.map((time, index) => (
                <View key={time.day}>
                  <View style={styles.hourRow}>
                    <Text style={styles.dayText}>{time.day}</Text>
                    <Text style={styles.timeText}>{time.hours}</Text>
                  </View>
                  {index < hours.length - 1 && <View style={styles.divider} />}
                </View>
              ))}
            </Card.Content>
          </Card>
        </View>

        {/* Departments */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Departments</Text>
          {departments.map((dept) => (
            <Card key={dept.id} variant="elevated" style={styles.deptCard}>
              <Card.Content style={styles.deptContent}>
                <View style={[styles.deptIcon, { backgroundColor: colors.secondaryTint }]}>
                  <Ionicons name={dept.icon as any} size={20} color={colors.secondary} />
                </View>
                <View style={styles.deptInfo}>
                  <Text style={styles.deptName}>{dept.name}</Text>
                  <Text style={styles.deptRole}>{dept.role}</Text>
                </View>
                <TouchableOpacity
                  style={styles.deptCall}
                  onPress={() => Linking.openURL(`tel:${dept.contact}`)}
                >
                  <Ionicons name="call" size={18} color={colors.primary} />
                </TouchableOpacity>
              </Card.Content>
            </Card>
          ))}
        </View>

        {/* Map Button */}
        <View style={styles.section}>
          <Button
            variant="outline"
            onPress={() => Linking.openURL('https://maps.google.com')}
            style={styles.mapButton}
            leftIcon={<Ionicons name="map" size={20} color={colors.primary} />}
          >
            View Location on Map
          </Button>
        </View>

        {/* Feedback */}
        <View style={styles.section}>
          <GradientButton
            onPress={() => {}}
            style={styles.feedbackButton}
            leftIcon={<Ionicons name="chatbubble-outline" size={20} color={colors.white} />}
          >
            Send Feedback
          </GradientButton>
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
  screenSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  mainContactSection: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  mainContactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    ...shadows.xs,
  },
  contactIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  contactDetails: {
    flex: 1,
  },
  contactTitle: {
    ...typography.bodyBold,
    color: colors.text,
    fontSize: 15,
  },
  contactValue: {
    ...typography.tiny,
    color: colors.textSecondary,
    marginTop: spacing.xs,
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
  hoursCard: {
    borderRadius: borderRadius.lg,
  },
  hourRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  dayText: {
    ...typography.bodyBold,
    color: colors.text,
  },
  timeText: {
    ...typography.body,
    color: colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  deptCard: {
    marginBottom: spacing.md,
    borderRadius: borderRadius.lg,
  },
  deptContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  deptIcon: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deptInfo: {
    flex: 1,
  },
  deptName: {
    ...typography.bodyBold,
    color: colors.text,
    fontSize: 15,
  },
  deptRole: {
    ...typography.tiny,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  deptCall: {
    padding: spacing.sm,
  },
  mapButton: {
    borderRadius: borderRadius.lg,
  },
  feedbackButton: {
    borderRadius: borderRadius.lg,
  },
  bottomPadding: {
    height: spacing.xxl,
  },
})
