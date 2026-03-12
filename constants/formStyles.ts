import { StyleSheet, Dimensions } from 'react-native'
import { colors, spacing, typography, borderRadius } from './design'

const { width } = Dimensions.get('window')

export const formStyles = StyleSheet.create({
  // Container - from CSS .container
  container: {
    maxWidth: 350,
    backgroundColor: colors.white,
    borderRadius: borderRadius.xxl,
    padding: spacing.lg,
    borderWidth: 2,
    borderColor: colors.white,
    shadowColor: 'rgba(133, 189, 215, 0.8784313725)',
    shadowOffset: { width: 0, height: 30 },
    shadowOpacity: 1,
    shadowRadius: 30,
    elevation: 10,
    marginVertical: spacing.md,
    alignSelf: 'center',
  },

  // Heading - from CSS .heading
  heading: {
    textAlign: 'center',
    fontWeight: '900',
    fontSize: 30,
    color: colors.primary,
    marginBottom: spacing.lg,
  },

  // Form wrapper
  form: {
    marginTop: spacing.md,
  },

  // Input field - from CSS .input
  input: {
    width: '100%',
    backgroundColor: colors.white,
    borderWidth: 0,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.xl,
    marginTop: spacing.md,
    shadowColor: '#cff0ff',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 3,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },

  inputFocused: {
    borderLeftColor: '#12B1D1',
    borderRightColor: '#12B1D1',
  },

  inputPlaceholder: {
    color: 'rgb(170, 170, 170)',
  },

  // Forgot password link - from CSS .forgot-password
  forgotPasswordContainer: {
    display: 'flex',
    marginTop: spacing.sm,
    marginLeft: spacing.sm,
  },

  forgotPasswordLink: {
    fontSize: 11,
    color: '#0099ff',
    textDecorationLine: 'none',
  },

  // Login button - from CSS .login-button
  button: {
    width: '100%',
    fontWeight: 'bold',
    backgroundLinearGradient: ['rgb(16, 137, 211)', 'rgb(18, 177, 209)'],
    color: colors.white,
    paddingVertical: spacing.md,
    marginVertical: spacing.lg,
    marginHorizontal: 'auto',
    borderRadius: borderRadius.xl,
    shadowColor: 'rgba(133, 189, 215, 0.8784313725)',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 1,
    shadowRadius: 10,
    borderWidth: 0,
    overflow: 'hidden',
  },

  buttonText: {
    fontWeight: '700',
    color: colors.white,
    fontSize: 16,
    textAlign: 'center',
  },

  // Social account container - from CSS .social-account-container
  socialAccountContainer: {
    marginTop: spacing.lg,
  },

  socialTitle: {
    display: 'flex',
    textAlign: 'center',
    fontSize: 10,
    color: 'rgb(170, 170, 170)',
  },

  // Social accounts - from CSS .social-accounts
  socialAccounts: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.md,
    marginTop: spacing.xs,
  },

  // Social button - from CSS .social-button
  socialButton: {
    backgroundLinearGradient: ['rgb(0, 0, 0)', 'rgb(112, 112, 112)'],
    borderWidth: 3,
    borderColor: colors.white,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.xs,
    borderRadius: 50,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'rgba(133, 189, 215, 0.8784313725)',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 5,
  },

  socialButtonIcon: {
    color: colors.white,
  },

  // Agreement - from CSS .agreement
  agreement: {
    display: 'flex',
    textAlign: 'center',
    marginTop: spacing.md,
  },

  agreementLink: {
    textDecorationLine: 'none',
    color: '#0099ff',
    fontSize: 9,
  },

  // Form input wrapper
  inputWrapper: {
    marginBottom: spacing.md,
  },

  // Input label
  label: {
    ...typography.bodyBold,
    color: colors.text,
    marginBottom: spacing.sm,
    marginLeft: spacing.sm,
  },

  // Input with icon
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    marginTop: spacing.md,
    shadowColor: '#cff0ff',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 3,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    paddingHorizontal: spacing.md,
  },

  inputWithIconFocused: {
    borderLeftColor: '#12B1D1',
    borderRightColor: '#12B1D1',
  },

  inputIcon: {
    marginRight: spacing.md,
  },

  inputField: {
    flex: 1,
    paddingVertical: spacing.md,
    ...typography.body,
    color: colors.text,
  },

  // Card container with form
  formCard: {
    maxWidth: 350,
    backgroundColor: colors.white,
    borderRadius: borderRadius.xxl,
    padding: spacing.lg,
    borderWidth: 2,
    borderColor: colors.white,
    shadowColor: 'rgba(133, 189, 215, 0.8784313725)',
    shadowOffset: { width: 0, height: 30 },
    shadowOpacity: 1,
    shadowRadius: 30,
    elevation: 10,
    marginVertical: spacing.md,
    alignSelf: 'center',
  },

  // Gradient button base (use LinearGradient component)
  gradientButton: {
    width: '100%',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: spacing.lg,
    shadowColor: 'rgba(133, 189, 215, 0.8784313725)',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 8,
  },

  gradientButtonText: {
    fontWeight: '700',
    color: colors.white,
    fontSize: 16,
  },
})
