import { View, Text, StyleSheet, FlatList, Alert } from 'react-native'
import { Container, Card, Button, Input } from '@/components/ui'
import { colors, spacing, typography, shadows } from '@/constants/design'
import { useState, useEffect } from 'react'
import { blink } from '@/lib/blink'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

interface Child {
  id: string
  fullName: string
  dateOfBirth: string
  createdAt: string
}

export default function ChildrenScreen() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  
  const [children, setChildren] = useState<Child[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [childName, setChildName] = useState('')
  const [childDOB, setChildDOB] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      loadChildren()
    }
  }, [isAuthenticated])

  const loadChildren = async () => {
    try {
      const data = await blink.db.children.list({
        where: { parentId: user?.id },
        orderBy: { createdAt: 'desc' },
      })
      setChildren(data)
    } catch (error) {
      console.error('Error loading children:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const addChild = async () => {
    if (!childName.trim()) {
      Alert.alert('Error', 'Please enter child name')
      return
    }

    if (!isAuthenticated || !user?.id) {
      Alert.alert('Error', 'Please sign in first')
      return
    }

    setIsSaving(true)
    try {
      await blink.db.children.create({
        parentId: user.id,
        fullName: childName,
        dateOfBirth: childDOB || null,
      })

      // Update parent's children count
      const members = await blink.db.members.list({
        where: { userId: user.id },
        limit: 1,
      })

      if (members.length > 0) {
        const currentCount = Number(members[0].childrenCount) || 0
        await blink.db.members.update(members[0].id, {
          childrenCount: (currentCount + 1).toString(),
        })
      }

      Alert.alert('Success', 'Child registered successfully!')
      setChildName('')
      setChildDOB('')
      setShowAddModal(false)
      loadChildren()
    } catch (error) {
      Alert.alert('Error', 'Failed to register child')
    } finally {
      setIsSaving(false)
    }
  }

  const deleteChild = (childId: string) => {
    Alert.alert(
      'Remove Child',
      'Are you sure you want to remove this child from your registration?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await blink.db.children.delete(childId)
              loadChildren()
            } catch (error) {
              Alert.alert('Error', 'Failed to remove child')
            }
          },
        },
      ]
    )
  }

  const renderChild = ({ item }: { item: Child }) => (
    <Card variant="elevated" style={styles.childCard}>
      <View style={styles.childItem}>
        <View style={styles.childAvatar}>
          <Ionicons name="person" size={24} color={colors.white} />
        </View>
        <View style={styles.childInfo}>
          <Text style={styles.childName}>{item.fullName}</Text>
          {item.dateOfBirth && (
            <Text style={styles.childDOB}>Born: {item.dateOfBirth}</Text>
          )}
        </View>
        <Button
          variant="ghost"
          size="sm"
          onPress={() => deleteChild(item.id)}
        >
          <Ionicons name="trash-outline" size={20} color={colors.error} />
        </Button>
      </View>
    </Card>
  )

  if (!isAuthenticated) {
    return (
      <Container safeArea edges={['top']}>
        <View style={styles.header}>
          <Button
            variant="ghost"
            onPress={() => router.back()}
            leftIcon={<Ionicons name="arrow-back" size={24} color={colors.text} />}
          />
          <Text style={styles.screenTitle}>My Children</Text>
        </View>
        <View style={styles.guestContainer}>
          <Ionicons name="people-outline" size={48} color={colors.textSecondary} />
          <Text style={styles.guestTitle}>Login Required</Text>
          <Text style={styles.guestSubtitle}>
            Please sign in to manage your registered children.
          </Text>
        </View>
      </Container>
    )
  }

  return (
    <Container safeArea edges={['top']}>
      <View style={styles.header}>
        <Button
          variant="ghost"
          onPress={() => router.back()}
          leftIcon={<Ionicons name="arrow-back" size={24} color={colors.text} />}
        />
        <Text style={styles.screenTitle}>My Children</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{children.length}</Text>
          <Text style={styles.statLabel}>Registered Children</Text>
        </View>
        <Button
          variant="primary"
          onPress={() => setShowAddModal(true)}
          leftIcon={<Ionicons name="add" size={20} color={colors.white} />}
        >
          Add Child
        </Button>
      </View>

      <FlatList
        data={children}
        keyExtractor={(item) => item.id}
        renderItem={renderChild}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={48} color={colors.textTertiary} />
            <Text style={styles.emptyText}>No children registered</Text>
            <Text style={styles.emptySubtext}>
              Register your children to keep track of their church membership.
            </Text>
          </View>
        }
      />

      {/* Add Child Modal */}
      {showAddModal && (
        <View style={styles.modalOverlay}>
          <Card variant="elevated" style={styles.modalCard}>
            <Text style={styles.modalTitle}>Register Child</Text>
            
            <Input
              label="Child's Full Name"
              placeholder="Enter child's name"
              value={childName}
              onChangeText={setChildName}
              leftIcon={<Ionicons name="person-outline" size={20} color={colors.textSecondary} />}
            />

            <Input
              label="Date of Birth (Optional)"
              placeholder="YYYY-MM-DD"
              value={childDOB}
              onChangeText={setChildDOB}
              leftIcon={<Ionicons name="calendar-outline" size={20} color={colors.textSecondary} />}
            />

            <View style={styles.modalButtons}>
              <Button
                variant="outline"
                onPress={() => {
                  setShowAddModal(false)
                  setChildName('')
                  setChildDOB('')
                }}
                style={styles.modalButton}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onPress={addChild}
                loading={isSaving}
                style={styles.modalButton}
              >
                Register
              </Button>
            </View>
          </Card>
        </View>
      )}
    </Container>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.md,
  },
  screenTitle: {
    ...typography.h2,
    color: colors.text,
    marginLeft: spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  statCard: {
    backgroundColor: colors.primaryTint,
    padding: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  statNumber: {
    ...typography.h2,
    color: colors.primary,
  },
  statLabel: {
    ...typography.caption,
    color: colors.primary,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xxl,
  },
  childCard: {
    marginBottom: spacing.sm,
  },
  childItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  childAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  childInfo: {
    flex: 1,
  },
  childName: {
    ...typography.bodyBold,
    color: colors.text,
  },
  childDOB: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  emptySubtext: {
    ...typography.caption,
    color: colors.textTertiary,
    textAlign: 'center',
    marginTop: spacing.xs,
    paddingHorizontal: spacing.xl,
  },
  guestContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  guestTitle: {
    ...typography.h2,
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  guestSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
  },
  modalCard: {
    width: '100%',
    padding: spacing.lg,
  },
  modalTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.lg,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  modalButton: {
    flex: 1,
  },
})
