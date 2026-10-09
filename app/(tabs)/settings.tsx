import { useMemo } from 'react';
import {
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLumo } from '../../context/LumoContext';
import { ThemePalette } from '../../theme/colors';
import { FONTS } from '../../theme/fonts';
import { useTheme } from '../../theme/useTheme';

const LINKS = {
  whatsappChannel: 'https://whatsapp.com/channel/0029Vb8uSQx2P59eLNbHEQ3S',
  hireMe:
    'mailto:lumolabske@gmail.com?subject=Hire%20Me%20-%20Lumo%20Labs&body=Hi%20Franklin%2C%0A%0AI%20saw%20Lumo%20AI%20and%20I%27d%20like%20to%20work%20with%20you%20on...',
  paypal: 'https://www.paypal.com/paypalme/franklinkimurgor/2',
  github: 'https://github.com/Frankimurgor',
  company: 'mailto:lumolabske@gmail.com',
};

export default function SettingsScreen() {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const { settings, updateSettings, clearRecents } = useLumo();

  const openLink = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Cannot open link', url);
      }
    } catch (err) {
      console.error('Failed to open link:', err);
      Alert.alert('Something went wrong', 'Could not open the link.');
    }
  };

  const cycleDarkMode = () => {
    const next =
      settings.darkMode === 'system'
        ? 'light'
        : settings.darkMode === 'light'
        ? 'dark'
        : 'system';
    updateSettings({ darkMode: next });
  };

  const darkModeLabel =
    settings.darkMode === 'system'
      ? 'System'
      : settings.darkMode === 'light'
      ? 'Light'
      : 'Dark';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>Lumo AI · v1.0</Text>
        </View>

        <Section title="Appearance" styles={styles}>
          <Row
            emoji="🌓"
            label="Dark Mode"
            value={darkModeLabel}
            onPress={cycleDarkMode}
            styles={styles}
          />
        </Section>

        <Section title="Support Lumo Labs" styles={styles}>
          <Row
            emoji="💼"
            label="Hire Me"
            value="Custom apps"
            onPress={() => openLink(LINKS.hireMe)}
            styles={styles}
          />
          <Row
            emoji="💛"
            label="Donate $2 via PayPal"
            value="Thank you 🙏"
            onPress={() => openLink(LINKS.paypal)}
            styles={styles}
          />
          <Row
            emoji="📢"
            label="Join WhatsApp Channel"
            value="Updates"
            onPress={() => openLink(LINKS.whatsappChannel)}
            styles={styles}
          />
        </Section>

        <Section title="Data" styles={styles}>
          <Row
            emoji="🧹"
            label="Clear Recent History"
            value=""
            onPress={() =>
              Alert.alert(
                'Clear Recents?',
                'This will remove your recent AI history. Favorites are kept.',
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Clear',
                    style: 'destructive',
                    onPress: () => clearRecents(),
                  },
                ]
              )
            }
            styles={styles}
          />
        </Section>

        <Section title="About" styles={styles}>
          <View style={styles.aboutCard}>
            <Text style={styles.aboutTitle}>Lumo AI</Text>
            <Text style={styles.aboutText}>
              A free, ad-free, privacy-first directory of the best AI tools on
              the web — all in one place, organized by category.
            </Text>

            <Text style={styles.aboutText}>
              Built by <Text style={styles.aboutBold}>Lumo Labs</Text> — a
              Kenyan studio crafting simple, beautiful mobile apps.
            </Text>

            <TouchableOpacity
              style={styles.aboutButton}
              onPress={() => openLink(LINKS.github)}
              activeOpacity={0.85}
            >
              <Text style={styles.aboutButtonText}>View on GitHub</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.aboutButton, styles.aboutButtonOutline]}
              onPress={() => openLink(LINKS.company)}
              activeOpacity={0.85}
            >
              <Text style={styles.aboutButtonTextOutline}>Contact Us</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.disclaimerCard}>
            <Text style={styles.disclaimerTitle}>Disclaimer</Text>
            <Text style={styles.disclaimerText}>
              Lumo AI is an independent directory. It is not affiliated with,
              endorsed by, or sponsored by any AI provider listed. All
              trademarks belong to their respective owners. Tapping a tool
              opens its official website in your browser.
            </Text>
          </View>
        </Section>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Made with ❤️ in Kenya</Text>
          <Text style={styles.footerText}>© Lumo Labs</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

