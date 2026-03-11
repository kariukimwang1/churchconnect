import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, Dimensions } from 'react-native'
import { Container, Input, Card } from '@/components/ui'
import { colors, spacing, typography, shadows, borderRadius } from '@/constants/design'
import { useState, useEffect } from 'react'
import { blink } from '@/lib/blink'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'

const { width } = Dimensions.get('window')

export default function HymnsScreen() {
  const [hymnBooks, setHymnBooks] = useState<any[]>([])
  const [selectedBook, setSelectedBook] = useState<string>('')
  const [hymns, setHymns] = useState<any[]>([])
  const [selectedHymn, setSelectedHymn] = useState<any | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadHymnBooks()
  }, [])

  useEffect(() => {
    if (selectedBook) {
      loadHymns(selectedBook)
    }
  }, [selectedBook])

  const loadHymnBooks = async () => {
    try {
      const books = await blink.db.hymnBooks.list()
      if (books.length > 0) {
        setHymnBooks(books)
        setSelectedBook(books[0].id)
      } else {
        const defaults = [
          { id: 'hb_1', name: 'Golden Bells', language: 'English' },
          { id: 'hb_2', name: 'Nyimbo cia Kuinira Ngai', language: 'Kikuyu' }
        ]
        setHymnBooks(defaults)
        setSelectedBook('hb_1')
      }
    } catch (error) {
      console.error('Error loading hymn books:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadHymns = async (bookId: string) => {
    try {
      const hymnList = await blink.db.hymns.list({
        where: { hymnBookId: bookId },
        orderBy: { number: 'asc' },
      })
      if (hymnList.length > 0) {
        setHymns(hymnList)
      } else {
        // Sample hymns for demo
        const samples = [
          { id: 'h1', number: 1, title: 'Holy, Holy, Holy', lyrics: 'Holy, holy, holy! Lord God Almighty!\nEarly in the morning our song shall rise to Thee;\nHoly, holy, holy, merciful and mighty!\nGod in three Persons, blessed Trinity!' },
          { id: 'h2', number: 2, title: 'Amazing Grace', lyrics: 'Amazing grace! How sweet the sound\nThat saved a wretch like me!\nI once was lost, but now am found;\nWas blind, but now I see.' }
        ]
        setHymns(samples)
      }
    } catch (error) {
      console.error('Error loading hymns:', error)
    }
  }

  const filteredHymns = hymns.filter(
    (hymn) =>
      hymn.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hymn.number.toString().includes(searchQuery)
  )

  const renderHymnItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.hymnItem}
      onPress={() => setSelectedHymn(item)}
      activeOpacity={0.7}
    >
      <View style={[styles.hymnNumber, { backgroundColor: colors.primaryTint }]}>
        <Text style={styles.hymnNumberText}>{item.number}</Text>
      </View>
      <View style={styles.hymnInfo}>
        <Text style={styles.hymnTitle}>{item.title}</Text>
        <Text style={styles.hymnPreview} numberOfLines={1}>
          {item.lyrics?.split('\n')[0]}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
    </TouchableOpacity>
  )

  if (selectedHymn) {
    return (
      <Container safeArea edges={['top']}>
        <View style={styles.header}>
          <LinearGradient
            colors={[colors.primary, colors.primaryDark]}
            style={styles.headerGradient}
          >
            <TouchableOpacity onPress={() => setSelectedHymn(null)} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={colors.white} />
            </TouchableOpacity>
            <View style={styles.headerText}>
              <Text style={styles.headerTitle}>Hymn {selectedHymn.number}</Text>
              <Text style={styles.headerSubtitle}>{hymnBooks.find(b => b.id === selectedBook)?.name}</Text>
            </View>
            <TouchableOpacity style={styles.headerIcon}>
              <Ionicons name="share-outline" size={24} color={colors.white} />
            </TouchableOpacity>
          </LinearGradient>
        </View>
        <ScrollView style={styles.hymnDetail} showsVerticalScrollIndicator={false}>
          <Text style={styles.hymnDetailTitle}>{selectedHymn.title}</Text>
          <View style={styles.lyricsCard}>
            <Text style={styles.lyrics}>{selectedHymn.lyrics}</Text>
          </View>
          <View style={styles.bottomSpace} />
        </ScrollView>
      </Container>
    )
  }

  return (
    <Container safeArea edges={['top']}>
      <View style={styles.screenHeader}>
        <Text style={styles.screenTitle}>Hymn Books</Text>
        <Text style={styles.screenSubtitle}>Sing praises to the Lord</Text>
      </View>

      <View style={styles.tabsWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
          {hymnBooks.map((book) => (
            <TouchableOpacity
              key={book.id}
              style={[
                styles.tab,
                selectedBook === book.id && styles.tabActive,
              ]}
              onPress={() => setSelectedBook(book.id)}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedBook === book.id && styles.tabTextActive,
                ]}
              >
                {book.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.searchWrapper}>
        <Input
          placeholder="Search number or title..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon={<Ionicons name="search" size={20} color={colors.textSecondary} />}
          style={styles.searchInput}
        />
      </View>

      <FlatList
        data={filteredHymns}
        keyExtractor={(item) => item.id}
        renderItem={renderHymnItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
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
  tabsWrapper: {
    marginBottom: spacing.md,
  },
  tabsScroll: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  tab: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: 20,
    backgroundColor: colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabActive: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
  },
  tabText: {
    ...typography.captionBold,
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.white,
  },
  searchWrapper: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  searchInput: {
    borderRadius: 16,
    backgroundColor: colors.white,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xxl,
  },
  hymnItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: 20,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  hymnNumber: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  hymnNumberText: {
    ...typography.bodyBold,
    color: colors.primary,
    fontSize: 18,
  },
  hymnInfo: {
    flex: 1,
  },
  hymnTitle: {
    ...typography.bodyBold,
    color: colors.text,
    fontSize: 16,
  },
  hymnPreview: {
    ...typography.tiny,
    color: colors.textSecondary,
    marginTop: 2,
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
  hymnDetail: {
    flex: 1,
    padding: spacing.lg,
    backgroundColor: colors.backgroundSecondary,
  },
  hymnDetailTitle: {
    ...typography.h2,
    color: colors.text,
    textAlign: 'center',
    fontWeight: '800',
    marginBottom: spacing.xl,
  },
  lyricsCard: {
    backgroundColor: colors.white,
    padding: spacing.xl,
    borderRadius: 24,
    ...shadows.sm,
  },
  lyrics: {
    ...typography.body,
    color: colors.text,
    lineHeight: 34,
    fontSize: 19,
    textAlign: 'center',
  },
  bottomSpace: {
    height: 100,
  },
})
