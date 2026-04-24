import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from './mmkvStorage';
import { DEFAULT_CURRENCY_SYMBOL } from '@/utils/constants';

type ThemeMode = 'light' | 'dark' | 'system';

interface NotificationSettings {
  feeding: boolean;
  medication: boolean;
  vet: boolean;
}

interface AppState {
  theme: ThemeMode;
  currencySymbol: string;
  ownerName: string;
  ownerContact: string;
  notificationSettings: NotificationSettings;
}

interface AppActions {
  setTheme: (theme: ThemeMode) => void;
  setCurrencySymbol: (symbol: string) => void;
  setOwnerName: (name: string) => void;
  setOwnerContact: (contact: string) => void;
  setNotificationSettings: (settings: Partial<NotificationSettings>) => void;
  resetSettings: () => void;
}

const initialState: AppState = {
  theme: 'system',
  currencySymbol: DEFAULT_CURRENCY_SYMBOL,
  ownerName: '',
  ownerContact: '',
  notificationSettings: {
    feeding: true,
    medication: true,
    vet: true,
  },
};

export const useAppStore = create<AppState & AppActions>()(
  persist(
    (set) => ({
      ...initialState,

      setTheme: (theme) => set({ theme }),

      setCurrencySymbol: (currencySymbol) => set({ currencySymbol }),

      setOwnerName: (ownerName) => set({ ownerName }),

      setOwnerContact: (ownerContact) => set({ ownerContact }),

      setNotificationSettings: (settings) =>
        set((state) => ({
          notificationSettings: {
            ...state.notificationSettings,
            ...settings,
          },
        })),

      resetSettings: () => set(initialState),
    }),
    {
      name: 'petto-app-settings',
      storage: createJSONStorage(() => mmkvStorage),
    },
  ),
);
