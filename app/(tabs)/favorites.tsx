import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useLumo } from '../../context/LumoContext';
import { AI_TOOLS } from '../../data/aiTools';
import { ThemePalette } from '../../theme/colors';
import { FONTS } from '../../theme/fonts';
import { useTheme } from '../../theme/useTheme';

export default function FavoritesScreen() {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const router = useRouter();
  const { favorites, isFavorite, toggleFavorite } = useLumo();

  const favoriteTools = useMemo(
    () => AI_TOOLS.filter((t) => favorites.includes(t.id)),
    [favorites]
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Favorites</Text>
        <Text style={styles.subtitle}>
          {favoriteTools.length === 0
            ? 'No favorites yet'
            : `${favoriteTools.length} tool${favoriteTools.length === 1 ? '' : 's'} starred`}
        </Text>
      </View>

      {favoriteTools.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>⭐</Text>
          <Text style={styles.emptyTitle}>Nothing here yet</Text>
          <Text style={styles.emptyText}>
            Tap the ☆ star on any AI tool to save it here for quick access.
          </Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => router.push('/')}
            activeOpacity={0.85}
          >
            <Text style={styles.emptyButtonText}>Browse AI Tools</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {favoriteTools.map((tool) => (
            <TouchableOpacity
              key={tool.id}
              style={styles.toolCard}
              onPress={() => router.push(`/tool/${tool.id}`)}
              activeOpacity={0.85}
            >
              <View style={[styles.toolIcon, { backgroundColor: tool.color }]}>
                <Text style={styles.toolEmoji}>{tool.emoji}</Text>
              </View>
              <View style={styles.toolInfo}>
                <View style={styles.toolNameRow}>
                  <Text style={styles.toolName} numberOfLines={1}>
                    {tool.name}
                  </Text>
                  {tool.comingSoon && (
                    <View style={styles.soonTag}>
                      <Text style={styles.soonText}>SOON</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.toolDescription} numberOfLines={2}>
                  {tool.description}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => toggleFavorite(tool.id)}
                hitSlop={10}
                style={styles.starButton}
              >
                <Text
                  style={[
                    styles.starIcon,
                    { color: isFavorite(tool.id) ? theme.star : theme.starEmpty },
                  ]}
                >
                  {isFavorite(tool.id) ? '★' : '☆'}
                </Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

function makeStyles(theme: ThemePalette) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background },
    header: { paddingHorizontal: 20, paddingTop: 14, paddingBottom: 12 },
    title: {
      fontSize: 30,
      fontFamily: FONTS.serif,
      color: theme.textPrimary,
      letterSpacing: -0.5,
    },
    subtitle: {
      fontSize: 13,
      color: theme.textSecondary,
      marginTop: 2,
      fontFamily: FONTS.sans,
    },

    scrollContent: { paddingHorizontal: 20, paddingBottom: 24, gap: 8 },

    toolCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.card,
      borderRadius: 12,
      padding: 12,
      borderWidth: 1,
      borderColor: theme.border,
    },
    toolIcon: {
      width: 44,
      height: 44,
      borderRadius: 11,
      alignItems: 'center',
      justifyContent: 'center',
    },
    toolEmoji: { fontSize: 22 },
    toolInfo: { flex: 1, marginLeft: 12 },
    toolNameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    toolName: {
      fontSize: 15,
      fontFamily: FONTS.sansSemiBold,
      color: theme.textPrimary,
      flexShrink: 1,
    },
    toolDescription: {
      fontSize: 12.5,
      color: theme.textSecondary,
      marginTop: 3,
      lineHeight: 17,
      fontFamily: FONTS.sans,
    },
    soonTag: {
      backgroundColor: theme.soonBg,
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 6,
    },
    soonText: {
      fontSize: 9,
      fontFamily: FONTS.sansBold,
      color: theme.soonText,
      letterSpacing: 0.5,
    },
    starButton: { paddingHorizontal: 4, paddingVertical: 4 },
    starIcon: { fontSize: 22 },

    emptyState: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 40,
      paddingBottom: 60,
    },
    emptyEmoji: { fontSize: 48, marginBottom: 14 },
    emptyTitle: {
      fontSize: 20,
      fontFamily: FONTS.serifMedium,
      color: theme.textPrimary,
      marginBottom: 6,
    },
    emptyText: {
      fontSize: 13.5,
      color: theme.textSecondary,
      textAlign: 'center',
      lineHeight: 20,
      marginBottom: 22,
      fontFamily: FONTS.sans,
    },
    emptyButton: {
      backgroundColor: theme.chipActiveBg,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 12,
    },
    emptyButtonText: {
      color: theme.chipActiveText,
      fontFamily: FONTS.sansSemiBold,
      fontSize: 14,
    },
  });
}