import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native'
import { Card, Container, Button, Input } from '@/components/ui'
import { colors, spacing, typography, shadows, borderRadius } from '@/constants/design'
import { Ionicons } from '@expo/vector-icons'
import { useState } from 'react'

export default function ReportIssueScreen() {
  const [category, setCategory] = useState('bug')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [email, setEmail] = useState('')
  const [attachScreenshot, setAttachScreenshot] = useState(false)

  const categories = [
    { id: 'bug', label: 'Bug Report', icon: 'bug', description: 'Something isn\'t working' },
    { id: 'feature', label: 'Feature Request', icon: 'lightbulb', description: 'Suggest an improvement' },
    { id: 'crash', label: 'Crash Report', icon: 'warning', description: 'App crashed' },
    { id: 'other', label: 'Other', icon: 'help-circle', description: 'Something else' },
  ]

  const handleSubmit = () => {
    if (!title.trim() || !description.trim() || !email.trim()) {
      Alert.alert('Required Fields', 'Please fill in all required fields.')
      return
    }

    Alert.alert(
      'Report Submitted',
      'Thank you for reporting this issue. Our team will review it and get back to you.',
      [{ text: 'OK', onPress: resetForm }]
    )
  }

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setEmail('')
    setCategory('bug')
    setAttachScreenshot(false)
  }

  return (
    <Container safeArea edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.headerSection}>
          <Text style={styles.screenTitle}>Report an Issue</Text>
          <Text style={styles.screenSubtitle}>Help us improve the app by reporting problems</Text>
        </View>

        {/* Category Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Issue Category</Text>
          <View style={styles.categoryGrid}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryCard,
                  category === cat.id && styles.categoryCardActive,
                ]}
                onPress={() => setCategory(cat.id)}
              >
                <Ionicons
                  name={cat.icon as any}
                  size={24}
                  color={category === cat.id ? colors.white : colors.primary}
                />
                <Text
                  style={[
                    styles.categoryLabel,
                    category === cat.id && styles.categoryLabelActive,
                  ]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Form Fields */}
        <View style={styles.section}>
          <Text style={styles.inputLabel}>Issue Title *</Text>
          <Input
            placeholder="Brief summary of the issue"
            value={title}
            onChangeText={setTitle}
            style={styles.textInput}
            maxLength={100}
          />
          <Text style={styles.charCount}>{title.length}/100</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.inputLabel}>Description *</Text>
          <TextInput
            style={styles.descriptionInput}
            placeholder="Please provide detailed information about the issue..."
            placeholderTextColor={colors.textSecondary}
            value={description}
            onChangeText={setDescription}
            multiline
            maxLength={500}
            textAlignVertical="top"
          />
          <Text style={styles.charCount}>{description.length}/500</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.inputLabel}>Email *</Text>
          <Input
            placeholder="your@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            style={styles.textInput}
          />
        </View>

        {/* Screenshot Option */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.screenshotOption}
            onPress={() => setAttachScreenshot(!attachScreenshot)}
          >
            <View style={styles.checkboxContainer}>
              <View
                style={[
                  styles.checkbox,
                  attachScreenshot && styles.checkboxActive,
                ]}
              >
                {attachScreenshot && (
                  <Ionicons name="checkmark" size={16} color={colors.white} />
                )}
              </View>
              <View>
                <Text style={styles.screenshotLabel}>Attach Screenshot</Text>
                <Text style={styles.screenshotSubtitle}>Help us understand the issue better</Text>
              </View>
            </View>
          </TouchableOpacity>

          {attachScreenshot && (
            <Card variant="elevated" style={styles.screenshotCard}>
              <Card.Content style={styles.screenshotContent}>
                <Ionicons name="image" size={40} color={colors.primary} />
                <Text style={styles.screenshotPrompt}>Tap to add screenshot</Text>
                <Text style={styles.screenshotNote}>or drag and drop an image</Text>
              </Card.Content>
            </Card>
          )}
        </View>

        {/* Help Text */}
        <View style={styles.helpSection}>
          <Ionicons name="information-circle" size={20} color={colors.info} />
          <Text style={styles.helpText}>
            Your email will only be used to send updates about this issue. We won't share it with anyone else.
          </Text>
        </View>

        {/* Submit Button */}
        <View style={styles.section}>
          <Button
            variant="primary"
            onPress={handleSubmit}
            style={styles.submitButton}
            leftIcon={<Ionicons name="send" size={20} color={colors.white} />}
          >
            Submit Report
          </Button>
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
    marginTop: spacing.xs,
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
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  categoryCard: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.border,
    ...shadows.xs,
  },
  categoryCardActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryLabel: {
    ...typography.tiny,
    color: colors.text,
    marginTop: spacing.sm,
    fontSize: 12,
    textAlign: 'center',
  },
  categoryLabelActive: {
    color: colors.white,
  },
  inputLabel: {
    ...typography.bodyBold,
    color: colors.text,
    marginBottom: spacing.sm,
    fontSize: 15,
  },
  textInput: {
    borderRadius: borderRadius.lg,
    backgroundColor: colors.white,
  },
  descriptionInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...typography.body,
    color: colors.text,
    backgroundColor: colors.white,
    minHeight: 120,
  },
  charCount: {
    ...typography.tiny,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    textAlign: 'right',
  },
  screenshotOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  checkboxContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  screenshotLabel: {
    ...typography.bodyBold,
    color: colors.text,
  },
  screenshotSubtitle: {
    ...typography.tiny,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  screenshotCard: {
    marginTop: spacing.md,
    borderRadius: borderRadius.lg,
  },
  screenshotContent: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  screenshotPrompt: {
    ...typography.bodyBold,
    color: colors.primary,
    marginTop: spacing.md,
  },
  screenshotNote: {
    ...typography.tiny,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  helpSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.infoTint,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  helpText: {
    ...typography.body,
    color: colors.info,
    flex: 1,
    fontSize: 14,
  },
  submitButton: {
    borderRadius: borderRadius.lg,
  },
  bottomPadding: {
    height: spacing.xxl,
  },
})
