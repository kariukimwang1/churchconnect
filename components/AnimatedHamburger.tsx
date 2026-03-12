import React, { useEffect } from 'react'
import {
  Animated,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native'
import { colors, spacing } from '@/constants/design'

interface AnimatedHamburgerProps {
  isOpen: boolean
  onPress: () => void
  size?: number
  color?: string
  style?: ViewStyle
}

export const AnimatedHamburger: React.FC<AnimatedHamburgerProps> = ({
  isOpen,
  onPress,
  size = 28,
  color = colors.white,
  style,
}) => {
  const topLineRotation = React.useRef(new Animated.Value(0)).current
  const centerOpacity = React.useRef(new Animated.Value(1)).current
  const bottomLineRotation = React.useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (isOpen) {
      // Animate to X shape
      Animated.parallel([
        Animated.timing(topLineRotation, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(centerOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(bottomLineRotation, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start()
    } else {
      // Animate back to hamburger shape
      Animated.parallel([
        Animated.timing(topLineRotation, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(centerOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(bottomLineRotation, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start()
    }
  }, [isOpen])

  const topLineStyle = {
    transform: [
      {
        rotate: topLineRotation.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '45deg'],
        }),
      },
      {
        translateY: topLineRotation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 8],
        }),
      },
    ],
  }

  const bottomLineStyle = {
    transform: [
      {
        rotate: bottomLineRotation.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '-45deg'],
        }),
      },
      {
        translateY: bottomLineRotation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -8],
        }),
      },
    ],
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.container, style]}
      activeOpacity={0.7}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <Animated.View
        style={[
          styles.line,
          {
            width: size,
            height: size * 0.12,
            backgroundColor: color,
          },
          topLineStyle,
        ]}
      />
      <Animated.View
        style={[
          styles.line,
          {
            width: size,
            height: size * 0.12,
            backgroundColor: color,
            opacity: centerOpacity,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.line,
          {
            width: size,
            height: size * 0.12,
            backgroundColor: color,
          },
          bottomLineStyle,
        ]}
      />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.sm,
  },
  line: {
    borderRadius: 2,
    marginVertical: 4,
  },
})
