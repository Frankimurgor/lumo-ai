import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react';

// ─── Storage keys ──────────────────────────────────────────────
const FAVORITES_KEY = '@lumo_ai_favorites';
const RECENTS_KEY = '@lumo_ai_recents';
const SETTINGS_KEY = '@lumo_ai_settings';

const MAX_RECENTS = 10;

// ─── Types ─────────────────────────────────────────────────────
export interface LumoSettings {
  darkMode: 'system' | 'light' | 'dark';
  sortMode: 'az' | 'category' | 'favorites';
}

interface LumoContextValue {
  favorites: string[];      // array of AITool ids
  recents: string[];        // array of AITool ids, most recent first
  settings: LumoSettings;
  isReady: boolean;
  toggleFavorite: (id: string) => Promise<void>;
  isFavorite: (id: string) => boolean;
  addRecent: (id: string) => Promise<void>;
  clearRecents: () => Promise<void>;
  updateSettings: (patch: Partial<LumoSettings>) => Promise<void>;
}

const DEFAULT_SETTINGS: LumoSettings = {
  darkMode: 'system',
  sortMode: 'az',
};

const LumoContext = createContext<LumoContextValue | undefined>(undefined);

// ─── Provider ──────────────────────────────────────────────────
export function LumoProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recents, setRecents] = useState<string[]>([]);
  const [settings, setSettings] = useState<LumoSettings>(DEFAULT_SETTINGS);
  const [isReady, setIsReady] = useState(false);

  // Load from AsyncStorage on mount
  useEffect(() => {
    (async () => {
      try {
        const [favRaw, recRaw, setRaw] = await Promise.all([
          AsyncStorage.getItem(FAVORITES_KEY),
          AsyncStorage.getItem(RECENTS_KEY),
          AsyncStorage.getItem(SETTINGS_KEY),
        ]);

        if (favRaw) setFavorites(JSON.parse(favRaw));
        if (recRaw) setRecents(JSON.parse(recRaw));
        if (setRaw) setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(setRaw) });
      } catch (err) {
        console.warn('LumoContext: failed to load storage', err);
      } finally {
        setIsReady(true);
      }
    })();
  }, []);

  // ─── Favorites ─────────────────────────────────
  const toggleFavorite = useCallback(async (id: string) => {
    setFavorites((prev) => {
      const next = prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id];
      AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const isFavorite = useCallback(
    (id: string) => favorites.includes(id),
    [favorites]
  );

  // ─── Recents ───────────────────────────────────
  const addRecent = useCallback(async (id: string) => {
    setRecents((prev) => {
      const next = [id, ...prev.filter((x) => x !== id)].slice(0, MAX_RECENTS);
      AsyncStorage.setItem(RECENTS_KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const clearRecents = useCallback(async () => {
    setRecents([]);
    await AsyncStorage.removeItem(RECENTS_KEY);
  }, []);

  // ─── Settings ──────────────────────────────────
  const updateSettings = useCallback(async (patch: Partial<LumoSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  return (
    <LumoContext.Provider
      value={{
        favorites,
        recents,
        settings,
        isReady,
        toggleFavorite,
        isFavorite,
        addRecent,
        clearRecents,
        updateSettings,
      }}
    >
      {children}
    </LumoContext.Provider>
  );
}

// ─── Hook ──────────────────────────────────────────────────────
export function useLumo() {
  const ctx = useContext(LumoContext);
  if (!ctx) {
    throw new Error('useLumo must be used inside <LumoProvider>');
  }
  return ctx;
}