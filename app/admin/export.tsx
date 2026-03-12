import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { Card, Container, Button } from '@/components/ui'
import { colors, spacing, typography, borderRadius } from '@/constants/design'
import { Ionicons } from '@expo/vector-icons'

export default function ExportScreen() {
  const exportOptions = [
    { id: '1', name: 'Member List', icon: 'people', format: 'CSV' },
    { id: '2', name: 'Financial Report', icon: 'document-text', format: 'PDF' },
    { id: '3', name: 'Attendance Records', icon: 'checkmark-circle', format: 'Excel' },
    { id: '4', name: 'Group Directory', icon: 'layers', format: 'CSV' },
  ]

  return (
    <Container safeArea edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Export Data</Text>
        <Text style={styles.subtitle}>Download church records and reports</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {exportOptions.map((option) => (
          <Card key={option.id} variant="elevated" style={styles.optionCard}>
            <Card.Content style={styles.optionContent}>
              <View style={styles.iconBox}>
                <Ionicons name={option.icon as any} size={24} color={colors.primary} />
              </View>
              <View style={styles.optionInfo}>
                <Text style={styles.optionName}>{option.name}</Text>
                <Text style={styles.optionFormat}>{option.format} Format</Text>
              </View>
              <Button variant="primary" style={styles.exportBtn}>
                Export
              </Button>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
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
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  content: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
  },
  optionCard: {
    marginBottom: spacing.md,
    borderRadius: borderRadius.lg,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.primaryTint,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionInfo: {
    flex: 1,
  },
  optionName: {
    ...typography.bodyBold,
    color: colors.text,
  },
  optionFormat: {
    ...typography.tiny,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  exportBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
})
