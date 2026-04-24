import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { getDatabase } from '@/database/connection';
import { runMigrations } from '@/database/migrations';
import AppNavigation from '@/app/navigation';

export function AppProviders() {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function initialize() {
      try {
        const db = getDatabase();
        runMigrations(db);
        setIsReady(true);
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        setError(message);
      }
    }
    initialize();
  }, []);

  if (error) {
    return (
      <GestureHandlerRootView className="flex-1">
        <View className="flex-1 items-center justify-center bg-cream dark:bg-dark-bg">
          <Text className="text-base text-red-500">Failed to initialize database</Text>
          <Text className="mt-2 px-6 text-center text-sm text-text-secondary dark:text-text-muted">
            {error}
          </Text>
        </View>
      </GestureHandlerRootView>
    );
  }

  if (!isReady) {
    return (
      <GestureHandlerRootView className="flex-1">
        <View className="flex-1 items-center justify-center bg-cream dark:bg-dark-bg">
          <ActivityIndicator size="large" color="#2D6A4F" />
          <Text className="mt-4 text-sm text-text-secondary dark:text-text-muted">
            Setting up Petto...
          </Text>
        </View>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView className="flex-1">
      <SafeAreaProvider>
        <AppNavigation />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
