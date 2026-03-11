import { View, Text, StyleSheet, ScrollView, Alert, Switch } from 'react-native'
import { Container, Card, Button, Input } from '@/components/ui'
import { colors, spacing, typography, shadows } from '@/constants/design'
import { useState } from 'react'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { blink } from '@/lib/blink'
import { useAuth } from '@/hooks/useAuth'

const PAYMENT_TYPES = [
  { id: 'tithe', name: 'Tithe', icon: 'wallet' },
  { id: 'offering', name: 'Offering', icon: 'heart' },
  { id: 'building', name: 'Building Fund', icon: 'business' },
  { id: 'thanksgiving', name: 'Thanksgiving', icon: 'happy' },
]

export default function PaymentsScreen() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  
  const [amount, setAmount] = useState('')
  const [paymentType, setPaymentType] = useState('tithe')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [description, setDescription] = useState('')
  const [useMpesa, setUseMpesa] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handlePayment = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount')
      return
    }

    if (useMpesa && !phoneNumber) {
      Alert.alert('Error', 'Please enter your phone number for M-Pesa')
      return
    }

    if (!isAuthenticated) {
      Alert.alert('Login Required', 'Please sign in to make payments')
      router.push('/auth/login')
      return
    }

    setIsLoading(true)

    try {
      if (useMpesa) {
        // Simulate STK Push - in production, this would call M-Pesa API
        Alert.alert(
          'STK Push Initiated',
          `A payment prompt has been sent to ${phoneNumber}. Please complete the payment on your phone.`,
          [{ text: 'OK' }]
        )
      }

      // Record payment in database
      await blink.db.payments.create({
        userId: user?.id || '',
        type: paymentType,
        amount: parseFloat(amount),
        phoneNumber: phoneNumber || null,
        status: useMpesa ? 'pending' : 'completed',
        mpesaReceipt: useMpesa ? 'STK_PUSH_' + Date.now() : null,
        paymentMethod: useMpesa ? 'stk_push' : 'manual',
        description: description || null,
      })

      Alert.alert(
        'Success',
        useMpesa 
          ? 'Payment initiated. Complete it on your phone.'
          : 'Payment recorded successfully. Thank you for your generosity!',
        [{ text: 'OK', onPress: () => {
          setAmount('')
          setDescription('')
        }}]
      )
    } catch (error) {
      Alert.alert('Error', 'Payment failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <Container safeArea edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.screenTitle}>Give</Text>
        </View>
        <View style={styles.guestContainer}>
          <View style={styles.guestIcon}>
            <Ionicons name="wallet-outline" size={64} color={colors.textSecondary} />
          </View>
          <Text style={styles.guestTitle}>Login Required</Text>
          <Text style={styles.guestSubtitle}>
            Please sign in to make tithes and offerings payments.
          </Text>
          <Button
            variant="primary"
            onPress={() => router.push('/auth/login')}
            style={styles.authButton}
          >
            Sign In
          </Button>
        </View>
      </Container>
    )
  }

  return (
    <Container safeArea edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.screenTitle}>Give</Text>
          <Text style={styles.subtitle}>Tithes & Offerings</Text>
        </View>

        {/* Payment Type Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Payment Type</Text>
          <View style={styles.typeGrid}>
            {PAYMENT_TYPES.map((type) => (
              <Card
                key={type.id}
                variant={paymentType === type.id ? 'elevated' : 'outlined'}
                style={[
                  styles.typeCard,
                  paymentType === type.id && styles.typeCardActive,
                ]}
                onPress={() => setPaymentType(type.id)}
              >
                <View style={[
                  styles.typeIcon,
                  paymentType === type.id && styles.typeIconActive,
                ]}>
                  <Ionicons 
                    name={type.icon as any} 
                    size={24} 
                    color={paymentType === type.id ? colors.white : colors.primary} 
                  />
                </View>
                <Text style={[
                  styles.typeName,
                  paymentType === type.id && styles.typeNameActive,
                ]}>
                  {type.name}
                </Text>
              </Card>
            ))}
          </View>
        </View>

        {/* Amount Input */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Amount (KES)</Text>
          <Input
            placeholder="Enter amount"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            leftIcon={<Text style={styles.currencyText}>KES</Text>}
          />
          
          {/* Quick Amount Buttons */}
          <View style={styles.quickAmounts}>
            {[500, 1000, 2000, 5000].map((amt) => (
              <Button
                key={amt}
                variant={amount === amt.toString() ? 'primary' : 'outline'}
                size="sm"
                onPress={() => setAmount(amt.toString())}
                style={styles.quickAmountBtn}
              >
                {amt}
              </Button>
            ))}
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Card variant="elevated">
            <View style={styles.paymentMethodRow}>
              <View style={styles.methodInfo}>
                <Ionicons name="phone-portrait" size={24} color={colors.success} />
                <View style={styles.methodText}>
                  <Text style={styles.methodTitle}>M-Pesa STK Push</Text>
                  <Text style={styles.methodDesc}>Pay instantly via mobile</Text>
                </View>
              </View>
              <Switch
                value={useMpesa}
                onValueChange={setUseMpesa}
                trackColor={{ false: colors.border, true: colors.success }}
              />
            </View>
          </Card>

          {useMpesa && (
            <View style={styles.mpesaSection}>
              <Input
                label="Phone Number"
                placeholder="254712345678"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                leftIcon={<Ionicons name="call-outline" size={20} color={colors.textSecondary} />}
              />
            </View>
          )}
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Input
            label="Note (Optional)"
            placeholder="Add a note..."
            value={description}
            onChangeText={setDescription}
            multiline
          />
        </View>

        {/* Submit Button */}
        <View style={styles.section}>
          <Button
            variant="primary"
            size="lg"
            onPress={handlePayment}
            loading={isLoading}
            style={styles.submitButton}
            leftIcon={<Ionicons name="send" size={20} color={colors.white} />}
          >
            {useMpesa ? 'Pay with M-Pesa' : 'Record Payment'}
          </Button>
        </View>

        {/* Payment Info */}
        <Card variant="outlined" style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="information-circle" size={20} color={colors.info} />
            <Text style={styles.infoText}>
              Paybill Number: 123456{'\n'}
              Account Number: Your Name
            </Text>
          </View>
        </Card>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </Container>
  )
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    marginBottom: spacing.lg,
  },
  screenTitle: {
    ...typography.h2,
    color: colors.text,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  section: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  typeCard: {
    width: '48%',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  typeCardActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryTint,
  },
  typeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  typeIconActive: {
    backgroundColor: colors.primary,
  },
  typeName: {
    ...typography.captionBold,
    color: colors.textSecondary,
  },
  typeNameActive: {
    color: colors.primary,
  },
  currencyText: {
    ...typography.bodyBold,
    color: colors.textSecondary,
  },
  quickAmounts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  quickAmountBtn: {
    minWidth: 70,
  },
  paymentMethodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  methodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  methodText: {
    marginLeft: spacing.md,
  },
  methodTitle: {
    ...typography.bodyBold,
    color: colors.text,
  },
  methodDesc: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  mpesaSection: {
    marginTop: spacing.md,
  },
  submitButton: {
    paddingVertical: spacing.md,
  },
  infoCard: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
    flex: 1,
  },
  guestContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  guestIcon: {
    marginBottom: spacing.lg,
  },
  guestTitle: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  guestSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  authButton: {
    width: '100%',
  },
  bottomPadding: {
    height: spacing.xxl,
  },
})
