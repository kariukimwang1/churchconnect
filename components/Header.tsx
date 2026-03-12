import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
  StatusBar,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { colors, spacing, typography, shadows } from '@/constants/design'

interface HeaderProps {
  title?: string
  showLogo?: boolean
  onMenuPress?: () => void
  onRightPress?: () => void
  rightIcon?: string
  subtitle?: string
  backgroundColor?: string
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showLogo = true,
  onMenuPress,
  onRightPress,
  rightIcon = 'bell',
  subtitle,
  backgroundColor = colors.primary,
}) => {
  const insets = useSafeAreaInsets()
  const { width } = Dimensions.get('window')

  return (
    <View
      style={[
        styles.header,
        {
          backgroundColor,
          paddingTop: insets.top + spacing.md,
          paddingBottom: spacing.lg,
        },
      ]}
    >
      <View style={styles.headerContent}>
        {/* Left Section */}
        <View style={styles.leftSection}>
          {onMenuPress && (
            <TouchableOpacity
              onPress={onMenuPress}
              style={styles.iconButton}
              activeOpacity={0.7}
            >
              <Ionicons name="menu" size={28} color={colors.white} />
            </TouchableOpacity>
          )}
        </View>

        {/* Center Section */}
        <View style={[styles.centerSection, { maxWidth: width * 0.5 }]}>
          {showLogo && (
            <Image
              source={{
                uri: 'https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FteIspH4itOeNKs8CIDextW2acSG3%2Fpcea-seeklogo__d5ff63ed.png?alt=media&token=a25449b7-be63-49ad-93e2-16625239c1a4',
              }}
              style={styles.logo}
              resizeMode="contain"
            />
          )}
          {title && (
            <View style={styles.titleContainer}>
              <Text style={styles.title} numberOfLines={1}>
                {title}
              </Text>
              {subtitle && (
                <Text style={styles.subtitle} numberOfLines={1}>
                  {subtitle}
                </Text>
              )}
            </View>
          )}
        </View>

        {/* Right Section */}
        <View style={styles.rightSection}>
          {onRightPress && (
            <TouchableOpacity
              onPress={onRightPress}
              style={styles.iconButton}
              activeOpacity={0.7}
            >
              <Ionicons name={rightIcon as any} size={24} color={colors.white} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    ...shadows.md,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    gap: spacing.md,
  },
  leftSection: {
    flex: 0,
    minWidth: 44,
    alignItems: 'flex-start',
  },
  centerSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  logo: {
    width: 36,
    height: 36,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    ...typography.h4,
    color: colors.white,
    fontWeight: '700',
  },
  subtitle: {
    ...typography.tiny,
    color: colors.white,
    opacity: 0.9,
    marginTop: 2,
  },
  rightSection: {
    flex: 0,
    minWidth: 44,
    alignItems: 'flex-end',
  },
  iconButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
})
