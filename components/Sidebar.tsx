import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated,
  Image,
  Switch,
  useColorScheme,
  Modal,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { colors, spacing, typography, shadows, borderRadius } from '@/constants/design'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'expo-router'

const { width } = Dimensions.get('window')
const SIDEBAR_WIDTH = Math.min(width * 0.85, 320)

interface MenuItem {
  id: string
  label: string
  icon: string
  route: string
  badge?: string
  divider?: boolean
}

interface SidebarProps {
  visible: boolean
  onClose: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({ visible, onClose }) => {
  const insets = useSafeAreaInsets()
  const { user, isAuthenticated, logout } = useAuth()
  const router = useRouter()
  const colorScheme = useColorScheme()
  const [isDarkMode, setIsDarkMode] = useState(colorScheme === 'dark')
  const slideAnim = React.useRef(new Animated.Value(-SIDEBAR_WIDTH)).current
  const overlayAnim = React.useRef(new Animated.Value(0)).current

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(overlayAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start()
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -SIDEBAR_WIDTH,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(overlayAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start()
    }
  }, [visible])

  const handleNavigation = (route: string) => {
    onClose()
    router.push(route as any)
  }

  const mainMenuItems: MenuItem[] = [
    { id: 'home', label: 'Home', icon: 'home', route: '/(tabs)' },
    { id: 'hymns', label: 'Hymns', icon: 'musical-notes', route: '/(tabs)/hymns' },
    { id: 'bible', label: 'Bible', icon: 'book', route: '/(tabs)/bible' },
    { id: 'give', label: 'Giving', icon: 'wallet', route: '/(tabs)/profile' },
    { id: 'announcements', label: 'Announcements', icon: 'megaphone', route: '/(tabs)/announcements' },
    { id: 'events', label: 'Events Calendar', icon: 'calendar', route: '/(tabs)/events' },
    { id: 'prayer', label: 'Prayer Requests', icon: 'heart', route: '/prayer-requests' },
    { id: 'directory', label: 'Member Directory', icon: 'people', route: '/member-directory' },
    { id: 'devotional', label: 'Daily Devotional', icon: 'star', route: '/devotional' },
    { id: 'sermons', label: 'Sermons', icon: 'play-circle', route: '/(tabs)/sermons' },
    { id: 'calendar', label: 'Church Calendar', icon: 'bookmark', route: '/church-calendar' },
    { id: 'contact', label: 'Contact Church', icon: 'call', route: '/contact' },
    { id: 'report', label: 'Report an Issue', icon: 'bug', route: '/report-issue' },
  ]

  const adminMenuItems: MenuItem[] = [
    { id: 'admin-dashboard', label: 'Dashboard', icon: 'stats-chart', route: '/admin/dashboard', badge: 'ADMIN' },
    { id: 'member-mgmt', label: 'Member Management', icon: 'people', route: '/admin/members' },
    { id: 'send-sms', label: 'Send Notification', icon: 'send', route: '/admin/notifications' },
    { id: 'announcements-admin', label: 'Announcements', icon: 'create', route: '/admin/announcements' },
    { id: 'payments-report', label: 'Payments Report', icon: 'document-text', route: '/admin/payments' },
    { id: 'events-admin', label: 'Event Management', icon: 'calendar', route: '/admin/events' },
    { id: 'groups-admin', label: 'Group Management', icon: 'layers', route: '/admin/groups' },
    { id: 'export-data', label: 'Export Data', icon: 'download', route: '/admin/export' },
  ]

  const accountMenuItems: MenuItem[] = [
    { id: 'profile', label: 'My Profile', icon: 'person', route: '/(tabs)/profile', divider: true },
    { id: 'settings', label: 'Settings', icon: 'settings', route: '/(tabs)/profile' },
  ]

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      {/* Overlay */}
      <Animated.View
        style={[
          styles.overlay,
          {
            opacity: overlayAnim,
            pointerEvents: visible ? 'auto' : 'none',
          },
        ]}
      >
        <TouchableOpacity style={styles.overlayTouchable} onPress={onClose} activeOpacity={0} />
      </Animated.View>

      {/* Sidebar */}
      <Animated.View
        style={[
          styles.sidebarContainer,
          {
            transform: [{ translateX: slideAnim }],
            marginTop: insets.top,
            paddingBottom: insets.bottom,
            maxHeight: Dimensions.get('window').height - insets.top - insets.bottom,
          },
        ]}
      >
        {/* Header */}
        <View style={styles.sidebarHeader}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={28} color={colors.text} />
          </TouchableOpacity>
          <Image
            source={{
              uri: 'https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FteIspH4itOeNKs8CIDextW2acSG3%2Fpcea-seeklogo__d5ff63ed.png?alt=media&token=a25449b7-be63-49ad-93e2-16625239c1a4',
            }}
            style={styles.sidebarLogo}
            resizeMode="contain"
          />
          <Text style={styles.sidebarTitle}>PCEA</Text>
        </View>

