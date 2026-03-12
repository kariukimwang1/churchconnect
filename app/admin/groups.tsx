import { View, Text, StyleSheet, FlatList } from 'react-native'
import { Card, Container } from '@/components/ui'
import { colors, spacing, typography, borderRadius } from '@/constants/design'
import { Ionicons } from '@expo/vector-icons'

export default function GroupsScreen() {
  const groups = [
    { id: '1', name: 'Youth Group', members: 45, leader: 'Samuel' },
    { id: '2', name: 'Women Fellowship', members: 32, leader: 'Mary' },
    { id: '3', name: 'Men\'s Ministry', members: 28, leader: 'John' },
  ]

  return (
    <Container safeArea edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Group Management</Text>
      </View>

      <FlatList
        data={groups}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <Card variant="elevated" style={styles.card}>
            <Card.Content style={styles.content}>
              <View style={styles.groupIcon}>
                <Ionicons name="people" size={24} color={colors.primary} />
              </View>
              <View style={styles.info}>
                <Text style={styles.groupName}>{item.name}</Text>
                <Text style={styles.groupDetail}>{item.members} members • Led by {item.leader}</Text>
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
    alignItems: 'center',
    gap: spacing.md,
  },
  groupIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.primaryTint,
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    flex: 1,
  },
  groupName: {
    ...typography.bodyBold,
    color: colors.text,
  },
  groupDetail: {
    ...typography.tiny,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
})
