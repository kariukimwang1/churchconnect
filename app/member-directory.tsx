import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions } from 'react-native'
import { Card, Container, Input } from '@/components/ui'
import { colors, spacing, typography, shadows, borderRadius } from '@/constants/design'
import { Ionicons } from '@expo/vector-icons'
import { useState } from 'react'

const { width } = Dimensions.get('window')

export default function MemberDirectoryScreen() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDistrict, setSelectedDistrict] = useState('all')

  const districts = [
    { id: 'all', name: 'All Districts' },
    { id: 'central', name: 'Central' },
    { id: 'east', name: 'East' },
    { id: 'west', name: 'West' },
    { id: 'north', name: 'North' },
  ]

  const members = [
    {
      id: '1',
      name: 'John Doe',
      role: 'Elder',
      district: 'Central',
      phone: '+254712345678',
      email: 'john@example.com',
      avatar: '👨‍💼',
    },
    {
      id: '2',
      name: 'Jane Smith',
      role: 'Treasurer',
      district: 'East',
      phone: '+254712345679',
      email: 'jane@example.com',
      avatar: '👩‍💼',
    },
    {
      id: '3',
      name: 'Peter Kipchoge',
      role: 'Member',
      district: 'West',
      phone: '+254712345680',
      email: 'peter@example.com',
      avatar: '👨',
    },
    {
      id: '4',
      name: 'Mary Kariuki',
      role: 'Member',
      district: 'North',
      phone: '+254712345681',
      email: 'mary@example.com',
      avatar: '👩',
    },
    {
      id: '5',
      name: 'Samuel Mwangi',
      role: 'Deacon',
      district: 'Central',
      phone: '+254712345682',
      email: 'samuel@example.com',
      avatar: '👨',
    },
  ]

  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDistrict = selectedDistrict === 'all' || member.district.toLowerCase() === selectedDistrict
    return matchesSearch && matchesDistrict
  })

  const renderMember = ({ item }: { item: any }) => (
    <Card variant="elevated" style={styles.memberCard}>
      <Card.Content style={styles.memberContent}>
        <View style={styles.memberHeader}>
          <View style={styles.avatarBox}>
            <Text style={styles.avatarText}>{item.avatar}</Text>
          </View>
          <View style={styles.memberInfo}>
            <Text style={styles.memberName}>{item.name}</Text>
            <Text style={styles.memberRole}>{item.role}</Text>
            <View style={styles.districtBadge}>
              <Ionicons name="location" size={12} color={colors.primary} />
              <Text style={styles.districtText}>{item.district}</Text>
            </View>
          </View>
        </View>
        <View style={styles.memberActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="call" size={18} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="mail" size={18} color={colors.secondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="share-social" size={18} color={colors.accent} />
          </TouchableOpacity>
        </View>
      </Card.Content>
    </Card>
  )

  return (
    <Container safeArea edges={['top']}>
      <View style={styles.headerSection}>
        <Text style={styles.screenTitle}>Member Directory</Text>
        <Text style={styles.screenSubtitle}>
          {filteredMembers.length} member{filteredMembers.length !== 1 ? 's' : ''} found
        </Text>
      </View>

      <View style={styles.searchSection}>
        <Input
          placeholder="Search members..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon={<Ionicons name="search" size={20} color={colors.textSecondary} />}
          style={styles.searchInput}
        />
      </View>

      <View style={styles.filterSection}>
        <FlatList
          data={districts}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.districtFilter,
                selectedDistrict === item.id && styles.districtFilterActive,
              ]}
              onPress={() => setSelectedDistrict(item.id)}
            >
              <Text
                style={[
                  styles.districtFilterText,
                  selectedDistrict === item.id && styles.districtFilterTextActive,
                ]}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {filteredMembers.length > 0 ? (
        <FlatList
          data={filteredMembers}
          keyExtractor={(item) => item.id}
          renderItem={renderMember}
          contentContainerStyle={styles.listContent}
          scrollEnabled={true}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={<View style={styles.bottomPadding} />}
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="people-outline" size={48} color={colors.textDisabled} />
          <Text style={styles.emptyTitle}>No Members Found</Text>
          <Text style={styles.emptySubtitle}>Try adjusting your search or filters</Text>
        </View>
      )}
    </Container>
  )
}

const styles = StyleSheet.create({
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
    marginTop: spacing.xs,
  },
  searchSection: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  searchInput: {
    borderRadius: borderRadius.lg,
    backgroundColor: colors.white,
  },
  filterSection: {
    marginBottom: spacing.md,
  },
  filterContent: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  districtFilter: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  districtFilterActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  districtFilterText: {
    ...typography.captionBold,
    color: colors.text,
    fontSize: 13,
  },
  districtFilterTextActive: {
    color: colors.white,
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
    flex: 1,
  },
  memberHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  avatarBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primaryTint,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  avatarText: {
    fontSize: 24,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    ...typography.bodyBold,
    color: colors.text,
    fontSize: 16,
  },
  memberRole: {
    ...typography.tiny,
    color: colors.primary,
    fontWeight: '600',
    marginTop: spacing.xs,
  },
  districtBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryTint,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.md,
    alignSelf: 'flex-start',
    marginTop: spacing.xs,
    gap: 4,
  },
  districtText: {
    ...typography.tiny,
    color: colors.primary,
    fontWeight: '600',
  },
  memberActions: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  actionButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: borderRadius.md,
    backgroundColor: colors.backgroundSecondary,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  emptyTitle: {
    ...typography.h3,
    color: colors.text,
    marginTop: spacing.md,
  },
  emptySubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  bottomPadding: {
    height: spacing.xxl,
  },
})