        <ScrollView
          scrollEnabled
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* User Profile Section */}
          {isAuthenticated && (
            <View style={styles.userSection}>
              <View style={styles.userAvatar}>
                <Ionicons name="person" size={32} color={colors.white} />
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.userName} numberOfLines={1}>
                  {user?.displayName || 'Member'}
                </Text>
                <Text style={styles.userRole}>{user?.role?.toUpperCase() || 'MEMBER'}</Text>
              </View>
            </View>
          )}

          {/* Main Menu */}
          <View style={styles.menuSection}>
            <Text style={styles.menuSectionTitle}>MENU</Text>
            {mainMenuItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.menuItem}
                onPress={() => handleNavigation(item.route)}
                activeOpacity={0.6}
              >
                <View style={styles.menuItemContent}>
                  <View style={styles.menuItemIcon}>
                    <Ionicons name={item.icon as any} size={22} color={colors.primary} />
                  </View>
                  <Text style={styles.menuItemLabel}>{item.label}</Text>
                </View>
                {item.badge && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{item.badge}</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Admin Menu - Only show for elders */}
          {isAuthenticated && user?.role === 'elder' && (
            <View style={styles.menuSection}>
              <Text style={styles.menuSectionTitle}>ADMIN PANEL</Text>
              {adminMenuItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.menuItem}
                  onPress={() => handleNavigation(item.route)}
                  activeOpacity={0.6}
                >
                  <View style={styles.menuItemContent}>
                    <View style={[styles.menuItemIcon, { backgroundColor: colors.secondaryTint }]}>
                      <Ionicons name={item.icon as any} size={22} color={colors.secondary} />
                    </View>
                    <Text style={styles.menuItemLabel}>{item.label}</Text>
                  </View>
                  {item.badge && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{item.badge}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Account Menu */}
          <View style={styles.menuSection}>
            <Text style={styles.menuSectionTitle}>ACCOUNT</Text>
            {accountMenuItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.menuItem, item.divider && styles.menuItemDivider]}
                onPress={() => handleNavigation(item.route)}
                activeOpacity={0.6}
              >
                <View style={styles.menuItemContent}>
                  <View style={styles.menuItemIcon}>
                    <Ionicons name={item.icon as any} size={22} color={colors.primary} />
                  </View>
                  <Text style={styles.menuItemLabel}>{item.label}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Dark Mode Toggle */}
          <View style={styles.themeSection}>
            <View style={styles.themeToggleContent}>
              <Ionicons name="moon" size={20} color={colors.primary} />
              <Text style={styles.themeLabel}>Dark Mode</Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={setIsDarkMode}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>
        </ScrollView>

        {/* Footer */}
        {isAuthenticated && (
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => {
              onClose()
              logout()
            }}
            activeOpacity={0.7}
          >
            <Ionicons name="log-out" size={20} color={colors.error} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        )}

        {!isAuthenticated && (
          <View style={styles.authButtonsContainer}>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => handleNavigation('/auth/login')}
              activeOpacity={0.7}
            >
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.registerButton}
              onPress={() => handleNavigation('/auth/register')}
              activeOpacity={0.7}
            >
              <Text style={styles.registerButtonText}>Register</Text>
            </TouchableOpacity>
          </View>
        )}
      </Animated.View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlay,
    zIndex: 99,
  },
  overlayTouchable: {
    flex: 1,
  },
  sidebarContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: SIDEBAR_WIDTH,
    height: '100%',
    backgroundColor: colors.background,
    zIndex: 100,
    ...shadows.xl,
    flexDirection: 'column',
  },
  sidebarHeader: {
    backgroundColor: colors.primaryTint,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -spacing.sm,
  },
  sidebarLogo: {
    width: 32,
    height: 32,
  },
  sidebarTitle: {
    ...typography.h3,
    color: colors.primary,
    fontWeight: '700',
    flex: 1,
  },
  scrollContent: {
    flex: 1,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryTint,
    marginHorizontal: spacing.md,
    marginVertical: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    gap: spacing.md,
  },
  userAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    ...typography.bodyBold,
    color: colors.text,
    fontSize: 15,
  },
  userRole: {
    ...typography.tiny,
    color: colors.primary,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  menuSection: {
    marginVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  menuSectionTitle: {
    ...typography.tiny,
    color: colors.textTertiary,
    fontWeight: '700',
    letterSpacing: 1,
    marginLeft: spacing.md,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    marginHorizontal: spacing.xs,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.background,
  },
  menuItemDivider: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: spacing.sm,
    paddingTop: spacing.lg,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: spacing.md,
  },
  menuItemIcon: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primaryTint,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItemLabel: {
    ...typography.body,
    color: colors.text,
    fontWeight: '500',
    flex: 1,
  },
  badge: {
    backgroundColor: colors.secondary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  badgeText: {
    ...typography.tiny,
    color: colors.white,
    fontWeight: '700',
  },
  themeSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginHorizontal: spacing.xs,
    marginVertical: spacing.lg,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.backgroundSecondary,
  },
  themeToggleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  themeLabel: {
    ...typography.body,
    color: colors.text,
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: spacing.md,
    marginVertical: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.errorTint,
    gap: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.lg,
    marginTop: 'auto',
  },
  logoutText: {
    ...typography.bodyBold,
    color: colors.error,
    fontSize: 15,
  },
  authButtonsContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
    gap: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: 'auto',
  },
  loginButton: {
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  loginButtonText: {
    ...typography.bodyBold,
    color: colors.primary,
    fontSize: 15,
  },
  registerButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  registerButtonText: {
    ...typography.bodyBold,
    color: colors.white,
    fontSize: 15,
  },
})
