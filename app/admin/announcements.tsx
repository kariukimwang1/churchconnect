import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { Container, Button, Input } from '@/components/ui'
import { colors, spacing, typography, borderRadius } from '@/constants/design'
import { useState } from 'react'
import { TextInput } from 'react-native'

export default function AnnouncementsScreen() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  return (
    <Container safeArea edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Create Announcement</Text>
        
        <View style={styles.section}>
          <Text style={styles.label}>Announcement Title</Text>
          <Input value={title} onChangeText={setTitle} placeholder="Enter title..." />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Content</Text>
          <TextInput
            style={styles.contentInput}
            placeholder="Write announcement content..."
            value={content}
            onChangeText={setContent}
            multiline
          />
        </View>

        <View style={styles.section}>
          <Button variant="primary" onPress={() => {}}>
            Post Announcement
          </Button>
        </View>
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
  contentInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    color: colors.text,
    minHeight: 120,
  },
})
