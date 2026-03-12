import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, FlatList, Dimensions } from 'react-native'
import { Card, Container, Button } from '@/components/ui'
import { GradientButton } from '@/components/GradientButton'
import { colors, spacing, typography, shadows, borderRadius } from '@/constants/design'
import { Ionicons } from '@expo/vector-icons'
import { useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'

const { width } = Dimensions.get('window')

export default function PrayerRequestsScreen() {
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)

  const prayerRequests = [
    {
      id: '1',
      title: 'Healing for my mother',
      description: 'My mother is undergoing surgery next week. Prayers needed for successful operation and quick recovery.',
      author: 'Jane Muthoni',
      date: '2 hours ago',
      prayers: 24,
      anonymous: false,
    },
    {
      id: '2',
      title: 'Job search',
      description: 'Seeking prayers as I look for employment. May God guide me to the right opportunity.',
      author: 'Anonymous',
      date: '5 hours ago',
      prayers: 18,
      anonymous: true,
    },
    {
      id: '3',
      title: 'Family reconciliation',
      description: 'Prayers for peace and understanding in our family relationships.',
      author: 'Peter Kipchoge',
      date: '1 day ago',
      prayers: 42,
      anonymous: false,
    },
    {
      id: '4',
      title: 'Exam success',
      description: 'Requesting prayers as I sit for my final exams. God gives wisdom and strength.',
      author: 'Anonymous',
      date: '2 days ago',
      prayers: 15,
      anonymous: true,
    },
  ]

  const handleSubmit = () => {
    if (title.trim() && description.trim()) {
      // Submit prayer request
      setTitle('')
      setDescription('')
      setIsAnonymous(false)
      setShowForm(false)
      // Show success message
    }
  }

  const renderPrayerRequest = ({ item }: { item: any }) => (
    <Card variant="elevated" style={styles.requestCard}>
      <Card.Content>
        <View style={styles.requestHeader}>
          <View style={styles.requestInfo}>
            <Text style={styles.requestTitle}>{item.title}</Text>
            <Text style={styles.requestAuthor}>
              by {item.author} • {item.date}
            </Text>
          </View>
          <TouchableOpacity style={styles.moreButton}>
            <Ionicons name="ellipsis-vertical" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
        <Text style={styles.requestDescription}>{item.description}</Text>
        <View style={styles.requestFooter}>
          <TouchableOpacity style={styles.prayerButton}>
            <Ionicons name="heart" size={18} color={colors.secondary} />
            <Text style={styles.prayerCount}>{item.prayers}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareButton}>
            <Ionicons name="share-social" size={18} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </Card.Content>
    </Card>
  )

  if (showForm) {
    return (
      <Container safeArea edges={['top']}>
        <View style={styles.formHeader}>
          <TouchableOpacity onPress={() => setShowForm(false)}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.formTitle}>New Prayer Request</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.formContent}>
          <View style={styles.formSection}>
            <Text style={styles.inputLabel}>Prayer Request Title</Text>
            <TextInput
              style={styles.titleInput}
              placeholder="What should we pray about?"
              placeholderTextColor={colors.textSecondary}
              value={title}
              onChangeText={setTitle}
              maxLength={100}
            />
            <Text style={styles.charCount}>{title.length}/100</Text>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.inputLabel}>Details</Text>
            <TextInput
              style={styles.descriptionInput}
              placeholder="Share more details about your prayer request..."
              placeholderTextColor={colors.textSecondary}
              value={description}
              onChangeText={setDescription}
              multiline
              maxLength={500}
              textAlignVertical="top"
            />
            <Text style={styles.charCount}>{description.length}/500</Text>
          </View>

          <View style={styles.anonSection}>
            <View style={styles.anonContent}>
              <Text style={styles.anonLabel}>Submit Anonymously</Text>
              <Text style={styles.anonSubtitle}>Your name will not be shown</Text>
            </View>
            <TouchableOpacity
              style={[styles.checkbox, isAnonymous && styles.checkboxActive]}
              onPress={() => setIsAnonymous(!isAnonymous)}
            >
              {isAnonymous && (
                <Ionicons name="checkmark" size={16} color={colors.white} />
              )}
            </TouchableOpacity>
          </View>

          <GradientButton
            onPress={handleSubmit}
            disabled={!title.trim() || !description.trim()}
            style={styles.submitButton}
          >
            Submit Prayer Request
          </GradientButton>
        </ScrollView>
      </Container>
    )
  }

  return (
    <Container safeArea edges={['top']}>
      <View style={styles.headerSection}>
        <View>
          <Text style={styles.screenTitle}>Prayer Requests</Text>
          <Text style={styles.screenSubtitle}>Share your prayer needs with the community</Text>
        </View>
        <TouchableOpacity onPress={() => setShowForm(true)} style={styles.newButton}>
          <Ionicons name="add" size={24} color={colors.white} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={prayerRequests}
        keyExtractor={(item) => item.id}
        renderItem={renderPrayerRequest}
        contentContainerStyle={styles.listContent}
        scrollEnabled={true}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={<View style={styles.bottomPadding} />}
      />
    </Container>
  )
}

const styles = StyleSheet.create({
  headerSection: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
  newButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.md,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xxl,
  },
  requestCard: {
    marginBottom: spacing.md,
    borderRadius: borderRadius.lg,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  requestInfo: {
    flex: 1,
  },
  requestTitle: {
    ...typography.bodyBold,
    color: colors.text,
    fontSize: 16,
  },
  requestAuthor: {
    ...typography.tiny,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  moreButton: {
    padding: spacing.xs,
  },
  requestDescription: {
    ...typography.body,
    color: colors.text,
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  requestFooter: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  prayerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  prayerCount: {
    ...typography.tiny,
    color: colors.secondary,
    fontWeight: '600',
  },
  shareButton: {
    padding: spacing.xs,
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  formTitle: {
    ...typography.h3,
    color: colors.text,
    fontWeight: '700',
  },
  formContent: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
  },
  formSection: {
    marginBottom: spacing.lg,
  },
  inputLabel: {
    ...typography.bodyBold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  titleInput: {
    borderWidth: 0,
    borderRadius: borderRadius.xl,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
    ...typography.body,
    color: colors.text,
    backgroundColor: colors.white,
    // Beautiful shadow matching CSS
    shadowColor: '#cff0ff',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 3,
  },
  descriptionInput: {
    borderWidth: 0,
    borderRadius: borderRadius.xl,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
    ...typography.body,
    color: colors.text,
    backgroundColor: colors.white,
    minHeight: 120,
    // Beautiful shadow matching CSS
    shadowColor: '#cff0ff',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 3,
  },
  charCount: {
    ...typography.tiny,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    textAlign: 'right',
  },
  anonSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
  },
  anonContent: {
    flex: 1,
  },
  anonLabel: {
    ...typography.bodyBold,
    color: colors.text,
  },
  anonSubtitle: {
    ...typography.tiny,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  submitButton: {
    borderRadius: borderRadius.lg,
    marginTop: spacing.lg,
    marginBottom: spacing.xxl,
  },
  bottomPadding: {
    height: spacing.xxl,
  },
})
