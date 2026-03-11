import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native'
import { Card, Container, Button } from '@/components/ui'
import { colors, spacing, typography, shadows, borderRadius } from '@/constants/design'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'

const { width } = Dimensions.get('window')
const COLUMN_WIDTH = (width - spacing.md * 3) / 2

export default function HomeScreen() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  const quickActions = [
    {
      id: 'hymns',
      title: 'Hymns',
      subtitle: 'Golden Bells & Kikuyu',
      icon: 'musical-notes',
      color: colors.primary,
      route: '/hymns',
    },
    {
      id: 'bible',
      title: 'Bible',
      subtitle: 'Kikuyu, Swahili, English',
      icon: 'book',
      color: colors.secondary,
      route: '/bible',
    },
    {
      id: 'sermons',
      title: 'Sermons',
      subtitle: 'Watch Live',
      icon: 'play-circle',
      color: colors.secondary,
      route: '/sermons',
    },
    {
      id: 'events',
      title: 'Events',
      subtitle: 'Upcoming Activities',
      icon: 'calendar',
      color: colors.primary,
      route: '/events',
    },
    {
      id: 'chat',
      title: 'Chat',
      subtitle: 'Community',
      icon: 'chatbubbles',
      color: colors.accent,
      route: '/chat',
    },
    {
      id: 'notes',
      title: 'Notes',
      subtitle: 'Sermon Notes',
      icon: 'document-text',
      color: colors.primary,
      route: '/notes',
    },
    {
      id: 'payments',
      title: 'Give',
      subtitle: 'Tithes & Offerings',
      icon: 'wallet',
      color: colors.secondary,
      route: '/payments',
    },
    {
      id: 'announcements',
      title: 'News',
      subtitle: 'Announcements',
      icon: 'newspaper',
      color: colors.textSecondary,
      route: '/announcements',
    },
  ]

  return (
    <Container safeArea edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Hero Section */}
        <View style={styles.heroContainer}>
          <LinearGradient
            colors={[colors.primary, colors.primaryDark]}
            style={styles.heroGradient}
          >
            <View style={styles.heroContent}>
              <View style={styles.logoBadge}>
                <Image
                  source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FteIspH4itOeNKs8CIDextW2acSG3%2Fpcea-seeklogo__d5ff63ed.png?alt=media&token=a25449b7-be63-49ad-93e2-16625239c1a4' }}
                  style={styles.heroLogo}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.heroTextContainer}>
                <Text style={styles.welcomeText}>Welcome to</Text>
                <Text style={styles.churchName}>PCEA Nyarugumu</Text>
                <Text style={styles.heroSubtext}>
                  "Faith, Love, Hope"
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Quick Actions Grid */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quick Access</Text>
            <Ionicons name="apps-outline" size={20} color={colors.textSecondary} />
          </View>
          <View style={styles.grid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={styles.actionCard}
                onPress={() => router.push(action.route as any)}
                activeOpacity={0.7}
              >
                <View style={[styles.iconContainer, { backgroundColor: action.color + '15' }]}>
                  <Ionicons name={action.icon as any} size={26} color={action.color} />
                </View>
                <View style={styles.actionTextContent}>
                  <Text style={styles.actionTitle}>{action.title}</Text>
                  <Text style={styles.actionSubtitle} numberOfLines={1}>{action.subtitle}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Member Status Card */}
        <View style={styles.section}>
          {isAuthenticated ? (
            <Card variant="elevated" style={styles.memberCard}>
              <Card.Content>
                <View style={styles.memberHeader}>
                  <View style={styles.memberAvatar}>
                    <Ionicons name="person" size={32} color={colors.white} />
                  </View>
                  <View style={styles.memberInfo}>
                    <Text style={styles.memberName}>{user?.displayName || 'Church Member'}</Text>
                    <Text style={styles.memberRole}>{user?.role?.toUpperCase() || 'MEMBER'}</Text>
                    {user?.district && (
                      <View style={styles.districtBadge}>
                        <Ionicons name="location" size={12} color={colors.primary} />
                        <Text style={styles.districtText}>{user.district}</Text>
                      </View>
                    )}
                  </View>
                  <TouchableOpacity 
                    style={styles.profileArrow}
                    onPress={() => router.push('/profile')}
                  >
                    <Ionicons name="chevron-forward" size={24} color={colors.textTertiary} />
                  </TouchableOpacity>
                </View>
              </Card.Content>
            </Card>
          ) : (
            <Card variant="elevated" style={styles.guestCard}>
              <LinearGradient
                colors={[colors.secondaryTint, colors.white]}
                style={styles.guestGradient}
              >
                <Card.Content style={styles.guestContent}>
                  <View style={styles.guestIconContainer}>
                    <Ionicons name="heart" size={32} color={colors.secondary} />
                  </View>
                  <Text style={styles.guestTitle}>Join Our Family</Text>
                  <Text style={styles.guestSubtitle}>
                    Register to access church resources, give tithes, and join ministries.
                  </Text>
                  <Button
                    variant="primary"
                    onPress={() => router.push('/auth/register')}
                    style={styles.registerButton}
                  >
                    Create Account
                  </Button>
                </Card.Content>
              </LinearGradient>
            </Card>
          )}
        </View>

        {/* Elder Dashboard Access */}
        {isAuthenticated && user?.role === 'elder' && (
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.elderButton}
              onPress={() => router.push('/elders')}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[colors.secondary, colors.secondaryDark]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.elderGradient}
              >
                <View style={styles.elderButtonContent}>
                  <View style={styles.elderIconBox}>
                    <Ionicons name="people" size={24} color={colors.white} />
                  </View>
                  <View>
                    <Text style={styles.elderButtonText}>Elder Dashboard</Text>
                    <Text style={styles.elderButtonSubtext}>Management Tools</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={24} color={colors.white} />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        {/* Weekly Highlights */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Weekly Highlights</Text>
            <TouchableOpacity onPress={() => router.push('/events')}>
              <Text style={styles.viewAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <Card variant="elevated" style={styles.eventsCard}>
            <Card.Content>
              <View style={styles.highlightItem}>
                <View style={[styles.highlightIcon, { backgroundColor: colors.primaryTint }]}>
                  <Ionicons name="calendar" size={20} color={colors.primary} />
                </View>
                <View style={styles.highlightInfo}>
                  <Text style={styles.highlightTitle}>Sunday Service</Text>
                  <Text style={styles.highlightTime}>Sun, 9:00 AM - 12:30 PM</Text>
                </View>
                <View style={styles.liveBadge}>
                  <Text style={styles.liveText}>MAIN</Text>
                </View>
              </View>
              <View style={styles.divider} />
              <View style={styles.highlightItem}>
                <View style={[styles.highlightIcon, { backgroundColor: colors.secondaryTint }]}>
                  <Ionicons name="flame" size={20} color={colors.secondary} />
                </View>
                <View style={styles.highlightInfo}>
                  <Text style={styles.highlightTitle}>Mid-Week Prayer</Text>
                  <Text style={styles.highlightTime}>Wed, 5:30 PM - 7:00 PM</Text>
                </View>
              </View>
            </Card.Content>
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
  heroContainer: {
    height: 220,
    marginBottom: spacing.lg,
  },
  heroGradient: {
    flex: 1,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  heroContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.white,
    padding: spacing.sm,
    ...shadows.md,
  },
  heroLogo: {
    width: '100%',
    height: '100%',
  },
  heroTextContainer: {
    marginLeft: spacing.lg,
    flex: 1,
  },
  welcomeText: {
    ...typography.body,
    color: colors.white,
    opacity: 0.9,
  },
  churchName: {
    ...typography.h2,
    color: colors.white,
    fontWeight: '800',
  },
  heroSubtext: {
    ...typography.captionBold,
    color: colors.accent,
    marginTop: spacing.xs,
    letterSpacing: 1,
  },
  section: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingHorizontal: spacing.xs,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    fontWeight: '700',
  },
  viewAllText: {
    ...typography.captionBold,
    color: colors.primary,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: COLUMN_WIDTH,
    backgroundColor: colors.background,
    borderRadius: 20,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.sm,
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  actionTextContent: {
    width: '100%',
  },
  actionTitle: {
    ...typography.bodyBold,
    color: colors.text,
    fontSize: 15,
  },
  actionSubtitle: {
    ...typography.tiny,
    color: colors.textSecondary,
    marginTop: 2,
  },
  memberCard: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  memberHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    ...typography.bodyBold,
    color: colors.text,
    fontSize: 17,
  },
  memberRole: {
    ...typography.tiny,
    color: colors.primary,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  districtBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryTint,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: spacing.xs,
  },
  districtText: {
    ...typography.tiny,
    color: colors.primary,
    fontWeight: '600',
    marginLeft: 4,
  },
  profileArrow: {
    padding: spacing.xs,
  },
  guestCard: {
    borderRadius: 24,
    overflow: 'hidden',
    padding: 0,
  },
  guestGradient: {
    padding: spacing.xl,
  },
  guestContent: {
    alignItems: 'center',
  },
  guestIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.sm,
    marginBottom: spacing.md,
  },
  guestTitle: {
    ...typography.h3,
    color: colors.text,
    fontWeight: '700',
    textAlign: 'center',
  },
  guestSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  registerButton: {
    width: '100%',
    borderRadius: 14,
  },
  elderButton: {
    borderRadius: 20,
    overflow: 'hidden',
    ...shadows.md,
  },
  elderGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
  },
  elderButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  elderIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  elderButtonText: {
    ...typography.bodyBold,
    color: colors.white,
    fontSize: 18,
  },
  elderButtonSubtext: {
    ...typography.tiny,
    color: colors.white,
    opacity: 0.8,
  },
  eventsCard: {
    borderRadius: 20,
  },
  highlightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  highlightIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  highlightInfo: {
    flex: 1,
  },
  highlightTitle: {
    ...typography.bodyBold,
    color: colors.text,
  },
  highlightTime: {
    ...typography.tiny,
    color: colors.textSecondary,
    marginTop: 2,
  },
  liveBadge: {
    backgroundColor: colors.successTint,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 6,
  },
  liveText: {
    ...typography.tiny,
    color: colors.success,
    fontWeight: '800',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    width: '100%',
  },
  bottomPadding: {
    height: 100,
  },
})
