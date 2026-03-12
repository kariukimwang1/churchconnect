/**
 * GradientButton Component
 *
 * A beautiful gradient button with the form styling from the CSS design
 * Features gradient from blue to cyan with impressive shadow
 */

import React from 'react'
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
  Platform,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated'
import * as Haptics from 'expo-haptics'
import { colors, spacing, typography, borderRadius } from '@/constants/design'

interface GradientButtonProps {
  children: React.ReactNode
  onPress?: () => void
  disabled?: boolean
  loading?: boolean
  style?: any
  fullWidth?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export function GradientButton({
  children,
  onPress,
  disabled = false,
  loading = false,
  style,
  fullWidth = false,
  leftIcon,
  rightIcon,
}: GradientButtonProps) {
  const scale = useSharedValue(1)

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  const handlePressIn = () => {
    scale.value = withSpring(0.97)
  }

  const handlePressOut = () => {
    scale.value = withSpring(1)
  }

  const handlePress = () => {
    if (Platform.OS !== 'web' && !disabled && !loading) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    }

    if (onPress && !disabled && !loading) {
      onPress()
    }
  }

  const isDisabled = disabled || loading

  return (
    <Animated.View style={[animatedStyle, fullWidth && styles.fullWidth]}>
      <LinearGradient
        colors={isDisabled ? [colors.primaryLight, colors.primaryLight] : ['rgb(16, 137, 211)', 'rgb(18, 177, 209)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gradientContainer, fullWidth && styles.gradientContainerFull, style]}
      >
        <TouchableOpacity
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={isDisabled}
          activeOpacity={0.95}
          style={[styles.button, fullWidth && styles.buttonFull]}
        >
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color={colors.white} size="small" />
            </View>
          )}

          {!loading && leftIcon && (
            <View style={styles.iconLeft}>
              {leftIcon}
            </View>
          )}

          <Text style={styles.buttonText} numberOfLines={1}>
            {children}
          </Text>

          {!loading && rightIcon && (
            <View style={styles.iconRight}>
              {rightIcon}
            </View>
          )}
        </TouchableOpacity>
      </LinearGradient>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  fullWidth: {
    width: '100%',
  },

  gradientContainer: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    // Beautiful shadow matching CSS design
    shadowColor: 'rgba(133, 189, 215, 0.8784313725)',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 8,
  },

  gradientContainerFull: {
    width: '100%',
  },

  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    minHeight: 52,
  },

  buttonFull: {
    width: '100%',
  },

  buttonText: {
    ...typography.bodyBold,
    color: colors.white,
    fontWeight: '700',
    textAlign: 'center',
    fontSize: 16,
  },

  loadingContainer: {
    marginRight: spacing.sm,
  },

  iconLeft: {
    marginRight: spacing.sm,
  },

  iconRight: {
    marginLeft: spacing.sm,
  },
})
