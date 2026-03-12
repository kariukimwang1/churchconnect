import { View, Text, StyleSheet, FlatList } from 'react-native'
import { Card, Container, Input } from '@/components/ui'
import { colors, spacing, typography, shadows, borderRadius } from '@/constants/design'
import { Ionicons } from '@expo/vector-icons'
import { useState } from 'react'

export default function AdminMembersScreen() {
  const [searchQuery, setSearchQuery] = useState('')

  const members = [
    { id: '1', name: 'John Doe', role: 'Elder', district: 'Central', status: 'active' },
    { id: '2', name: 'Jane Smith', role: 'Treasurer', district: 'East', status: 'active' },
    { id: '3', name: 'Peter Kipchoge', role: 'Member', district: 'West', status: 'active' },
    { id: '4', name: 'Mary Kariuki', role: 'Member', district: 'North', status: 'inactive' },
    { id: '5', name: 'Samuel Mwangi', role: 'Deacon', district: 'Central', status: 'active' },
  ]

  const filteredMembers = members.filter(m =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Container safeArea edges={['top']}>
      <View style={styles.headerSection}>
        <Text style={styles.title}>Member Management</Text>
        <Text style={styles.subtitle}>{filteredMembers.length} members total</Text>
      </View>

      <View style={styles.searchSection}>
        <Input
          placeholder="Search members..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon={<Ionicons name="search" size={20} color={colors.textSecondary} />}
        />
      </View>

      <FlatList
        data={filteredMembers}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <Card variant="elevated" style={styles.memberCard}>
            <Card.Content style={styles.memberContent}>
              <View>
                <Text style={styles.memberName}>{item.name}</Text>
                <Text style={styles.memberRole}>{item.role}</Text>
                <Text style={styles.memberDistrict}>{item.district}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: item.status === 'active' ? colors.successTint : colors.errorTint }]}>
                <Text style={[styles.statusText, { color: item.status === 'active' ? colors.success : colors.error }]}>
                  {item.status.toUpperCase()}
                </Text>
              </View>
            </Card.Content>
          </Card>
        )}
      />
    </Container>
  )
}

const styles = StyleSheet.create({
  headerSection: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
  },
  title: {
    ...typography.h2,
    color: colors.text,
    fontWeight: '800',
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  searchSection: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xxl,
  },
  memberCard: {
    marginBottom: spacing.md,
    borderRadius: borderRadius.lg,
  },
  memberContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  memberName: {
    ...typography.bodyBold,
    color: colors.text,
  },
  memberRole: {
    ...typography.tiny,
    color: colors.primary,
    marginTop: spacing.xs,
  },
  memberDistrict: {
    ...typography.tiny,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.md,
  },
  statusText: {
    ...typography.tiny,
    fontWeight: '600',
  },
})
