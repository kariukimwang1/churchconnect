import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, Linking, Alert, Image, Dimensions } from 'react-native'
import { Container, Input, Card, Button } from '@/components/ui'
import { colors, spacing, typography, shadows, borderRadius } from '@/constants/design'
import { useState, useEffect } from 'react'
import { blink } from '@/lib/blink'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'

const { width } = Dimensions.get('window')

export default function SermonsScreen() {
  const [searchQuery, setSearchQuery] = useState('')
  const [videos, setVideos] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedVideo, setSelectedVideo] = useState<any | null>(null)

  const SAMPLE_VIDEOS = [
    {
      id: '1',
      video_id: 'dQw4w9WgXcQ',
      title: 'The Power of Faith',
      description: 'A powerful teaching on walking by faith and not by sight.',
      thumbnail_url: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      published_at: '2026-03-08',
      duration: '45:30'
    },
    {
      id: '2',
      video_id: 'dQw4w9WgXcQ',
      title: 'Living a Life of Purpose',
      description: 'Discovering God\'s unique plan for your life and how to live it out.',
      thumbnail_url: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      published_at: '2026-03-01',
      duration: '52:15'
    }
  ]

  useEffect(() => {
    loadVideos()
  }, [])

  const loadVideos = async () => {
    try {
      const storedVideos = await blink.db.youtubeVideos.list({
        orderBy: { publishedAt: 'desc' }
      })
      if (storedVideos.length > 0) {
        setVideos(storedVideos)
      } else {
        setVideos(SAMPLE_VIDEOS)
      }
    } catch (error) {
      setVideos(SAMPLE_VIDEOS)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredVideos = videos.filter(video =>
    video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    video.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handlePlayVideo = async (video: any) => {
    const url = `https://www.youtube.com/watch?v=${video.video_id}`
    try {
      await Linking.openURL(url)
    } catch (error) {
      Alert.alert('Error', 'Could not open YouTube.')
    }
  }

  const renderVideoItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.videoCard}
      onPress={() => setSelectedVideo(item)}
      activeOpacity={0.9}
    >
      <View style={styles.thumbnailContainer}>
        <Image source={{ uri: item.thumbnail_url }} style={styles.thumbnail} />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.6)']}
          style={styles.thumbnailOverlay}
        >
          <View style={styles.durationBadge}>
            <Text style={styles.durationText}>{item.duration}</Text>
          </View>
        </LinearGradient>
        <View style={styles.playIconOverlay}>
          <Ionicons name="play-circle" size={50} color={colors.white} />
        </View>
      </View>
      <View style={styles.videoInfo}>
        <Text style={styles.videoTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.videoDate}>{new Date(item.published_at).toLocaleDateString()}</Text>
      </View>
    </TouchableOpacity>
  )

  if (selectedVideo) {
    return (
      <Container safeArea edges={['top']}>
        <View style={styles.header}>
          <LinearGradient colors={[colors.secondary, colors.secondaryDark]} style={styles.headerGradient}>
            <TouchableOpacity onPress={() => setSelectedVideo(null)} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={colors.white} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Watch Sermon</Text>
          </LinearGradient>
        </View>
        <ScrollView style={styles.detailContainer} showsVerticalScrollIndicator={false}>
          <TouchableOpacity 
            style={styles.largeThumbnail}
            onPress={() => handlePlayVideo(selectedVideo)}
          >
            <Image source={{ uri: selectedVideo.thumbnail_url }} style={styles.fullImage} />
            <View style={styles.playButtonLarge}>
              <Ionicons name="play" size={40} color={colors.white} />
            </View>
          </TouchableOpacity>
          <View style={styles.detailContent}>
            <Text style={styles.detailTitle}>{selectedVideo.title}</Text>
            <View style={styles.metaRow}>
              <Ionicons name="calendar-outline" size={16} color={colors.textSecondary} />
              <Text style={styles.metaText}>{new Date(selectedVideo.published_at).toLocaleDateString()}</Text>
              <View style={styles.dot} />
              <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
              <Text style={styles.metaText}>{selectedVideo.duration}</Text>
            </View>
            <Text style={styles.descriptionTitle}>About this sermon</Text>
            <Text style={styles.descriptionText}>{selectedVideo.description}</Text>
            
            <Button
              variant="primary"
              onPress={() => handlePlayVideo(selectedVideo)}
              leftIcon={<Ionicons name="logo-youtube" size={20} color={colors.white} />}
              style={styles.watchButton}
            >
              Watch on YouTube
            </Button>
          </View>
          <View style={styles.bottomSpace} />
        </ScrollView>
      </Container>
    )
  }

  return (
    <Container safeArea edges={['top']}>
      <View style={styles.screenHeader}>
        <Text style={styles.screenTitle}>Sermons</Text>
        <Text style={styles.screenSubtitle}>Watch church services and teachings</Text>
      </View>

      <View style={styles.searchWrapper}>
        <Input
          placeholder="Search sermons..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon={<Ionicons name="search" size={20} color={colors.textSecondary} />}
          style={styles.searchInput}
        />
      </View>

      <FlatList
        data={filteredVideos}
        keyExtractor={(item) => item.id}
        renderItem={renderVideoItem}
        contentContainerStyle={styles.videoList}
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
  searchWrapper: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  searchInput: {
    borderRadius: 16,
    backgroundColor: colors.white,
  },
  videoList: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xxl,
  },
  videoCard: {
    backgroundColor: colors.white,
    borderRadius: 24,
    marginBottom: spacing.lg,
    overflow: 'hidden',
    ...shadows.md,
  },
  thumbnailContainer: {
    height: 200,
    width: '100%',
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  thumbnailOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    justifyContent: 'flex-end',
    padding: spacing.md,
  },
  durationBadge: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  durationText: {
    ...typography.tiny,
    color: colors.white,
    fontWeight: 'bold',
  },
  playIconOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoInfo: {
    padding: spacing.lg,
  },
  videoTitle: {
    ...typography.bodyBold,
    color: colors.text,
    fontSize: 17,
  },
  videoDate: {
    ...typography.tiny,
    color: colors.textTertiary,
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
  headerTitle: {
    ...typography.h3,
    color: colors.white,
    fontWeight: '700',
    marginLeft: spacing.md,
  },
  detailContainer: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  largeThumbnail: {
    height: 240,
    width: '100%',
    backgroundColor: colors.black,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: '100%',
    height: '100%',
    opacity: 0.8,
  },
  playButtonLarge: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(237, 28, 36, 0.9)', // PCEA Red
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.lg,
  },
  detailContent: {
    padding: spacing.xl,
  },
  detailTitle: {
    ...typography.h2,
    color: colors.text,
    fontWeight: '800',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
  metaText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.textTertiary,
    marginHorizontal: spacing.sm,
  },
  descriptionTitle: {
    ...typography.bodyBold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  descriptionText: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: spacing.xl,
  },
  watchButton: {
    borderRadius: 16,
    height: 56,
  },
  bottomSpace: {
    height: 100,
  },
})
