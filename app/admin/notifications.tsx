import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native'
import { Container, Button, Input } from '@/components/ui'
import { colors, spacing, typography, borderRadius } from '@/constants/design'
import { useState } from 'react'

export default function NotificationsScreen() {
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')

  return (
    <Container safeArea edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Send Notification</Text>
        
        <View style={styles.section}>
          <Text style={styles.label}>Message Title</Text>
          <Input value={title} onChangeText={setTitle} placeholder="SMS subject" />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Message Body</Text>
          <TextInput
            style={styles.messageInput}
            placeholder="Type your message here..."
            value={message}
            onChangeText={setMessage}
            multiline
            maxLength={160}
          />
          <Text style={styles.charCount}>{message.length}/160</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Send To</Text>
          <View style={styles.optionRow}>
            <Text style={styles.optionText}>All Members</Text>
          </View>
        </View>

        <Button variant="primary" onPress={() => {}}>
          Send SMS to All
        </Button>
      </ScrollView>
    </Container>
  )
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
  },
  title: {
    ...typography.h2,
    color: colors.text,
    fontWeight: '800',
    marginBottom: spacing.lg,
  },
  section: {
    marginBottom: spacing.lg,
  },
  label: {
    ...typography.bodyBold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  messageInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    color: colors.text,
    minHeight: 100,
  },
  charCount: {
    ...typography.tiny,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    textAlign: 'right',
  },
  optionRow: {
    padding: spacing.md,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.lg,
  },
  optionText: {
    ...typography.body,
    color: colors.text,
  },
})
