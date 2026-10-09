import * as Clipboard from 'expo-clipboard';
import * as Linking from 'expo-linking';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useMemo } from 'react';
import {
    Alert,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useLumo } from '../../context/LumoContext';
import { AI_TOOLS, CATEGORIES } from '../../data/aiTools';
import { ThemePalette } from '../../theme/colors';
import { FONTS } from '../../theme/fonts';
import { useTheme } from '../../theme/useTheme';

export default function ToolPreviewScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  const { isFavorite, toggleFavorite, addRecent } = useLumo();

  const tool = useMemo(
    () => AI_TOOLS.find((t) => t.id === id),
    [id]
  );

  if (!tool) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.notFound}>
          <Text style={styles.notFoundEmoji}>🔍</Text>
          <Text style={styles.notFoundTitle}>Tool not found</Text>
          <Text style={styles.notFoundText}>
            This AI tool doesn't exist in our directory (yet).
          </Text>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.back()}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const categoryMeta = CATEGORIES.find((c) => c.key === tool.category);

  // Open in the OS's in-app browser (Chrome Custom Tabs on Android,
  // SafariViewController on iOS) — the same secure mechanism Gmail,
  // Slack, and Play Store use. NOT a WebView we control, so no ToS risk.
  const openInBrowser = async () => {
    try {
      await addRecent(tool.id);

      // Try the in-app browser first
      const result = await WebBrowser.openBrowserAsync(tool.url, {
        toolbarColor: theme.mode === 'dark' ? '#1B1F35' : '#1A237E',
        controlsColor: theme.mode === 'dark' ? '#C7CBFF' : '#F5EFE0',
        enableBarCollapsing: true,
        showTitle: true,
        // On Android this uses Chrome Custom Tabs; on iOS uses SFSafariViewController
        presentationStyle: WebBrowser.WebBrowserPresentationStyle.PAGE_SHEET,
      });

      if (result.type === 'cancel' || result.type === 'dismiss') {
        // User closed the browser — no problem, they're back on the preview screen
        return;
      }
    } catch (err) {
      console.warn('In-app browser failed, falling back to system browser', err);
      try {
        const supported = await Linking.canOpenURL(tool.url);
        if (supported) {
          await Linking.openURL(tool.url);
        } else {
          Alert.alert('Cannot open link', tool.url);
        }
      } catch (fallbackErr) {
        Alert.alert('Something went wrong', 'Could not open the tool.');
        console.error(fallbackErr);
      }
    }
  };

  const copyLink = async () => {
    try {
      await Clipboard.setStringAsync(tool.url);
      Alert.alert('Link copied', tool.url);
    } catch (err) {
      Alert.alert('Could not copy', 'Please try again.');
    }
  };

  const shareLink = async () => {
    try {
      // Use the OS share sheet via Linking's built-in support
      const message = `Check out ${tool.name} — ${tool.url}`;
      const url = Platform.select({
        ios: `sms:&body=${encodeURIComponent(message)}`, // fallback path
        default: `mailto:?subject=${encodeURIComponent(
          tool.name + ' — AI Tool'
        )}&body=${encodeURIComponent(message)}`,
      });
      if (url) await Linking.openURL(url);
    } catch (err) {
      console.warn('Share failed', err);
    }
  };

  const favorited = isFavorite(tool.id);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={12}
          style={styles.backButton}
        >
          <Text style={styles.backIcon}>←</Text>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => toggleFavorite(tool.id)}
          hitSlop={12}
          style={styles.starTopButton}
        >
          <Text
            style={[
              styles.starTopIcon,
              { color: favorited ? theme.star : theme.starEmpty },
            ]}
          >
            {favorited ? '★' : '☆'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={styles.hero}>
          <View style={[styles.heroIcon, { backgroundColor: tool.color }]}>
            <Text style={styles.heroEmoji}>{tool.emoji}</Text>
          </View>
          <Text style={styles.heroName}>{tool.name}</Text>
          <View style={styles.categoryTag}>
            <Text style={styles.categoryTagText}>
              {categoryMeta?.emoji} {tool.category}
            </Text>
          </View>
          {tool.comingSoon && (
            <View style={styles.soonTag}>
              <Text style={styles.soonText}>⏳ Coming Soon — Waitlist Only</Text>
            </View>
          )}
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>About</Text>
          <Text style={styles.description}>{tool.description}</Text>
        </View>

        {/* URL preview */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Official Website</Text>
          <View style={styles.urlBox}>
            <Text style={styles.urlText} numberOfLines={2}>
              {tool.url}
            </Text>
          </View>
        </View>

        {/* Notice */}
        <View style={styles.noticeCard}>
          <Text style={styles.noticeText}>
            🌐 {tool.name} will open in your phone's secure in-app browser.
            You'll stay inside Lumo AI — no need to leave the app.
          </Text>
        </View>

        {/* Primary action */}
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={openInBrowser}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryButtonText}>Open {tool.name} →</Text>
        </TouchableOpacity>

        {/* Secondary actions */}
        <View style={styles.secondaryRow}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={copyLink}
            activeOpacity={0.85}
          >
            <Text style={styles.secondaryButtonText}>📋 Copy Link</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={shareLink}
            activeOpacity={0.85}
          >
            <Text style={styles.secondaryButtonText}>✉️ Share</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.favButton}
          onPress={() => toggleFavorite(tool.id)}
          activeOpacity={0.85}
        >
          <Text style={styles.favButtonText}>
            {favorited ? '★ Remove from Favorites' : '☆ Add to Favorites'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ────────────────────────────────────────────────────
function makeStyles(theme: ThemePalette) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background },

    topBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
    backButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 6,
      paddingRight: 10,
    },
    backIcon: {
      fontSize: 22,
      color: theme.textPrimary,
      marginRight: 4,
      fontFamily: FONTS.sansMedium,
    },
    backText: {
      fontSize: 15,
      color: theme.textPrimary,
      fontFamily: FONTS.sansMedium,
    },
    starTopButton: { paddingHorizontal: 6, paddingVertical: 4 },
    starTopIcon: { fontSize: 26 },

    scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },

    hero: { alignItems: 'center', marginTop: 12, marginBottom: 24 },
    heroIcon: {
      width: 96,
      height: 96,
      borderRadius: 26,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
    },
    heroEmoji: { fontSize: 48 },
    heroName: {
      fontSize: 30,
      fontFamily: FONTS.serif,
      color: theme.textPrimary,
      textAlign: 'center',
      letterSpacing: -0.4,
      marginBottom: 10,
    },
    categoryTag: {
      backgroundColor: theme.chipBg,
      paddingHorizontal: 14,
      paddingVertical: 6,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: theme.border,
    },
    categoryTagText: {
      fontSize: 12.5,
      color: theme.textPrimary,
      fontFamily: FONTS.sansSemiBold,
    },
    soonTag: {
      backgroundColor: theme.soonBg,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 10,
      marginTop: 12,
    },
    soonText: {
      fontSize: 12,
      color: theme.soonText,
      fontFamily: FONTS.sansSemiBold,
    },

    section: { marginBottom: 20 },
    sectionLabel: {
      fontSize: 11,
      fontFamily: FONTS.sansBold,
      color: theme.sectionLabel,
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: 8,
    },
    description: {
      fontSize: 15,
      lineHeight: 23,
      color: theme.textSecondary,
      fontFamily: FONTS.sans,
    },

    urlBox: {
      backgroundColor: theme.card,
      paddingHorizontal: 14,
      paddingVertical: 12,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
    },
    urlText: {
      fontSize: 13,
      color: theme.textSecondary,
      fontFamily: FONTS.sans,
    },

    noticeCard: {
      backgroundColor: theme.chipBg,
      padding: 14,
      borderRadius: 12,
      marginBottom: 18,
      borderWidth: 1,
      borderColor: theme.border,
    },
    noticeText: {
      fontSize: 12.5,
      lineHeight: 19,
      color: theme.textSecondary,
      fontFamily: FONTS.sans,
    },

    primaryButton: {
      backgroundColor: theme.chipActiveBg,
      paddingVertical: 16,
      borderRadius: 14,
      alignItems: 'center',
      marginBottom: 12,
    },
    primaryButtonText: {
      color: theme.chipActiveText,
      fontFamily: FONTS.sansBold,
      fontSize: 16,
    },

    secondaryRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
    secondaryButton: {
      flex: 1,
      paddingVertical: 13,
      borderRadius: 12,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.card,
    },
    secondaryButtonText: {
      color: theme.textPrimary,
      fontFamily: FONTS.sansSemiBold,
      fontSize: 13.5,
    },

    favButton: {
      paddingVertical: 13,
      borderRadius: 12,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.card,
    },
    favButtonText: {
      color: theme.textPrimary,
      fontFamily: FONTS.sansSemiBold,
      fontSize: 13.5,
    },

    // Not found state
    notFound: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 40,
    },
    notFoundEmoji: { fontSize: 44, marginBottom: 12 },
    notFoundTitle: {
      fontSize: 22,
      fontFamily: FONTS.serif,
      color: theme.textPrimary,
      marginBottom: 8,
    },
    notFoundText: {
      fontSize: 13.5,
      color: theme.textSecondary,
      textAlign: 'center',
      marginBottom: 20,
      fontFamily: FONTS.sans,
    },
  });
}