type Styles = ReturnType<typeof makeStyles>;

function Section({
  title,
  children,
  styles,
}: {
  title: string;
  children: React.ReactNode;
  styles: Styles;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>{title}</Text>
      <View style={styles.sectionCard}>{children}</View>
    </View>
  );
}

function Row({
  emoji,
  label,
  value,
  onPress,
  styles,
}: {
  emoji: string;
  label: string;
  value: string;
  onPress: () => void;
  styles: Styles;
}) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.rowEmoji}>{emoji}</Text>
      <Text style={styles.rowLabel}>{label}</Text>
      <View style={styles.rowRight}>
        {value ? <Text style={styles.rowValue}>{value}</Text> : null}
        <Text style={styles.rowChevron}>›</Text>
      </View>
    </TouchableOpacity>
  );
}

function makeStyles(theme: ThemePalette) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background },
    scrollContent: { paddingBottom: 32 },

    header: { paddingHorizontal: 20, paddingTop: 14, paddingBottom: 16 },
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

    section: { marginTop: 8, marginBottom: 12 },
    sectionLabel: {
      fontSize: 11,
      fontFamily: FONTS.sansBold,
      color: theme.sectionLabel,
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginHorizontal: 24,
      marginBottom: 8,
    },
    sectionCard: {
      backgroundColor: theme.card,
      marginHorizontal: 20,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: theme.border,
      overflow: 'hidden',
    },

    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 14,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.border,
    },
    rowEmoji: { fontSize: 18, width: 28 },
    rowLabel: {
      flex: 1,
      fontSize: 15,
      color: theme.textPrimary,
      fontFamily: FONTS.sansMedium,
    },
    rowRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    rowValue: {
      fontSize: 13,
      color: theme.textSecondary,
      fontFamily: FONTS.sans,
    },
    rowChevron: { fontSize: 20, color: theme.chevron, marginTop: -2 },

    aboutCard: {
      padding: 18,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.border,
    },
    aboutTitle: {
      fontSize: 22,
      fontFamily: FONTS.serif,
      color: theme.textPrimary,
      marginBottom: 8,
    },
    aboutText: {
      fontSize: 13.5,
      color: theme.textSecondary,
      lineHeight: 20,
      marginBottom: 10,
      fontFamily: FONTS.sans,
    },
    aboutBold: { fontFamily: FONTS.sansBold, color: theme.textPrimary },
    aboutButton: {
      backgroundColor: theme.chipActiveBg,
      paddingVertical: 11,
      borderRadius: 10,
      alignItems: 'center',
      marginTop: 6,
    },
    aboutButtonText: {
      color: theme.chipActiveText,
      fontFamily: FONTS.sansSemiBold,
      fontSize: 14,
    },
    aboutButtonOutline: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: theme.textPrimary,
      marginTop: 8,
    },
    aboutButtonTextOutline: {
      color: theme.textPrimary,
      fontFamily: FONTS.sansSemiBold,
      fontSize: 14,
    },

    disclaimerCard: { padding: 18 },
    disclaimerTitle: {
      fontSize: 12,
      fontFamily: FONTS.sansBold,
      color: theme.textPrimary,
      marginBottom: 6,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
    },
    disclaimerText: {
      fontSize: 12,
      color: theme.textSecondary,
      lineHeight: 18,
      fontFamily: FONTS.sans,
    },

    footer: { alignItems: 'center', paddingVertical: 20, gap: 2 },
    footerText: {
      fontSize: 11.5,
      color: theme.textSecondary,
      fontFamily: FONTS.sans,
    },
  });
}