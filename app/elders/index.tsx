import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, Alert, TextInput } from 'react-native'
import { Container, Input, Card, Button } from '@/components/ui'
import { colors, spacing, typography, shadows, borderRadius } from '@/constants/design'
import { useState, useEffect } from 'react'
import { blink } from '@/lib/blink'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useAuth } from '@/hooks/useAuth'

interface Member {
  id: string
  user_id: string
  full_name: string
  email: string
  phone: string
  gender: string
  date_of_birth: string
  marital_status: string
  occupation: string
  residence: string
  district: string
  groups: string
  is_full_member: string
  date_of_baptism: string
}

interface Payment {
  id: string
  user_id: string
  type: string
  amount: number
  status: string
  payment_method: string
  created_at: string
}

const DISTRICTS = [
  'Emmanuel District',
  'Nazareth District',
  'Ngaramiyiii District',
  'Ebenezer District',
  'Shalom District',
]

const PAYMENT_TYPES = [
  { id: 'tithe', name: 'Tithe' },
  { id: 'offering', name: 'Offering' },
  { id: 'building', name: 'Building Fund' },
  { id: 'thanksgiving', name: 'Thanksgiving' },
]

export default function EldersDashboard() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [activeTab, setActiveTab] = useState<'members' | 'payments' | 'sms' | 'announcements'>('members')
  const [members, setMembers] = useState<Member[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDistrict, setSelectedDistrict] = useState('all')
  const [selectedGender, setSelectedGender] = useState('all')
  const [selectedMemberStatus, setSelectedMemberStatus] = useState('all')
  
  // SMS
  const [smsMessage, setSmsMessage] = useState('')
  const [smsRecipients, setSmsRecipients] = useState('all')
  const [isSendingSms, setIsSendingSms] = useState(false)
  
  // Announcements
  const [announcementTitle, setAnnouncementTitle] = useState('')
  const [announcementContent, setAnnouncementContent] = useState('')
  const [announcementPriority, setAnnouncementPriority] = useState('normal')
  const [isPostingAnnouncement, setIsPostingAnnouncement] = useState(false)

  useEffect(() => {
    loadData()
  }, [activeTab])

  const loadData = async () => {
    setIsLoading(true)
    try {
      if (activeTab === 'members') {
        const memberData = await blink.db.members.list()
        setMembers(memberData)
      } else if (activeTab === 'payments') {
        const paymentData = await blink.db.payments.list({
          orderBy: { created_at: 'desc' }
        })
        setPayments(paymentData)
      }
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.phone?.includes(searchQuery) ||
      member.email?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDistrict = selectedDistrict === 'all' || member.district === selectedDistrict
    const matchesGender = selectedGender === 'all' || member.gender === selectedGender
    const matchesStatus = selectedMemberStatus === 'all' || 
      (selectedMemberStatus === 'full' && member.is_full_member === '1') ||
      (selectedMemberStatus === 'associate' && member.is_full_member === '0')
    return matchesSearch && matchesDistrict && matchesGender && matchesStatus
  })

  const handleSendSms = async () => {
    if (!smsMessage.trim()) {
      Alert.alert('Error', 'Please enter a message')
      return
    }

    setIsSendingSms(true)
    try {
      // Get recipients based on selection
      let recipientList: string[] = []
      
      if (smsRecipients === 'all') {
        recipientList = members.map(m => m.phone).filter(Boolean)
      } else {
        recipientList = members
          .filter(m => m.district === smsRecipients)
          .map(m => m.phone)
          .filter(Boolean)
      }

      // Create SMS log
      const smsLog = {
        senderId: user?.id || 'elder',
        recipientCount: recipientList.length,
        recipients: JSON.stringify(recipientList),
        message: smsMessage,
        status: 'sent',
        cost: recipientList.length * 0.08, // Approximate cost
        sentAt: new Date().toISOString(),
        createdAt: new Date().toISOString()
      }

      await blink.db.smsLog.create(smsLog)

      Alert.alert(
        'SMS Sent',
        `Message sent to ${recipientList.length} recipients. Cost: KES ${(recipientList.length * 0.08).toFixed(2)}`,
        [{ text: 'OK' }]
      )

      setSmsMessage('')
    } catch (error) {
      console.error('Error sending SMS:', error)
      Alert.alert('Error', 'Failed to send SMS. Please try again.')
    } finally {
      setIsSendingSms(false)
    }
  }

  const handlePostAnnouncement = async () => {
    if (!announcementTitle.trim() || !announcementContent.trim()) {
      Alert.alert('Error', 'Please fill in all fields')
      return
    }

    setIsPostingAnnouncement(true)
    try {
      const announcement = {
        title: announcementTitle,
        content: announcementContent,
        category: 'general',
        priority: announcementPriority,
        createdBy: user?.id || 'elder',
        targetAudience: smsRecipients === 'all' ? 'all' : 'district',
        targetDistrict: smsRecipients !== 'all' ? smsRecipients : null,
        isPinned: '0',
        createdAt: new Date().toISOString()
      }

      await blink.db.announcements.create(announcement)

      Alert.alert('Success', 'Announcement posted successfully!', [
        { text: 'OK', onPress: () => {
          setAnnouncementTitle('')
          setAnnouncementContent('')
        }}
      ])
    } catch (error) {
      console.error('Error posting announcement:', error)
      Alert.alert('Error', 'Failed to post announcement.')
    } finally {
      setIsPostingAnnouncement(false)
    }
  }

  const totalTithes = payments
    .filter(p => p.type === 'tithe' && p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0)

  const totalOfferings = payments
    .filter(p => p.type === 'offering' && p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0)

  const memberCount = members.length
  const fullMemberCount = members.filter(m => m.is_full_member === '1').length

  // Render Members Tab
  const renderMembersTab = () => (
    <View>
      {/* Stats Cards */}
      <View style={styles.statsRow}>
        <Card variant="elevated" style={styles.statCard}>
          <Ionicons name="people" size={24} color={colors.primary} />
          <Text style={styles.statNumber}>{memberCount}</Text>
          <Text style={styles.statLabel}>Total Members</Text>
        </Card>
        <Card variant="elevated" style={styles.statCard}>
          <Ionicons name="checkmark-circle" size={24} color={colors.success} />
          <Text style={styles.statNumber}>{fullMemberCount}</Text>
          <Text style={styles.statLabel}>Full Members</Text>
        </Card>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Input
          placeholder="Search by name, phone, or email..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon={<Ionicons name="search" size={20} color={colors.textSecondary} />}
        />
      </View>

      {/* Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer}>
        <TouchableOpacity
          style={[styles.filterChip, selectedDistrict === 'all' && styles.filterChipActive]}
          onPress={() => setSelectedDistrict('all')}
        >
          <Text style={[styles.filterChipText, selectedDistrict === 'all' && styles.filterChipTextActive]}>All Districts</Text>
        </TouchableOpacity>
        {DISTRICTS.map((d) => (
          <TouchableOpacity
            key={d}
            style={[styles.filterChip, selectedDistrict === d && styles.filterChipActive]}
            onPress={() => setSelectedDistrict(d)}
          >
            <Text style={[styles.filterChipText, selectedDistrict === d && styles.filterChipTextActive]}>
              {d.replace(' District', '')}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Members List */}
      <FlatList
        data={filteredMembers}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.memberCard}>
            <View style={styles.memberAvatar}>
              <Text style={styles.memberInitial}>
                {item.full_name?.charAt(0) || 'M'}
              </Text>
            </View>
            <View style={styles.memberInfo}>
              <Text style={styles.memberName}>{item.full_name}</Text>
              <View style={styles.memberDetails}>
                <Text style={styles.memberDetail}>{item.district?.replace(' District', '') || 'No District'}</Text>
                <Text style={styles.memberDetail}> | </Text>
                <Text style={styles.memberDetail}>{item.gender || 'N/A'}</Text>
              </View>
              <View style={styles.memberContact}>
                <Ionicons name="call-outline" size={12} color={colors.textSecondary} />
                <Text style={styles.memberContactText}>{item.phone || 'No phone'}</Text>
              </View>
            </View>
            <View style={styles.memberStatus}>
              {item.is_full_member === '1' ? (
                <View style={styles.fullMemberBadge}>
                  <Text style={styles.fullMemberText}>Full</Text>
                </View>
              ) : (
                <View style={styles.associateMemberBadge}>
                  <Text style={styles.associateMemberText}>Associate</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  )

  // Render Payments Tab
  const renderPaymentsTab = () => (
    <View>
      {/* Financial Summary */}
      <View style={styles.statsRow}>
        <Card variant="elevated" style={[styles.statCard, { backgroundColor: colors.success + '15' }]}>
          <Ionicons name="wallet" size={24} color={colors.success} />
          <Text style={[styles.statNumber, { color: colors.success }]}>KES {totalTithes.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Total Tithes</Text>
        </Card>
        <Card variant="elevated" style={[styles.statCard, { backgroundColor: colors.primary + '15' }]}>
          <Ionicons name="heart" size={24} color={colors.primary} />
          <Text style={[styles.statNumber, { color: colors.primary }]}>KES {totalOfferings.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Total Offerings</Text>
        </Card>
      </View>

      {/* Recent Payments */}
      <Text style={styles.sectionTitle}>Recent Payments</Text>
      {payments.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No payments recorded yet</Text>
        </View>
      ) : (
        <FlatList
          data={payments.slice(0, 20)}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.paymentCard}>
              <View style={styles.paymentInfo}>
                <Text style={styles.paymentType}>
                  {PAYMENT_TYPES.find(t => t.id === item.type)?.name || item.type}
                </Text>
                <Text style={styles.paymentAmount}>KES {item.amount.toLocaleString()}</Text>
              </View>
              <View style={styles.paymentMeta}>
                <Text style={styles.paymentDate}>
                  {new Date(item.created_at).toLocaleDateString()}
                </Text>
                <View style={[styles.paymentStatus, { 
                  backgroundColor: item.status === 'completed' ? colors.success + '20' : colors.warning + '20'
                }]}>
                  <Text style={[styles.paymentStatusText, { 
                    color: item.status === 'completed' ? colors.success : colors.warning
                  }]}>
                    {item.status}
                  </Text>
                </View>
              </View>
            </View>
          )}
        />
      )}
    </View>
  )

  // Render SMS Tab
  const renderSmsTab = () => (
    <View style={styles.formContainer}>
      <Text style={styles.sectionTitle}>Send Bulk SMS</Text>
      
      <Text style={styles.label}>Recipients</Text>
      <View style={styles.chipContainer}>
        <TouchableOpacity
          style={[styles.chip, smsRecipients === 'all' && styles.chipActive]}
          onPress={() => setSmsRecipients('all')}
        >
          <Text style={[styles.chipText, smsRecipients === 'all' && styles.chipTextActive]}>All Members</Text>
        </TouchableOpacity>
        {DISTRICTS.map((d) => (
          <TouchableOpacity
            key={d}
            style={[styles.chip, smsRecipients === d && styles.chipActive]}
            onPress={() => setSmsRecipients(d)}
          >
            <Text style={[styles.chipText, smsRecipients === d && styles.chipTextActive]}>
              {d.replace(' District', '')}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Message</Text>
      <TextInput
        style={styles.textArea}
        value={smsMessage}
        onChangeText={setSmsMessage}
        placeholder="Type your message here..."
        multiline
        textAlignVertical="top"
      />

      <View style={styles.costEstimate}>
        <Ionicons name="information-circle" size={16} color={colors.info} />
        <Text style={styles.costText}>
          Estimated recipients: {smsRecipients === 'all' 
            ? members.length 
            : members.filter(m => m.district === smsRecipients).length}
        </Text>
      </View>

      <Button
        variant="primary"
        onPress={handleSendSms}
        loading={isSendingSms}
        leftIcon={<Ionicons name="send" size={20} color={colors.white} />}
        style={styles.submitButton}
      >
        Send SMS
      </Button>
    </View>
  )

  // Render Announcements Tab
  const renderAnnouncementsTab = () => (
    <View style={styles.formContainer}>
      <Text style={styles.sectionTitle}>Post Announcement</Text>
      
      <Input
        label="Title"
        value={announcementTitle}
        onChangeText={setAnnouncementTitle}
        placeholder="Announcement title"
      />

      <Text style={styles.label}>Content</Text>
      <TextInput
        style={styles.textArea}
        value={announcementContent}
        onChangeText={setAnnouncementContent}
        placeholder="Write your announcement..."
        multiline
        textAlignVertical="top"
      />

      <Text style={styles.label}>Priority</Text>
      <View style={styles.chipContainer}>
        {['normal', 'important', 'urgent'].map((p) => (
          <TouchableOpacity
            key={p}
            style={[styles.chip, announcementPriority === p && styles.chipActive]}
            onPress={() => setAnnouncementPriority(p)}
          >
            <Text style={[styles.chipText, announcementPriority === p && styles.chipTextActive]}>
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Target Audience</Text>
      <View style={styles.chipContainer}>
        <TouchableOpacity
          style={[styles.chip, smsRecipients === 'all' && styles.chipActive]}
          onPress={() => setSmsRecipients('all')}
        >
          <Text style={[styles.chipText, smsRecipients === 'all' && styles.chipTextActive]}>All Members</Text>
        </TouchableOpacity>
        {DISTRICTS.slice(0, 3).map((d) => (
          <TouchableOpacity
            key={d}
            style={[styles.chip, smsRecipients === d && styles.chipActive]}
            onPress={() => setSmsRecipients(d)}
          >
            <Text style={[styles.chipText, smsRecipients === d && styles.chipTextActive]}>
              {d.replace(' District', '')}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Button
        variant="primary"
        onPress={handlePostAnnouncement}
        loading={isPostingAnnouncement}
        leftIcon={<Ionicons name="megaphone" size={20} color={colors.white} />}
        style={styles.submitButton}
      >
        Post Announcement
      </Button>
    </View>
  )

  return (
    <Container safeArea edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Elder Dashboard</Text>
        <Text style={styles.headerSubtitle}>PCEA Nyarugumu</Text>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabNav}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'members' && styles.tabActive]}
          onPress={() => setActiveTab('members')}
        >
          <Ionicons name="people" size={20} color={activeTab === 'members' ? colors.primary : colors.textSecondary} />
          <Text style={[styles.tabText, activeTab === 'members' && styles.tabTextActive]}>Members</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'payments' && styles.tabActive]}
          onPress={() => setActiveTab('payments')}
        >
          <Ionicons name="wallet" size={20} color={activeTab === 'payments' ? colors.primary : colors.textSecondary} />
          <Text style={[styles.tabText, activeTab === 'payments' && styles.tabTextActive]}>Finance</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'sms' && styles.tabActive]}
          onPress={() => setActiveTab('sms')}
        >
          <Ionicons name="chatbubbles" size={20} color={activeTab === 'sms' ? colors.primary : colors.textSecondary} />
          <Text style={[styles.tabText, activeTab === 'sms' && styles.tabTextActive]}>SMS</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'announcements' && styles.tabActive]}
          onPress={() => setActiveTab('announcements')}
        >
          <Ionicons name="megaphone" size={20} color={activeTab === 'announcements' ? colors.primary : colors.textSecondary} />
          <Text style={[styles.tabText, activeTab === 'announcements' && styles.tabTextActive]}>Announce</Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      <ScrollView style={styles.content}>
        {activeTab === 'members' && renderMembersTab()}
        {activeTab === 'payments' && renderPaymentsTab()}
        {activeTab === 'sms' && renderSmsTab()}
        {activeTab === 'announcements' && renderAnnouncementsTab()}
      </ScrollView>
    </Container>
  )
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    paddingTop: spacing.xl,
  },
  headerTitle: {
    ...typography.h2,
    color: colors.white,
  },
  headerSubtitle: {
    ...typography.body,
    color: colors.white,
    opacity: 0.8,
  },
  tabNav: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    ...typography.tiny,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  tabTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  statsRow: {
    flexDirection: 'row',
    padding: spacing.md,
    gap: spacing.sm,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.md,
  },
  statNumber: {
    ...typography.h3,
    color: colors.text,
    marginTop: spacing.xs,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  searchContainer: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  filtersContainer: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    backgroundColor: colors.backgroundSecondary,
    marginRight: spacing.sm,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
  },
  filterChipText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  filterChipTextActive: {
    color: colors.white,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xxl,
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  memberAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberInitial: {
    ...typography.h4,
    color: colors.white,
  },
  memberInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  memberName: {
    ...typography.bodyBold,
    color: colors.text,
  },
  memberDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberDetail: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  memberContact: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  memberContactText: {
    ...typography.tiny,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  memberStatus: {
    alignItems: 'flex-end',
  },
  fullMemberBadge: {
    backgroundColor: colors.success + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  fullMemberText: {
    ...typography.tiny,
    color: colors.success,
    fontWeight: '600',
  },
  associateMemberBadge: {
    backgroundColor: colors.warning + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  associateMemberText: {
    ...typography.tiny,
    color: colors.warning,
    fontWeight: '600',
  },
  paymentCard: {
    backgroundColor: colors.background,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  paymentInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentType: {
    ...typography.bodyBold,
    color: colors.text,
  },
  paymentAmount: {
    ...typography.h4,
    color: colors.primary,
  },
  paymentMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  paymentDate: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  paymentStatus: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  paymentStatusText: {
    ...typography.tiny,
    fontWeight: '600',
  },
  formContainer: {
    padding: spacing.md,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.text,
    marginBottom: spacing.md,
  },
  label: {
    ...typography.captionBold,
    color: colors.textSecondary,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    backgroundColor: colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    ...typography.caption,
    color: colors.text,
  },
  chipTextActive: {
    color: colors.white,
  },
  textArea: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    minHeight: 150,
    ...typography.body,
    color: colors.text,
  },
  costEstimate: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    backgroundColor: colors.info + '15',
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  costText: {
    ...typography.caption,
    color: colors.info,
    marginLeft: spacing.xs,
  },
  submitButton: {
    marginTop: spacing.lg,
  },
  emptyState: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
  },
})
