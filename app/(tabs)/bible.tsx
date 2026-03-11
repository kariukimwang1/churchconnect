import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, Dimensions } from 'react-native'
import { Container, Input, Card } from '@/components/ui'
import { colors, spacing, typography, shadows, borderRadius } from '@/constants/design'
import { useState, useEffect } from 'react'
import { blink } from '@/lib/blink'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'

const { width } = Dimensions.get('window')
const BOOK_CARD_WIDTH = (width - spacing.md * 3) / 2

const BOOKS_OF_BIBLE = [
  'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy', 'Joshua', 'Judges', 'Ruth',
  '1 Samuel', '2 Samuel', '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles', 'Ezra',
  'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs', 'Ecclesiastes', 'Song of Solomon',
  'Isaiah', 'Jeremiah', 'Lamentations', 'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos',
  'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah',
  'Malachi', 'Matthew', 'Mark', 'Luke', 'John', 'Acts', 'Romans', '1 Corinthians',
  '2 Corinthians', 'Galatians', 'Ephesians', 'Philippians', 'Colossians', '1 Thessalonians',
  '2 Thessalonians', '1 Timothy', '2 Timothy', 'Titus', 'Philemon', 'Hebrews', 'James',
  '1 Peter', '2 Peter', '1 John', '2 John', '3 John', 'Jude', 'Revelation'
]

