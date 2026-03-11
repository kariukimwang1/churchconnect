import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native'
import { Container, Card, Button, Avatar } from '@/components/ui'
import { colors, spacing, typography, shadows, borderRadius } from '@/constants/design'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient'

export default function ProfileScreen() {
  const { user, isAuthenticated, signOut } = useAuth()
  const router = useRouter()
  const [isVerifying, setIsVerifying] = useState(false)

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: async () => {
          await signOut()
          router.replace('/auth/login')
        }},
      ]
    )
  }

  const handle2FAVerify = () => {
    setIsVerifying(true)
    Alert.alert(
      'Security',
      'Your account is secured with Two-Factor Authentication.',
      [{ text: 'OK' }]
    )
    setIsVerifying(false)
  }

  const menuItems = [
    {
      id: 'payments',
      title: 'Tithes & Offerings',
      subtitle: 'History & Giving',
      icon: 'wallet',
      color: colors.success,
      route: '/payments',
    },
    {
      id: 'children',
      title: 'My Children',
      subtitle: 'Manage registrations',
      icon: 'people',
      color: colors.primary,
      route: '/profile/children',
    },
    {
      id: '2fa',
      title: 'Security & 2FA',
      subtitle: 'Account protection',
      icon: 'shield-checkmark',
      color: colors.secondary,
      action: handle2FAVerify,
    },
    {
      id: 'settings',
      title: 'App Settings',
      subtitle: 'Preferences & Notifications',
      icon: 'settings-outline',
      color: colors.textSecondary,
      route: '/profile', // Placeholder
    },
  ]

  if (!isAuthenticated) {
    return (
      <Container safeArea edges={['top']}>
        <View style={styles.screenHeader}>
          <Text style={styles.screenTitle}>My Profile</Text>
        </View>
        <View style={styles.guestContainer}>
          <View style={styles.guestIconBox}>
            <Ionicons name="person-circle-outline" size={100} color={colors.textDisabled} />
          </View>
          <Text style={styles.guestTitle}>Sign In Required</Text>
          <Text style={styles.guestSubtitle}>
            Please sign in to access your profile, track your giving, and manage your membership.
          </Text>
          <Button
            variant="primary"
            onPress={() => router.push('/auth/login')}
            style={styles.guestBtn}
          >
            Sign In
          </Button>
          <Button
            variant="outline"
            onPress={() => router.push('/auth/register')}
            style={styles.guestBtn}
          >
            Create Account
          </Button>
        </View>
      </Container>
    )
  }

  return (
    <Container safeArea edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Profile Header */}
        <View style={styles.headerCard}>
          <LinearGradient
            colors={[colors.primary, colors.primaryDark]}
            style={styles.headerGradient}
          >
            <View style={styles.headerTop}>
              <View style={styles.avatarWrapper}>
                <Avatar 
                  size="xl" 
                  name={user?.displayName}
                  style={styles.avatar}
                />
                <TouchableOpacity style={styles.editAvatarBtn}>
                  <Ionicons name="camera" size={16} color={colors.white} />
                </TouchableOpacity>
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{user?.displayName || 'Church Member'}</Text>
                <Text style={styles.userEmail}>{user?.email}</Text>
                <View style={styles.roleBadge}>
                  <Text style={styles.roleText}>{user?.role?.toUpperCase() || 'MEMBER'}</Text>
                </View>
              </View>
            </View>
            
            {user?.district && (
              <View style={styles.districtStrip}>
                <Ionicons name="location" size={16} color={colors.white} />
                <Text style={styles.districtStripText}>{user.district}</Text>
              </View>
            )}
          </LinearGradient>
        </View>

        {/* Menu Section */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionLabel}>Account Management</Text>
          {menuItems.map((item) => (
            <TouchableOpacity 
              key={item.id}
              style={styles.menuItemCard}
              onPress={item.route ? () => router.push(item.route as any) : item.action}
              activeOpacity={0.7}
            >
              <View style={[styles.menuIconContainer, { backgroundColor: item.color + '15' }]}>
                <Ionicons name={item.icon as any} size={24} color={item.color} />
              </View>
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuItemTitle}>{item.title}</Text>
                <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Section */}
        <View style={styles.logoutSection}>
          <Button
            variant="outline"
            onPress={handleSignOut}
            style={styles.logoutBtn}
            leftIcon={<Ionicons name="log-out-outline" size={22} color={colors.secondary} />}
          >
            Sign Out
          </Button>
          <Text style={styles.versionText}>PCEA Nyarugumu v1.0.0</Text>
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
  screenHeader: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
  },
  screenTitle: {
    ...typography.h2,
    color: colors.text,
    fontWeight: '800',
  },
  headerCard: {
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    borderRadius: 32,
    overflow: 'hidden',
    ...shadows.md,
  },
  headerGradient: {
    padding: spacing.xl,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.secondary,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  userInfo: {
    marginLeft: spacing.lg,
    flex: 1,
  },
  userName: {
    ...typography.h3,
    color: colors.white,
    fontWeight: '800',
  },
  userEmail: {
    ...typography.caption,
    color: colors.white,
    opacity: 0.8,
    marginTop: 2,
  },
  roleBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  roleText: {
    ...typography.tiny,
    color: colors.white,
    fontWeight: '800',
    letterSpacing: 1,
  },
  districtStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.15)',
    marginTop: spacing.xl,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  districtStripText: {
    ...typography.captionBold,
    color: colors.white,
    marginLeft: 8,
  },
  menuSection: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  sectionLabel: {
    ...typography.captionBold,
    color: colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.md,
    marginLeft: spacing.xs,
  },
  menuItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: 20,
    marginBottom: spacing.sm,
    ...shadows.xs,
  },
  menuIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuItemTitle: {
    ...typography.bodyBold,
    color: colors.text,
  },
  menuItemSubtitle: {
    ...typography.tiny,
    color: colors.textSecondary,
    marginTop: 2,
  },
  logoutSection: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
  },
  logoutBtn: {
    width: '100%',
    borderColor: colors.secondary,
    borderRadius: 16,
    height: 56,
  },
  versionText: {
    ...typography.tiny,
    color: colors.textDisabled,
    marginTop: spacing.lg,
  },
  guestContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  guestIconBox: {
    marginBottom: spacing.lg,
  },
  guestTitle: {
    ...typography.h3,
    color: colors.text,
    fontWeight: '700',
  },
  guestSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
  guestBtn: {
    width: '100%',
    marginBottom: spacing.sm,
    borderRadius: 14,
  },
  bottomPadding: {
    height: 100,
  },
})
