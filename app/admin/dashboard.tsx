import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native'
import { Card, Container } from '@/components/ui'
import { colors, spacing, typography, shadows, borderRadius } from '@/constants/design'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'

const { width } = Dimensions.get('window')

export default function AdminDashboardScreen() {
  const router = useRouter()

  const stats = [
    {
      label: 'Total Members',
      value: '342',
      icon: 'people',
      color: colors.primary,
      trend: '+12 this month',
    },
    {
      label: 'Attendance (Sunday)',
      value: '287',
      icon: 'checkmark-circle',
      color: colors.secondary,
      trend: '83.9% presence',
    },
    {
      label: 'Tithes & Offerings',
      value: 'KES 145K',
      icon: 'wallet',
      color: colors.success,
      trend: '+8% this month',
    },
    {
      label: 'Active Groups',
      value: '12',
      icon: 'layers',
      color: colors.accent,
      trend: '98% participation',
    },
  ]

  const quickActions = [
    { id: 'members', label: 'Member Management', icon: 'people', route: '/admin/members' },
    { id: 'send-sms', label: 'Send Notification', icon: 'send', route: '/admin/notifications' },
    { id: 'announcements', label: 'Announcements', icon: 'create', route: '/admin/announcements' },
    { id: 'payments', label: 'Payments Report', icon: 'document-text', route: '/admin/payments' },
    { id: 'events', label: 'Event Management', icon: 'calendar', route: '/admin/events' },
    { id: 'groups', label: 'Group Management', icon: 'layers', route: '/admin/groups' },
  ]

  const recentActivities = [
    { id: '1', action: 'New member registered', user: 'Sarah Kipchoge', time: '2 hours ago' },
    { id: '2', action: 'Payment received', amount: 'KES 5,000', time: '5 hours ago' },
    { id: '3', action: 'Announcement posted', title: 'Easter Celebration', time: '1 day ago' },
    { id: '4', action: 'Prayer request submitted', requestor: 'Anonymous', time: '1 day ago' },
  ]

  const handleNavigate = (route: string) => {
    router.push(route as any)
  }

  return (
    <Container safeArea edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.headerSection}>
          <View>
            <Text style={styles.greeting}>Welcome Back</Text>
            <Text style={styles.headerTitle}>Elder Dashboard</Text>
          </View>
          <View style={styles.headerIcon}>
            <Ionicons name="shield-checkmark" size={24} color={colors.secondary} />
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {stats.map((stat) => (
            <Card key={stat.label} variant="elevated" style={styles.statCard}>
              <Card.Content style={styles.statContent}>
                <View style={[styles.statIconBox, { backgroundColor: stat.color + '15' }]}>
                  <Ionicons name={stat.icon as any} size={24} color={stat.color} />
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
                <Text style={styles.statTrend}>{stat.trend}</Text>
              </Card.Content>
            </Card>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={styles.actionCard}
                onPress={() => handleNavigate(action.route)}
                activeOpacity={0.7}
              >
                <View style={styles.actionIconBox}>
                  <Ionicons name={action.icon as any} size={28} color={colors.secondary} />
                </View>
                <Text style={styles.actionLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <View style={styles.activityHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          {recentActivities.map((activity) => (
            <View key={activity.id} style={styles.activityItem}>
              <View style={styles.activityDot} />
              <View style={styles.activityContent}>
                <Text style={styles.activityAction}>{activity.action}</Text>
                <Text style={styles.activityMeta}>
                  {activity.user || activity.amount || activity.title || activity.requestor} • {activity.time}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Alerts/Notices */}
        <View style={styles.section}>
          <Card variant="elevated" style={styles.alertCard}>
            <LinearGradient
              colors={[colors.warningTint, colors.white]}
              style={styles.alertGradient}
            >
              <Card.Content style={styles.alertContent}>
                <View style={styles.alertIconBox}>
                  <Ionicons name="alert-circle" size={24} color={colors.warning} />
                </View>
                <View style={styles.alertInfo}>
                  <Text style={styles.alertTitle}>Low Attendance</Text>
                  <Text style={styles.alertMessage}>
                    Attendance last Sunday was below average. Consider follow-up.
                  </Text>
                </View>
              </Card.Content>
            </LinearGradient>
          </Card>
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
  greeting: {
    ...typography.body,
    color: colors.textSecondary,
  },
  headerTitle: {
    ...typography.h2,
    color: colors.text,
    fontWeight: '800',
    marginTop: spacing.xs,
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.secondaryTint,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsGrid: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  statCard: {
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
  },
  statContent: {
    alignItems: 'center',
  },
  statIconBox: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  statValue: {
    ...typography.h3,
    color: colors.text,
    fontWeight: '700',
  },
  statLabel: {
    ...typography.tiny,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  statTrend: {
    ...typography.tiny,
    color: colors.success,
    marginTop: spacing.xs,
    fontWeight: '600',
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
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  actionCard: {
    flex: 1,
    minWidth: '32%',
    aspectRatio: 1,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.xs,
  },
  actionIconBox: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.secondaryTint,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  actionLabel: {
    ...typography.tiny,
    color: colors.text,
    textAlign: 'center',
    fontSize: 12,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  viewAllText: {
    ...typography.captionBold,
    color: colors.primary,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
    paddingLeft: spacing.xs,
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginRight: spacing.md,
    marginTop: spacing.sm,
  },
  activityContent: {
    flex: 1,
  },
  activityAction: {
    ...typography.body,
    color: colors.text,
    fontSize: 15,
  },
  activityMeta: {
    ...typography.tiny,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  alertCard: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    padding: 0,
  },
  alertGradient: {
    padding: spacing.lg,
  },
  alertContent: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  alertIconBox: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertInfo: {
    flex: 1,
  },
  alertTitle: {
    ...typography.bodyBold,
    color: colors.warning,
  },
  alertMessage: {
    ...typography.tiny,
    color: colors.text,
    marginTop: spacing.xs,
    lineHeight: 18,
  },
  bottomPadding: {
    height: spacing.xxl,
  },
})