export default function BibleScreen() {
  const [versions, setVersions] = useState<any[]>([])
  const [selectedVersion, setSelectedVersion] = useState<string>('')
  const [selectedBook, setSelectedBook] = useState<string>('')
  const [selectedChapter, setSelectedChapter] = useState<number>(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [verseText, setVerseText] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'books' | 'chapter'>('books')

  useEffect(() => {
    loadVersions()
  }, [])

  const loadVersions = async () => {
    try {
      const vers = await blink.db.bibleVersions.list()
      setVersions(vers)
      if (vers.length > 0) {
        setSelectedVersion(vers[0].id)
      } else {
        const defaults = [
          { id: 'bv_1', version: 'kjv', version_name: 'King James Version', language: 'english' },
          { id: 'bv_2', version: 'swahili', version_name: 'Biblia Takatifu', language: 'swahili' },
          { id: 'bv_3', version: 'kikuyu', version_name: 'Biblia ya Gikuyu', language: 'kikuyu' }
        ]
        setVersions(defaults)
        setSelectedVersion('bv_1')
      }
    } catch (error) {
      console.error('Error loading versions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredBooks = BOOKS_OF_BIBLE.filter(book =>
    book.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getChapters = (bookName: string) => {
    const bookChapters: { [key: string]: number } = {
      'Genesis': 50, 'Exodus': 40, 'Leviticus': 27, 'Numbers': 36, 'Deuteronomy': 34,
      'Joshua': 24, 'Judges': 21, 'Ruth': 4, '1 Samuel': 31, '2 Samuel': 24,
      '1 Kings': 22, '2 Kings': 25, '1 Chronicles': 29, '2 Chronicles': 36, 'Ezra': 10,
      'Nehemiah': 13, 'Esther': 10, 'Job': 42, 'Psalms': 150, 'Proverbs': 31,
      'Ecclesiastes': 12, 'Song of Solomon': 8, 'Isaiah': 66, 'Jeremiah': 52,
      'Lamentations': 5, 'Ezekiel': 48, 'Daniel': 12, 'Hosea': 14, 'Joel': 3, 'Amos': 9,
      'Obadiah': 1, 'Jonah': 4, 'Micah': 7, 'Nahum': 3, 'Habakkuk': 3, 'Zephaniah': 3,
      'Haggai': 2, 'Zechariah': 14, 'Malachi': 4, 'Matthew': 28, 'Mark': 16, 'Luke': 24,
      'John': 21, 'Acts': 28, 'Romans': 16, '1 Corinthians': 16, '2 Corinthians': 13,
      'Galatians': 6, 'Ephesians': 6, 'Philippians': 4, 'Colossians': 4, '1 Thessalonians': 5,
      '2 Thessalonians': 3, '1 Timothy': 6, '2 Timothy': 4, 'Titus': 3, 'Philemon': 1,
      'Hebrews': 13, 'James': 5, '1 Peter': 5, '2 Peter': 3, '1 John': 5, '2 John': 1,
      '3 John': 1, 'Jude': 1, 'Revelation': 22
    }
    return bookChapters[bookName] || 1
  }

  const generateVerses = (book: string, chapter: number): string[] => {
    const sampleVerses: { [key: string]: string[] } = {
      'Genesis 1': [
        '1. In the beginning God created the heaven and the earth.',
        '2. And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters.',
        '3. And God said, Let there be light: and there was light.',
        '4. And God saw the light, that it was good: and God divided the light from the darkness.',
        '5. And God called the light Day, and the darkness he called Night. And the evening and the morning were the first day.'
      ],
      'John 3': [
        '1. There was a man of the Pharisees, named Nicodemus, a ruler of the Jews:',
        '2. The same came to Jesus by night, and said unto him, Rabbi, we know that thou art a teacher come from God: for no man can do these miracles that thou doest, except God be with him.',
        '3. Jesus answered and said unto him, Verily, verily, I say unto thee, Except a man be born again, he cannot see the kingdom of God.'
      ]
    }

    const key = `${book} ${chapter}`
    if (sampleVerses[key]) return sampleVerses[key]

    const verses: string[] = []
    for (let i = 1; i <= 10; i++) {
      verses.push(`${i}. This is verse ${i} of ${book} chapter ${chapter}. Thy word is a lamp unto my feet, and a light unto my path.`)
    }
    return verses
  }

  const handleBookSelect = (book: string) => {
    setSelectedBook(book)
    setSelectedChapter(1)
    const verses = generateVerses(book, 1)
    setVerseText(verses.join('\n\n'))
    setViewMode('chapter')
  }

  const handleChapterSelect = (chapter: number) => {
    setSelectedChapter(chapter)
    const verses = generateVerses(selectedBook, chapter)
    setVerseText(verses.join('\n\n'))
  }

  if (viewMode === 'chapter' && selectedBook) {
    return (
      <Container safeArea edges={['top']}>
        <View style={styles.header}>
          <LinearGradient
            colors={[colors.primary, colors.primaryDark]}
            style={styles.headerGradient}
          >
            <TouchableOpacity onPress={() => setViewMode('books')} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={colors.white} />
            </TouchableOpacity>
            <View style={styles.headerText}>
              <Text style={styles.headerTitle}>{selectedBook}</Text>
              <Text style={styles.headerSubtitle}>Chapter {selectedChapter}</Text>
            </View>
            <TouchableOpacity style={styles.headerIcon}>
              <Ionicons name="share-outline" size={24} color={colors.white} />
            </TouchableOpacity>
          </LinearGradient>
        </View>

        <View style={styles.chapterNav}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chapterScroll}>
            {Array.from({ length: getChapters(selectedBook) }, (_, i) => i + 1).map((ch) => (
              <TouchableOpacity
                key={ch}
                style={[styles.chapterButton, selectedChapter === ch && styles.chapterButtonActive]}
                onPress={() => handleChapterSelect(ch)}
              >
                <Text style={[styles.chapterButtonText, selectedChapter === ch && styles.chapterButtonTextActive]}>
                  {ch}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <ScrollView style={styles.verseContainer} showsVerticalScrollIndicator={false}>
          <Text style={styles.verseText}>{verseText}</Text>
          <View style={styles.bottomSpace} />
        </ScrollView>
      </Container>
    )
  }

  return (
    <Container safeArea edges={['top']}>
      <View style={styles.screenHeader}>
        <Text style={styles.screenTitle}>Holy Bible</Text>
        <Text style={styles.screenSubtitle}>Search and read the scriptures</Text>
      </View>

      <View style={styles.versionWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.versionScroll}>
          {versions.map((v) => (
            <TouchableOpacity
              key={v.id}
              style={[styles.versionTab, selectedVersion === v.id && styles.versionTabActive]}
              onPress={() => setSelectedVersion(v.id)}
            >
              <Text style={[styles.versionTabText, selectedVersion === v.id && styles.versionTabTextActive]}>
                {v.version_name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.searchWrapper}>
        <Input
          placeholder="Search books..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon={<Ionicons name="search" size={20} color={colors.textSecondary} />}
          style={styles.searchInput}
        />
      </View>

      <FlatList
        data={filteredBooks}
        keyExtractor={(item) => item}
        numColumns={2}
        contentContainerStyle={styles.booksGrid}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.bookCard}
            onPress={() => handleBookSelect(item)}
            activeOpacity={0.7}
          >
            <View style={styles.bookIconBox}>
              <Ionicons name="book" size={24} color={colors.primary} />
            </View>
            <Text style={styles.bookNameText}>{item}</Text>
            <Text style={styles.chapterCountText}>{getChapters(item)} Chapters</Text>
          </TouchableOpacity>
        )}
      />
    </Container>
  )
}

const styles = StyleSheet.create({
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
  versionWrapper: {
    marginBottom: spacing.md,
  },
  versionScroll: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  versionTab: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: 20,
    backgroundColor: colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  versionTabActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  versionTabText: {
    ...typography.captionBold,
    color: colors.textSecondary,
  },
  versionTabTextActive: {
    color: colors.white,
  },
  searchWrapper: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  searchInput: {
    borderRadius: 16,
    backgroundColor: colors.white,
  },
  booksGrid: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xxl,
  },
  bookCard: {
    width: BOOK_CARD_WIDTH,
    margin: spacing.xs,
    padding: spacing.lg,
    backgroundColor: colors.white,
    borderRadius: 24,
    alignItems: 'center',
    ...shadows.sm,
  },
  bookIconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: colors.primaryTint,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  bookNameText: {
    ...typography.bodyBold,
    color: colors.text,
    textAlign: 'center',
  },
  chapterCountText: {
    ...typography.tiny,
    color: colors.textSecondary,
    marginTop: 4,
  },
  header: {
    height: 100,
  },
  headerGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xl,
  },
  backButton: {
    padding: spacing.xs,
  },
  headerText: {
    flex: 1,
    marginLeft: spacing.md,
  },
  headerTitle: {
    ...typography.h3,
    color: colors.white,
    fontWeight: '700',
  },
  headerSubtitle: {
    ...typography.caption,
    color: colors.white,
    opacity: 0.8,
  },
  headerIcon: {
    padding: spacing.xs,
  },
  chapterNav: {
    backgroundColor: colors.white,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  chapterScroll: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  chapterButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.xs,
  },
  chapterButtonActive: {
    backgroundColor: colors.primary,
  },
  chapterButtonText: {
    ...typography.bodyBold,
    color: colors.text,
  },
  chapterButtonTextActive: {
    color: colors.white,
  },
  verseContainer: {
    flex: 1,
    padding: spacing.lg,
    backgroundColor: colors.backgroundSecondary,
  },
  verseText: {
    ...typography.body,
    color: colors.text,
    lineHeight: 30,
    fontSize: 18,
  },
  bottomSpace: {
    height: 100,
  },
})
