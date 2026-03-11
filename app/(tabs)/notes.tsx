import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native'
import { Container, Button, Card } from '@/components/ui'
import { colors, spacing, typography, shadows, borderRadius } from '@/constants/design'
import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { blink } from '@/lib/blink'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'

export default function NotesScreen() {
  const { user, isAuthenticated } = useAuth()
  const [notes, setNotes] = useState<any[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [currentNote, setCurrentNote] = useState<any>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isAuthenticated) {
      loadNotes()
    }
  }, [isAuthenticated])

  const loadNotes = async () => {
    try {
      const data = await blink.db.notes.list({
        where: { userId: user?.id },
        orderBy: { updatedAt: 'desc' }
      })
      setNotes(data)
    } catch (error) {
      console.error('Error loading notes:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveNote = async () => {
    if (!title.trim() || !content.trim()) return

    setIsLoading(true)
    try {
      if (currentNote) {
        await blink.db.notes.update(currentNote.id, {
          title: title.trim(),
          content: content.trim(),
          updatedAt: new Date().toISOString()
        })
      } else {
        await blink.db.notes.create({
          userId: user?.id || '',
          title: title.trim(),
          content: content.trim()
        })
      }
      setIsEditing(false)
      setCurrentNote(null)
      setTitle('')
      setContent('')
      loadNotes()
    } catch (error) {
      Alert.alert('Error', 'Failed to save note')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditNote = (note: any) => {
    setCurrentNote(note)
    setTitle(note.title)
    setContent(note.content)
    setIsEditing(true)
  }

  const handleDeleteNote = (id: string) => {
    Alert.alert('Delete Note', 'Are you sure you want to delete this note?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Delete', 
        style: 'destructive',
        onPress: async () => {
          try {
            await blink.db.notes.delete(id)
            loadNotes()
          } catch (error) {
            Alert.alert('Error', 'Failed to delete note')
          }
        }
      }
    ])
  }

  const renderNoteItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.noteCard} 
      onPress={() => handleEditNote(item)}
      activeOpacity={0.7}
    >
      <View style={styles.noteHeader}>
        <Text style={styles.noteTitle} numberOfLines={1}>{item.title}</Text>
        <TouchableOpacity onPress={() => handleDeleteNote(item.id)}>
          <Ionicons name="trash-outline" size={18} color={colors.textTertiary} />
        </TouchableOpacity>
      </View>
      <Text style={styles.noteText} numberOfLines={3}>{item.content}</Text>
      <Text style={styles.noteDate}>{new Date(item.updatedAt || item.createdAt).toLocaleDateString()}</Text>
    </TouchableOpacity>
  )

  if (!isAuthenticated) {
    return (
      <Container safeArea style={styles.guestContainer}>
        <Ionicons name="document-text-outline" size={80} color={colors.textTertiary} />
        <Text style={styles.guestTitle}>Sermon Notes</Text>
        <Text style={styles.guestSubtitle}>Sign in to keep track of your spiritual journey.</Text>
      </Container>
    )
  }

  if (isEditing) {
    return (
      <Container safeArea edges={['top']}>
        <View style={styles.editHeader}>
          <TouchableOpacity onPress={() => setIsEditing(false)} style={styles.backBtn}>
            <Ionicons name="close" size={28} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.editHeaderTitle}>{currentNote ? 'Edit Note' : 'New Note'}</Text>
          <TouchableOpacity onPress={handleSaveNote} style={styles.saveBtn}>
            <Text style={styles.saveBtnText}>Save</Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.editContainer} showsVerticalScrollIndicator={false}>
          <TextInput
            style={styles.titleInput}
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
            placeholderTextColor={colors.textTertiary}
          />
          <TextInput
            style={styles.contentInput}
            placeholder="Start writing..."
            value={content}
            onChangeText={setContent}
            multiline
            textAlignVertical="top"
            placeholderTextColor={colors.textTertiary}
          />
        </ScrollView>
      </Container>
    )
  }

  return (
    <Container safeArea edges={['top']}>
      <View style={styles.screenHeader}>
        <Text style={styles.screenTitle}>My Notes</Text>
        <Text style={styles.screenSubtitle}>Your personal sermon notes</Text>
      </View>

      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        renderItem={renderNoteItem}
        contentContainerStyle={styles.listContent}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="document-outline" size={60} color={colors.textTertiary} />
            <Text style={styles.emptyText}>No notes yet. Tap the button below to start.</Text>
          </View>
        }
      />

      <TouchableOpacity 
        style={styles.fab}
        onPress={() => {
          setCurrentNote(null)
          setTitle('')
          setContent('')
          setIsEditing(true)
        }}
      >
        <LinearGradient colors={[colors.primary, colors.primaryDark]} style={styles.fabGradient}>
          <Ionicons name="add" size={32} color={colors.white} />
        </LinearGradient>
      </TouchableOpacity>
    </Container>
  )
}

const styles = StyleSheet.create({
  guestContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  guestTitle: {
    ...typography.h3,
    color: colors.text,
    marginTop: spacing.lg,
  },
  guestSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  screenHeader: {
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
    opacity: 0.8,
  },
  listContent: {
    paddingHorizontal: spacing.sm,
    paddingBottom: 100,
  },
  noteCard: {
    flex: 1,
    backgroundColor: colors.white,
    margin: spacing.sm,
    padding: spacing.md,
    borderRadius: 20,
    ...shadows.sm,
    minHeight: 150,
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  noteTitle: {
    ...typography.bodyBold,
    color: colors.text,
    flex: 1,
    marginRight: 8,
  },
  noteText: {
    ...typography.small,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  noteDate: {
    ...typography.tiny,
    color: colors.textTertiary,
    marginTop: 'auto',
    paddingTop: 8,
  },
  emptyContainer: {
    padding: spacing.xxl,
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 64,
    height: 64,
    borderRadius: 32,
    ...shadows.lg,
  },
  fabGradient: {
    flex: 1,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: {
    padding: 4,
  },
  editHeaderTitle: {
    ...typography.bodyBold,
    color: colors.text,
    fontSize: 18,
  },
  saveBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  saveBtnText: {
    ...typography.captionBold,
    color: colors.white,
  },
  editContainer: {
    flex: 1,
    padding: spacing.lg,
  },
  titleInput: {
    ...typography.h3,
    color: colors.text,
    fontWeight: '700',
    marginBottom: spacing.lg,
  },
  contentInput: {
    ...typography.body,
    color: colors.text,
    lineHeight: 26,
    minHeight: 300,
  },
})
