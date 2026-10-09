import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import {
  Animated,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LumoSettings, useLumo } from '../../context/LumoContext';
import {
  AI_TOOLS,
  AICategory,
  AITool,
  CATEGORIES,
  getFeaturedTool,
} from '../../data/aiTools';
import { ThemePalette } from '../../theme/colors';
import { FONTS } from '../../theme/fonts';
import { useTheme } from '../../theme/useTheme';

const SORT_ORDER: LumoSettings['sortMode'][] = ['category', 'az', 'favorites'];
const SORT_LABEL: Record<LumoSettings['sortMode'], string> = {
  az: 'A–Z',
  category: 'Category',
  favorites: 'Favorites first',
};

export default function HomeScreen() {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const router = useRouter();

  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<AICategory | 'All'>('All');
  const [detailTool, setDetailTool] = useState<AITool | null>(null);

  const {
    favorites,
    recents,
    isFavorite,
    toggleFavorite,
    addRecent,
    settings,
    updateSettings,
  } = useLumo();

  const featuredTool = useMemo(() => getFeaturedTool(), []);
  const sortMode = settings.sortMode;

  const filteredTools = useMemo(() => {
    let list = AI_TOOLS;
    if (activeCategory !== 'All')
      list = list.filter((t) => t.category === activeCategory);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q)
      );
    }
    return list;
  }, [search, activeCategory]);

  const grouped = useMemo(() => {
    if (sortMode === 'category') {
      const map: Record<string, AITool[]> = {};
      for (const tool of filteredTools) {
        if (!map[tool.category]) map[tool.category] = [];
        map[tool.category].push(tool);
      }
      const ordered: { category: AICategory; tools: AITool[] }[] = [];
      for (const c of CATEGORIES) {
        if (map[c.key]?.length)
          ordered.push({
            category: c.key,
            tools: map[c.key].sort((a, b) => a.name.localeCompare(b.name)),
          });
      }
      return ordered;
    }
    if (sortMode === 'az') {
      const sorted = [...filteredTools].sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      if (sorted.length === 0) return [];
      return [{ category: 'All' as AICategory, tools: sorted }];
    }
    const fav = filteredTools
      .filter((t) => favorites.includes(t.id))
      .sort((a, b) => a.name.localeCompare(b.name));
    const rest = filteredTools
      .filter((t) => !favorites.includes(t.id))
      .sort((a, b) => a.name.localeCompare(b.name));
    const merged = [...fav, ...rest];
    if (merged.length === 0) return [];
    return [{ category: 'All' as AICategory, tools: merged }];
  }, [filteredTools, sortMode, favorites]);

  const favoriteTools = useMemo(
    () => AI_TOOLS.filter((t) => favorites.includes(t.id)),
    [favorites]
  );

  const recentTools = useMemo(
    () =>
      recents
        .map((id) => AI_TOOLS.find((t) => t.id === id))
        .filter((t): t is AITool => Boolean(t)),
    [recents]
  );

  const showExtras = !search.trim() && activeCategory === 'All';

  // ⭐ Tapping a card opens the in-app preview screen
  const handleCardTap = (tool: AITool) => {
    router.push(`/tool/${tool.id}`);
  };

  // Featured card shortcut — opens directly in browser (fewer taps)
  const handleFeaturedOpen = async () => {
    try {
      await addRecent(featuredTool.id);
      await Linking.openURL(featuredTool.url);
    } catch (err) {
      console.error('Failed to open URL:', err);
    }
  };

  const cycleSort = () => {
    const idx = SORT_ORDER.indexOf(sortMode);
    const next = SORT_ORDER[(idx + 1) % SORT_ORDER.length];
    updateSettings({ sortMode: next });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.logo}>Lumo AI</Text>
          <Text style={styles.tagline}>All your AI tools, one place</Text>
        </View>

        <View style={styles.searchWrapper}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search AI tools..."
            placeholderTextColor={theme.placeholder}
            value={search}
            onChangeText={setSearch}
            autoCorrect={false}
            returnKeyType="search"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')} hitSlop={10}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsRow}
        >
          <CategoryChip
            label="All"
            emoji="🌐"
            active={activeCategory === 'All'}
            onPress={() => setActiveCategory('All')}
            styles={styles}
          />
          {CATEGORIES.map((c) => (
            <CategoryChip
              key={c.key}
              label={c.label}
              emoji={c.emoji}
              active={activeCategory === c.key}
              onPress={() => setActiveCategory(c.key)}
              styles={styles}
            />
          ))}
        </ScrollView>

        <View style={styles.toolbarRow}>
          <TouchableOpacity
            style={styles.sortPill}
            onPress={cycleSort}
            activeOpacity={0.85}
          >
            <Text style={styles.sortPillText}>
              ⇅ Sort: {SORT_LABEL[sortMode]}
            </Text>
          </TouchableOpacity>
          <Text style={styles.resultsCount}>
            {filteredTools.length} tool{filteredTools.length === 1 ? '' : 's'}
          </Text>
        </View>

        {showExtras && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Featured Today</Text>
            </View>
            <View style={styles.featuredCard}>
              <View
                style={[styles.featuredBadge, { backgroundColor: featuredTool.color }]}
              >
                <Text style={styles.featuredEmoji}>{featuredTool.emoji}</Text>
              </View>
              <View style={styles.featuredInfo}>
                <Text style={styles.featuredName}>{featuredTool.name}</Text>
                <Text style={styles.featuredCategory}>{featuredTool.category}</Text>
              </View>
              <TouchableOpacity
                style={styles.featuredButton}
                onPress={handleFeaturedOpen}
                activeOpacity={0.85}
              >
                <Text style={styles.featuredButtonText}>Open</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {showExtras && favoriteTools.length > 0 && (
          <View style={styles.groupSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>⭐ Favorites</Text>
              <Text style={styles.sectionCount}>{favoriteTools.length}</Text>
            </View>
            <View style={styles.cardGrid}>
              {favoriteTools.map((tool) => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  favorited={isFavorite(tool.id)}
                  onToggleFavorite={() => toggleFavorite(tool.id)}
                  onPress={() => handleCardTap(tool)}
                  onLongPress={() => setDetailTool(tool)}
                  styles={styles}
                  starColor={theme.star}
                  starEmptyColor={theme.starEmpty}
                />
              ))}
            </View>
          </View>
        )}

        {showExtras && recentTools.length > 0 && (
          <View style={styles.groupSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>🕒 Recent</Text>
              <Text style={styles.sectionCount}>{recentTools.length}</Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.recentRow}
            >
              {recentTools.map((tool) => (
                <TouchableOpacity
                  key={tool.id}
                  style={styles.recentCard}
                  onPress={() => handleCardTap(tool)}
                  onLongPress={() => setDetailTool(tool)}
                  activeOpacity={0.85}
                >
                  <View style={[styles.recentIcon, { backgroundColor: tool.color }]}>
                    <Text style={styles.recentEmoji}>{tool.emoji}</Text>
                  </View>
                  <Text style={styles.recentName} numberOfLines={1}>
                    {tool.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {filteredTools.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🤷‍♂️</Text>
            <Text style={styles.emptyTitle}>No tools found</Text>
            <Text style={styles.emptyText}>
              Try a different search term or category.
            </Text>
          </View>
        )}

        {grouped.map((group, idx) => (
          <View key={`${group.category}-${idx}`} style={styles.groupSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {sortMode === 'category'
                  ? `${
                      CATEGORIES.find((c) => c.key === group.category)?.emoji
                    } ${group.category}`
                  : sortMode === 'az'
                  ? '🔤 All Tools A–Z'
                  : '⭐ Favorites First'}
              </Text>
              <Text style={styles.sectionCount}>{group.tools.length}</Text>
            </View>
            <View style={styles.cardGrid}>
              {group.tools.map((tool) => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  favorited={isFavorite(tool.id)}
                  onToggleFavorite={() => toggleFavorite(tool.id)}
                  onPress={() => handleCardTap(tool)}
                  onLongPress={() => setDetailTool(tool)}
                  styles={styles}
                  starColor={theme.star}
                  starEmptyColor={theme.starEmpty}
                />
              ))}
            </View>
          </View>
        ))}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Lumo AI · v1.0 · Made with ❤️ by Lumo Labs
          </Text>
        </View>
      </ScrollView>

      {/* Quick-actions modal (long-press) */}
      <Modal
        visible={!!detailTool}
        transparent
        animationType="slide"
        onRequestClose={() => setDetailTool(null)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setDetailTool(null)}>
          <Pressable style={styles.modalSheet} onPress={() => {}}>
            {detailTool && (
              <>
                <View style={styles.modalHandle} />
                <View
                  style={[styles.modalIcon, { backgroundColor: detailTool.color }]}
                >
                  <Text style={styles.modalEmoji}>{detailTool.emoji}</Text>
                </View>
                <Text style={styles.modalName}>{detailTool.name}</Text>
                <View style={styles.modalCategoryTag}>
                  <Text style={styles.modalCategoryText}>
                    {CATEGORIES.find((c) => c.key === detailTool.category)?.emoji}{' '}
                    {detailTool.category}
                  </Text>
                </View>
                <Text style={styles.modalDescription}>{detailTool.description}</Text>

                <TouchableOpacity
                  style={styles.modalOpenButton}
                  onPress={() => {
                    const t = detailTool;
                    setDetailTool(null);
                    router.push(`/tool/${t.id}`);
                  }}
                  activeOpacity={0.85}
                >
                  <Text style={styles.modalOpenText}>View Details</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.modalFavButton}
                  onPress={() => toggleFavorite(detailTool.id)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.modalFavText}>
                    {isFavorite(detailTool.id)
                      ? '★ Remove from Favorites'
                      : '☆ Add to Favorites'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.modalCloseButton}
                  onPress={() => setDetailTool(null)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.modalCloseText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

// ─── Components ────────────────────────────────────────────────
type Styles = ReturnType<typeof makeStyles>;

function CategoryChip({
  label,
  emoji,
  active,
  onPress,
  styles,
}: {
  label: string;
  emoji: string;
  active: boolean;
  onPress: () => void;
  styles: Styles;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[styles.chip, active && styles.chipActive]}
    >
      <Text style={[styles.chipText, active && styles.chipTextActive]}>
        {emoji} {label}
      </Text>
    </TouchableOpacity>
  );
}

function ToolCard({
  tool,
  favorited,
  onToggleFavorite,
  onPress,
  onLongPress,
  styles,
  starColor,
  starEmptyColor,
}: {
  tool: AITool;
  favorited: boolean;
  onToggleFavorite: () => void;
  onPress: () => void;
  onLongPress: () => void;
  styles: Styles;
  starColor: string;
  starEmptyColor: string;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scale, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 40,
      bounciness: 0,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 30,
      bounciness: 6,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        style={styles.toolCard}
        onPress={onPress}
        onLongPress={onLongPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        delayLongPress={300}
        activeOpacity={0.95}
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
          onPress={onToggleFavorite}
          hitSlop={10}
          style={styles.starButton}
        >
          <Text
            style={[
              styles.starIcon,
              { color: favorited ? starColor : starEmptyColor },
            ]}
          >
            {favorited ? '★' : '☆'}
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── Styles ────────────────────────────────────────────────────
function makeStyles(theme: ThemePalette) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background },
    scrollContent: { paddingBottom: 32 },

    header: { paddingHorizontal: 20, paddingTop: 14, paddingBottom: 12 },
    logo: {
      fontSize: 34,
      fontFamily: FONTS.serif,
      color: theme.textPrimary,
      letterSpacing: -0.6,
    },
    tagline: {
      fontSize: 13,
      color: theme.textSecondary,
      marginTop: 2,
      fontFamily: FONTS.sans,
    },

    searchWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.card,
      marginHorizontal: 20,
      marginTop: 8,
      borderRadius: 12,
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderWidth: 1,
      borderColor: theme.border,
    },
    searchIcon: { fontSize: 15, marginRight: 8 },
    searchInput: {
      flex: 1,
      fontSize: 15,
      color: theme.textPrimary,
      padding: 0,
      fontFamily: FONTS.sans,
    },
    clearIcon: { fontSize: 15, color: theme.textSecondary, paddingHorizontal: 4 },

    chipsRow: { paddingHorizontal: 16, paddingVertical: 14, gap: 8 },
    chip: {
      backgroundColor: theme.chipBg,
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: theme.border,
    },
    chipActive: {
      backgroundColor: theme.chipActiveBg,
      borderColor: theme.chipActiveBg,
    },
    chipText: {
      fontSize: 13,
      color: theme.textPrimary,
      fontFamily: FONTS.sansMedium,
    },
    chipTextActive: { color: theme.chipActiveText, fontFamily: FONTS.sansSemiBold },

    toolbarRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      marginTop: 4,
      marginBottom: 4,
    },
    sortPill: {
      backgroundColor: theme.chipBg,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: theme.border,
    },
    sortPillText: {
      fontSize: 12,
      color: theme.textPrimary,
      fontFamily: FONTS.sansSemiBold,
    },
    resultsCount: {
      fontSize: 12,
      color: theme.textSecondary,
      fontFamily: FONTS.sans,
    },

    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      marginTop: 14,
      marginBottom: 10,
    },
    sectionTitle: {
      fontSize: 18,
      fontFamily: FONTS.serifMedium,
      color: theme.textPrimary,
    },
    sectionCount: {
      fontSize: 12,
      color: theme.textSecondary,
      backgroundColor: theme.chipBg,
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 10,
      overflow: 'hidden',
      fontFamily: FONTS.sansMedium,
    },

    featuredCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.card,
      marginHorizontal: 20,
      borderRadius: 16,
      padding: 14,
      borderWidth: 1,
      borderColor: theme.border,
      marginBottom: 8,
    },
    featuredBadge: {
      width: 52,
      height: 52,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
    },
    featuredEmoji: { fontSize: 26 },
    featuredInfo: { flex: 1, marginLeft: 14 },
    featuredName: {
      fontSize: 18,
      fontFamily: FONTS.serifMedium,
      color: theme.textPrimary,
    },
    featuredCategory: {
      fontSize: 12,
      color: theme.textSecondary,
      marginTop: 2,
      fontFamily: FONTS.sans,
    },
    featuredButton: {
      backgroundColor: theme.chipActiveBg,
      paddingHorizontal: 16,
      paddingVertical: 9,
      borderRadius: 10,
    },
    featuredButtonText: {
      color: theme.chipActiveText,
      fontFamily: FONTS.sansSemiBold,
      fontSize: 13,
    },

    groupSection: { marginTop: 8 },
    cardGrid: { paddingHorizontal: 14, gap: 8 },

    toolCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.card,
      borderRadius: 12,
      padding: 12,
      borderWidth: 1,
      borderColor: theme.border,
      marginHorizontal: 6,
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

    recentRow: { paddingHorizontal: 16, gap: 10, paddingBottom: 4 },
    recentCard: { width: 78, alignItems: 'center' },
    recentIcon: {
      width: 56,
      height: 56,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
    },
    recentEmoji: { fontSize: 26 },
    recentName: {
      fontSize: 11.5,
      color: theme.textPrimary,
      marginTop: 6,
      fontFamily: FONTS.sansMedium,
      textAlign: 'center',
    },

    emptyState: {
      alignItems: 'center',
      paddingVertical: 60,
      paddingHorizontal: 30,
    },
    emptyEmoji: { fontSize: 40, marginBottom: 12 },
    emptyTitle: {
      fontSize: 18,
      fontFamily: FONTS.serifMedium,
      color: theme.textPrimary,
      marginBottom: 4,
    },
    emptyText: {
      fontSize: 13,
      color: theme.textSecondary,
      textAlign: 'center',
      fontFamily: FONTS.sans,
    },

    footer: { paddingVertical: 24, alignItems: 'center' },
    footerText: {
      fontSize: 11.5,
      color: theme.textSecondary,
      fontFamily: FONTS.sans,
    },

    // Modal
    modalBackdrop: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.55)',
      justifyContent: 'flex-end',
    },
    modalSheet: {
      backgroundColor: theme.card,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      paddingHorizontal: 24,
      paddingTop: 12,
      paddingBottom: 32,
      alignItems: 'center',
      borderTopWidth: 1,
      borderColor: theme.border,
    },
    modalHandle: {
      width: 40,
      height: 4,
      borderRadius: 2,
      backgroundColor: theme.border,
      marginBottom: 20,
    },
    modalIcon: {
      width: 72,
      height: 72,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 14,
    },
    modalEmoji: { fontSize: 36 },
    modalName: {
      fontSize: 24,
      fontFamily: FONTS.serif,
      color: theme.textPrimary,
      marginBottom: 6,
      textAlign: 'center',
    },
    modalCategoryTag: {
      backgroundColor: theme.chipBg,
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 12,
      marginBottom: 14,
    },
    modalCategoryText: {
      fontSize: 12,
      color: theme.textPrimary,
      fontFamily: FONTS.sansSemiBold,
    },
    modalDescription: {
      fontSize: 14,
      color: theme.textSecondary,
      textAlign: 'center',
      lineHeight: 21,
      marginBottom: 14,
      fontFamily: FONTS.sans,
    },
    modalOpenButton: {
      backgroundColor: theme.chipActiveBg,
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: 'center',
      width: '100%',
      marginBottom: 10,
    },
    modalOpenText: {
      color: theme.chipActiveText,
      fontFamily: FONTS.sansBold,
      fontSize: 15,
    },
    modalFavButton: {
      paddingVertical: 12,
      borderRadius: 12,
      alignItems: 'center',
      width: '100%',
      borderWidth: 1,
      borderColor: theme.border,
      marginBottom: 8,
    },
    modalFavText: {
      color: theme.textPrimary,
      fontFamily: FONTS.sansSemiBold,
      fontSize: 14,
    },
    modalCloseButton: { paddingVertical: 10 },
    modalCloseText: {
      color: theme.textSecondary,
      fontSize: 13,
      fontFamily: FONTS.sansMedium,
    },
  });
}