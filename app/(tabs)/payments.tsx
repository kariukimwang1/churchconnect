import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native'
import { Card, Container, Button, Input } from '@/components/ui'
import { colors, spacing, typography, shadows, borderRadius } from '@/constants/design'
import { Ionicons } from '@expo/vector-icons'
import { useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient'

const { width } = Dimensions.get('window')
const CARD_WIDTH = (width - spacing.md * 3) / 2

export default function PaymentsScreen() {
  const [amount, setAmount] = useState('')
  const [paymentType, setPaymentType] = useState<'tithe' | 'offering'>('tithe')
  const [paymentMethod, setPaymentMethod] = useState<'stk' | 'manual'>('stk')

  const paymentTypes = [
    { id: 'tithe', label: 'Tithe', icon: 'logo-usd', description: '10% of income' },
    { id: 'offering', label: 'Offering', icon: 'gift', description: 'Optional giving' },
  ]

  const paymentMethods = [
    { id: 'stk', label: 'M-Pesa (STK Push)', icon: 'phone-portrait' },
    { id: 'manual', label: 'Manual Entry', icon: 'create' },
  ]

  const recentTransactions = [
    { id: '1', amount: '1,000', type: 'Tithe', date: 'Today 2:30 PM', status: 'completed' },
    { id: '2', amount: '500', type: 'Offering', date: 'Yesterday 10:15 AM', status: 'completed' },
    { id: '3', amount: '2,500', type: 'Tithe', date: 'Mar 10, 2:45 PM', status: 'completed' },
  ]

  const stats = [
    { label: 'Total Given', amount: '15,000', icon: 'wallet', color: colors.primary },
    { label: 'This Month', amount: '4,000', icon: 'calendar', color: colors.secondary },
    { label: 'This Year', amount: '12,500', icon: 'trending-up', color: colors.success },
  ]

  return (
    <Container safeArea edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.headerSection}>
          <Text style={styles.screenTitle}>Giving</Text>
          <Text style={styles.screenSubtitle}>Support the ministry of PCEA Nyarugumu</Text>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          {stats.map((stat) => (
            <View key={stat.label} style={styles.statCard}>
              <View style={[styles.statIconBox, { backgroundColor: stat.color + '15' }]}>
                <Ionicons name={stat.icon as any} size={20} color={stat.color} />
              </View>
              <Text style={styles.statLabel}>{stat.label}</Text>
              <Text style={styles.statAmount}>KES {stat.amount}</Text>
            </View>
          ))}
        </View>

        {/* Payment Type Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Type</Text>
          <View style={styles.typeSelector}>
            {paymentTypes.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.typeCard,
                  paymentType === type.id && styles.typeCardActive,
                ]}
                onPress={() => setPaymentType(type.id as any)}
              >
                <Ionicons
                  name={type.icon as any}
                  size={24}
                  color={paymentType === type.id ? colors.white : colors.primary}
                />
                <Text
                  style={[
                    styles.typeLabel,
                    paymentType === type.id && styles.typeLabelActive,
                  ]}
                >
                  {type.label}
                </Text>
                <Text
                  style={[
                    styles.typeDescription,
                    paymentType === type.id && styles.typeDescriptionActive,
                  ]}
                >
                  {type.description}
                </Text>
              </TouchableOpacity>
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
            keyboardType="decimal-pad"
            style={styles.amountInput}
            leftIcon={
              <Text style={styles.currencySymbol}>KES</Text>
            }
          />
        </View>

        {/* Payment Method Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <View style={styles.methodSelector}>
            {paymentMethods.map((method) => (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.methodCard,
                  paymentMethod === method.id && styles.methodCardActive,
                ]}
                onPress={() => setPaymentMethod(method.id as any)}
              >
                <Ionicons
                  name={method.icon as any}
                  size={20}
                  color={paymentMethod === method.id ? colors.primary : colors.textSecondary}
                />
                <Text
                  style={[
                    styles.methodLabel,
                    paymentMethod === method.id && styles.methodLabelActive,
                  ]}
                >
                  {method.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Continue Button */}
        <View style={styles.section}>
          <Button
            variant="primary"
            onPress={() => {
              // Handle payment processing
            }}
            disabled={!amount}
            style={styles.payButton}
          >
            Continue to Payment
          </Button>
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <View style={styles.transactionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          {recentTransactions.map((transaction) => (
            <Card key={transaction.id} variant="elevated" style={styles.transactionCard}>
              <Card.Content style={styles.transactionContent}>
                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionType}>{transaction.type}</Text>
                  <Text style={styles.transactionDate}>{transaction.date}</Text>
                </View>
                <View style={styles.transactionAmount}>
                  <Text style={styles.transactionAmountText}>KES {transaction.amount}</Text>
                </View>
              </Card.Content>
            </Card>
          ))}
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
  },
  screenTitle: {
    ...typography.h2,
    color: colors.text,
    fontWeight: '800',
  },
  screenSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    alignItems: 'center',
    ...shadows.xs,
  },
  statIconBox: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  statLabel: {
    ...typography.tiny,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  statAmount: {
    ...typography.bodyBold,
    color: colors.text,
    fontSize: 14,
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
  typeSelector: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  typeCard: {
    flex: 1,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    ...shadows.xs,
  },
  typeCardActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  typeLabel: {
    ...typography.bodyBold,
    color: colors.text,
    marginTop: spacing.sm,
    fontSize: 15,
  },
  typeLabelActive: {
    color: colors.white,
  },
  typeDescription: {
    ...typography.tiny,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  typeDescriptionActive: {
    color: colors.white,
    opacity: 0.8,
  },
  amountInput: {
    borderRadius: borderRadius.lg,
    backgroundColor: colors.white,
    fontSize: 18,
  },
  currencySymbol: {
    ...typography.bodyBold,
    color: colors.primary,
    marginLeft: spacing.sm,
  },
  methodSelector: {
    gap: spacing.md,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.border,
    gap: spacing.md,
    ...shadows.xs,
  },
  methodCardActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryTint,
  },
  methodLabel: {
    ...typography.body,
    color: colors.text,
    fontSize: 15,
  },
  methodLabelActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  payButton: {
    marginTop: spacing.md,
    borderRadius: borderRadius.lg,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  viewAllText: {
    ...typography.captionBold,
    color: colors.primary,
  },
  transactionCard: {
    marginBottom: spacing.sm,
    borderRadius: borderRadius.lg,
  },
  transactionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionInfo: {
    flex: 1,
  },
  transactionType: {
    ...typography.bodyBold,
    color: colors.text,
  },
  transactionDate: {
    ...typography.tiny,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  transactionAmountText: {
    ...typography.bodyBold,
    color: colors.success,
  },
  bottomPadding: {
    height: 100,
  },
})
