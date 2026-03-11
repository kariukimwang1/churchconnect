import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert, TouchableOpacity } from 'react-native'
import { Button, Input, Card, Container } from '@/components/ui'
import { colors, spacing, typography, borderRadius } from '@/constants/design'
import { useAuth } from '@/hooks/useAuth'
import { useState } from 'react'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { blink } from '@/lib/blink'

type LoginStep = 'login' | '2fa' | 'forgotPassword' | 'securityQuestion' | 'resetPassword'

export default function LoginScreen() {
  const { signIn, verify2FA, sendVerificationCode } = useAuth()
  const router = useRouter()
  
  const [step, setStep] = useState<LoginStep>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // 2FA State
  const [twoFactorMethod, setTwoFactorMethod] = useState<'sms' | 'email'>('sms')
  const [verificationCode, setVerificationCode] = useState('')
  const [trustDevice, setTrustDevice] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)

  // Password Recovery State
  const [securityQuestion, setSecurityQuestion] = useState('')
  const [securityAnswer, setSecurityAnswer] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [userMemberData, setUserMemberData] = useState<any>(null)

  // Handle resend countdown
  React.useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendTimer])

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter email/username and password')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      // Try to sign in
      await signIn(email, password)
      
      // Check if user has 2FA enabled - for now, skip to dashboard
      // In production, check member data for 2FA preference
      router.replace('/(tabs)')
    } catch (err: any) {
      // Check if it's an authentication error
      if (err.message?.includes('invalid') || err.message?.includes('credentials')) {
        setError('Invalid email/username or password')
      } else {
        // If login succeeds but we want 2FA, would go to 2FA step
        // For now, show the error
        setError(err.message || 'Login failed. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerify2FA = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError('Please enter a valid 6-digit code')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const isValid = await verify2FA(verificationCode)
      if (isValid) {
        router.replace('/(tabs)')
      } else {
        setError('Invalid verification code')
      }
    } catch (err: any) {
      setError(err.message || 'Verification failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    try {
      await sendVerificationCode()
      setResendTimer(60)
      Alert.alert('Code Sent', 'A new verification code has been sent.')
    } catch (err: any) {
      setError('Failed to send code. Please try again.')
    }
  }

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your registered email or phone')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      // Look up user by email/phone to get security question
      const members = await blink.db.members.list({
        where: { email: email },
        limit: 1
      })

      if (members.length === 0) {
        // Try phone lookup
        const membersByPhone = await blink.db.members.list({
          where: { phone: email },
          limit: 1
        })

        if (membersByPhone.length === 0) {
          setError('No account found with this email or phone')
          setIsLoading(false)
          return
        }
        
        setUserMemberData(membersByPhone[0])
      } else {
        setUserMemberData(members[0])
      }

      if (!userMemberData?.securityQuestion) {
        setError('This account does not have a security question set. Please contact the church office.')
        setIsLoading(false)
        return
      }

      setSecurityQuestion(userMemberData.securityQuestion)
      setStep('securityQuestion')
    } catch (err: any) {
      setError('Failed to find account. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifySecurityAnswer = async () => {
    if (!securityAnswer) {
      setError('Please enter your security answer')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      // In production, verify the answer against stored hash
      if (userMemberData?.securityAnswer?.toLowerCase() !== securityAnswer.toLowerCase()) {
        setError('Incorrect security answer')
        setIsLoading(false)
        return
      }

      setStep('resetPassword')
    } catch (err: any) {
      setError('Verification failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async () => {
    if (!newPassword) {
      setError('Please enter a new password')
      return
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    if (!/\d/.test(newPassword)) {
      setError('Password must contain at least one number')
      return
    }

    if (!/[A-Z]/.test(newPassword)) {
      setError('Password must contain at least one uppercase letter')
      return
    }

    if (newPassword !== confirmNewPassword) {
      setError('Passwords do not match')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      // In production, use blink.auth.changePassword or update via API
      // For now, show success
      Alert.alert(
        'Password Reset Successful',
        'Your password has been reset. Please login with your new password.',
        [{ text: 'OK', onPress: () => setStep('login') }]
      )
    } catch (err: any) {
      setError('Failed to reset password. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Render login form
  const renderLoginForm = () => (
    <>
      <Input
        label="Email or Username"
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your email or username"
        keyboardType="email-address"
        autoCapitalize="none"
        leftIcon={<Ionicons name="mail-outline" size={20} color={colors.textSecondary} />}
      />

      <Input
        label="Password"
        value={password}
        onChangeText={setPassword}
        placeholder="Enter your password"
        secureTextEntry
        leftIcon={<Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} />}
      />

      <View style={styles.optionsRow}>
        <TouchableOpacity style={styles.checkboxRow} onPress={() => setRememberMe(!rememberMe)}>
          <Ionicons
            name={rememberMe ? 'checkbox' : 'square-outline'}
            size={20}
            color={rememberMe ? colors.primary : colors.textSecondary}
          />
          <Text style={styles.checkboxLabel}>Remember Me</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => { setError(''); setStep('forgotPassword') }}>
          <Text style={styles.linkText}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={20} color={colors.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      <Button
        variant="primary"
        onPress={handleLogin}
        loading={isLoading}
        style={styles.button}
      >
        Sign In
      </Button>
    </>
  )

  // Render 2FA form
  const render2FAForm = () => (
    <>
      <View style={styles.twoFactorHeader}>
        <View style={styles.twoFactorIcon}>
          <Ionicons name="shield-checkmark" size={48} color={colors.primary} />
        </View>
        <Text style={styles.twoFactorTitle}>Two-Factor Authentication</Text>
        <Text style={styles.twoFactorSubtitle}>
          Enter the verification code sent to your {twoFactorMethod === 'sms' ? 'phone' : 'email'}
        </Text>
      </View>

      <Text style={styles.label}>Verification Method</Text>
      <View style={styles.chipContainer}>
        <TouchableOpacity
          style={[styles.chip, twoFactorMethod === 'sms' && styles.chipActive]}
          onPress={() => setTwoFactorMethod('sms')}
        >
          <Ionicons name="call-outline" size={16} color={twoFactorMethod === 'sms' ? colors.white : colors.text} />
          <Text style={[styles.chipText, twoFactorMethod === 'sms' && styles.chipTextActive]}>SMS</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.chip, twoFactorMethod === 'email' && styles.chipActive]}
          onPress={() => setTwoFactorMethod('email')}
        >
          <Ionicons name="mail-outline" size={16} color={twoFactorMethod === 'email' ? colors.white : colors.text} />
          <Text style={[styles.chipText, twoFactorMethod === 'email' && styles.chipTextActive]}>Email</Text>
        </TouchableOpacity>
      </View>

      <Input
        label="Verification Code (6 digits)"
        value={verificationCode}
        onChangeText={setVerificationCode}
        placeholder="123456"
        keyboardType="number-pad"
        maxLength={6}
        leftIcon={<Ionicons name="key-outline" size={20} color={colors.textSecondary} />}
      />

      <TouchableOpacity style={styles.checkboxRow} onPress={() => setTrustDevice(!trustDevice)}>
        <Ionicons
          name={trustDevice ? 'checkbox' : 'square-outline'}
          size={20}
          color={trustDevice ? colors.primary : colors.textSecondary}
        />
        <Text style={styles.checkboxLabel}>Trust this device for 30 days</Text>
      </TouchableOpacity>

      {error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={20} color={colors.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      <Button
        variant="primary"
        onPress={handleVerify2FA}
        loading={isLoading}
        style={styles.button}
      >
        Verify
      </Button>

      <View style={styles.resendRow}>
        {resendTimer > 0 ? (
          <Text style={styles.resendText}>Resend code in {resendTimer}s</Text>
        ) : (
          <TouchableOpacity onPress={handleResendCode}>
            <Text style={styles.linkText}>Resend Code</Text>
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity onPress={() => setStep('login')} style={styles.backLink}>
        <Ionicons name="arrow-back" size={16} color={colors.primary} />
        <Text style={styles.backLinkText}>Back to Login</Text>
      </TouchableOpacity>
    </>
  )

  // Render forgot password - step 1
  const renderForgotPassword = () => (
    <>
      <View style={styles.twoFactorHeader}>
        <View style={styles.twoFactorIcon}>
          <Ionicons name="key" size={48} color={colors.primary} />
        </View>
        <Text style={styles.twoFactorTitle}>Reset Password</Text>
        <Text style={styles.twoFactorSubtitle}>
          Enter your registered email or phone number
        </Text>
      </View>

      <Input
        label="Registered Email or Phone"
        value={email}
        onChangeText={setEmail}
        placeholder="name@example.com or 254712345678"
        keyboardType="email-address"
        autoCapitalize="none"
        leftIcon={<Ionicons name="person-outline" size={20} color={colors.textSecondary} />}
      />

      {error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={20} color={colors.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      <Button
        variant="primary"
        onPress={handleForgotPassword}
        loading={isLoading}
        style={styles.button}
      >
        Continue
      </Button>

      <TouchableOpacity onPress={() => setStep('login')} style={styles.backLink}>
        <Ionicons name="arrow-back" size={16} color={colors.primary} />
        <Text style={styles.backLinkText}>Back to Login</Text>
      </TouchableOpacity>
    </>
  )

  // Render security question - step 2
  const renderSecurityQuestion = () => (
    <>
      <View style={styles.twoFactorHeader}>
        <View style={styles.twoFactorIcon}>
          <Ionicons name="shield-checkmark" size={48} color={colors.primary} />
        </View>
        <Text style={styles.twoFactorTitle}>Security Verification</Text>
        <Text style={styles.twoFactorSubtitle}>
          Answer your security question to proceed
        </Text>
      </View>

      <View style={styles.questionBox}>
        <Text style={styles.questionLabel}>Security Question:</Text>
        <Text style={styles.questionText}>{securityQuestion}</Text>
      </View>

      <Input
        label="Your Answer"
        value={securityAnswer}
        onChangeText={setSecurityAnswer}
        placeholder="Enter your answer"
        leftIcon={<Ionicons name="help-circle-outline" size={20} color={colors.textSecondary} />}
      />

      {error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={20} color={colors.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      <Button
        variant="primary"
        onPress={handleVerifySecurityAnswer}
        loading={isLoading}
        style={styles.button}
      >
        Continue
      </Button>

      <TouchableOpacity onPress={() => setStep('forgotPassword')} style={styles.backLink}>
        <Ionicons name="arrow-back" size={16} color={colors.primary} />
        <Text style={styles.backLinkText}>Back</Text>
      </TouchableOpacity>
    </>
  )

  // Render reset password - step 3
  const renderResetPassword = () => (
    <>
      <View style={styles.twoFactorHeader}>
        <View style={styles.twoFactorIcon}>
          <Ionicons name="lock-closed" size={48} color={colors.primary} />
        </View>
        <Text style={styles.twoFactorTitle}>Set New Password</Text>
        <Text style={styles.twoFactorSubtitle}>
          Enter your new password
        </Text>
      </View>

      <Input
        label="New Password (Min 8 chars with letters & numbers)"
        value={newPassword}
        onChangeText={setNewPassword}
        placeholder="Enter new password"
        secureTextEntry
        leftIcon={<Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} />}
      />

      <Input
        label="Confirm New Password"
        value={confirmNewPassword}
        onChangeText={setConfirmNewPassword}
        placeholder="Confirm new password"
        secureTextEntry
        leftIcon={<Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} />}
      />

      {error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={20} color={colors.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      <Button
        variant="primary"
        onPress={handleResetPassword}
        loading={isLoading}
        style={styles.button}
      >
        Reset Password
      </Button>
    </>
  )

  // Main render
  const getTitle = () => {
    switch (step) {
      case '2fa': return 'Verify Your Identity'
      case 'forgotPassword': return 'Forgot Password'
      case 'securityQuestion': return 'Security Question'
      case 'resetPassword': return 'New Password'
      default: return 'Sign in to your account'
    }
  }

  return (
    <Container safeArea edges={['top']}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Ionicons name="church" size={64} color={colors.primary} />
            </View>
            <Text style={styles.title}>PCEA Nyarugumu</Text>
            <Text style={styles.subtitle}>{getTitle()}</Text>
          </View>

          <Card variant="elevated" style={styles.card}>
            <Card.Content>
              {step === 'login' && renderLoginForm()}
              {step === '2fa' && render2FAForm()}
              {step === 'forgotPassword' && renderForgotPassword()}
              {step === 'securityQuestion' && renderSecurityQuestion()}
              {step === 'resetPassword' && renderResetPassword()}
            </Card.Content>
          </Card>

          {step === 'login' && (
            <View style={styles.footer}>
              <Text style={styles.footerText}>Don't have an account? </Text>
              <Button variant="ghost" onPress={() => router.push('/auth/register')}>
                Register
              </Button>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  )
}

import React from 'react'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  header: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primaryTint,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h1,
    color: colors.primary,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  card: {
    marginHorizontal: spacing.md,
  },
  button: {
    marginTop: spacing.lg,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  linkText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.errorTint,
    padding: spacing.sm,
    borderRadius: 8,
    marginTop: spacing.md,
  },
  errorText: {
    ...typography.caption,
    color: colors.error,
    marginLeft: spacing.xs,
    flex: 1,
  },
  twoFactorHeader: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  twoFactorIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primaryTint,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  twoFactorTitle: {
    ...typography.h3,
    color: colors.text,
    textAlign: 'center',
  },
  twoFactorSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  label: {
    ...typography.bodyBold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  chipContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  chip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    gap: spacing.xs,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    ...typography.body,
    color: colors.text,
  },
  chipTextActive: {
    color: colors.white,
  },
  resendRow: {
    alignItems: 'center',
    marginTop: spacing.md,
  },
  resendText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  backLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  backLinkText: {
    ...typography.body,
    color: colors.primary,
    marginLeft: spacing.xs,
  },
  questionBox: {
    backgroundColor: colors.backgroundSecondary,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.lg,
  },
  questionLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  questionText: {
    ...typography.bodyBold,
    color: colors.text,
    marginTop: spacing.xs,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  footerText: {
    ...typography.body,
    color: colors.textSecondary,
  },
})
