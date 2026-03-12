import { View, Text, StyleSheet, FlatList } from 'react-native'
import { Card, Container, Input } from '@/components/ui'
import { colors, spacing, typography, borderRadius } from '@/constants/design'
import { Ionicons } from '@expo/vector-icons'
import { useState } from 'react'

export default function PaymentsScreen() {
  const [searchQuery, setSearchQuery] = useState('')

  const transactions = [
    { id: '1', member: 'John Doe', amount: '5000', type: 'Tithe', date: 'Today' },
    { id: '2', member: 'Jane Smith', amount: '2500', type: 'Offering', date: 'Yesterday' },
    { id: '3', member: 'Peter K', amount: '10000', type: 'Tithe', date: 'Mar 10' },
  ]

  return (
    <Container safeArea edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Payment Reports</Text>
      </View>

      <View style={styles.searchSection}>
        <Input
          placeholder="Search transactions..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <Card variant="elevated" style={styles.card}>
            <Card.Content style={styles.content}>
              <View>
                <Text style={styles.memberName}>{item.member}</Text>
                <Text style={styles.date}>{item.date}</Text>
              </View>
              <View>
                <Text style={styles.amount}>KES {item.amount}</Text>
                <Text style={styles.type}>{item.type}</Text>
              </View>
            </Card.Content>
          </Card>
        )}
      />
    </Container>
  )
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
  },
  title: {
    ...typography.h2,
    color: colors.text,
    fontWeight: '800',
  },
  searchSection: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
  },
  card: {
    marginBottom: spacing.md,
    borderRadius: borderRadius.lg,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  memberName: {
    ...typography.bodyBold,
    color: colors.text,
  },
  date: {
    ...typography.tiny,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  amount: {
    ...typography.bodyBold,
    color: colors.success,
    textAlign: 'right',
  },
  type: {
    ...typography.tiny,
    color: colors.textSecondary,
    textAlign: 'right',
    marginTop: spacing.xs,
  },
})
