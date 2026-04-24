import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, Switch, Alert, Pressable } from 'react-native';
import {
  Sun,
  Moon,
  Smartphone,
  Bell,
  Database,
  Download,
  Upload,
  Trash2,
  Info,
} from 'lucide-react-native';

import { useAppStore } from '@/store/useAppStore';
import { Card, Button, Input, ConfirmDialog, Modal } from '@/components/ui';
import { exportAllData, clearAllData } from '@/services/backupService';
import { colors } from '@/utils/colors';

type ThemeMode = 'light' | 'dark' | 'system';

export default function SettingsScreen() {
  const theme = useAppStore((state) => state.theme);
  const currencySymbol = useAppStore((state) => state.currencySymbol);
  const ownerName = useAppStore((state) => state.ownerName);
  const ownerContact = useAppStore((state) => state.ownerContact);
  const notificationSettings = useAppStore((state) => state.notificationSettings);
  const setTheme = useAppStore((state) => state.setTheme);
  const setCurrencySymbol = useAppStore((state) => state.setCurrencySymbol);
  const setOwnerName = useAppStore((state) => state.setOwnerName);
  const setOwnerContact = useAppStore((state) => state.setOwnerContact);
  const setNotificationSettings = useAppStore((state) => state.setNotificationSettings);
  const resetSettings = useAppStore((state) => state.resetSettings);

  const [showClearDialog, setShowClearDialog] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const globalNotificationsEnabled =
    notificationSettings.feeding ||
    notificationSettings.medication ||
    notificationSettings.vet;

  const [notificationsGlobal, setNotificationsGlobal] = useState(globalNotificationsEnabled);

  const handleSetTheme = useCallback(
    (t: ThemeMode) => {
      setTheme(t);
    },
    [setTheme],
  );

  const handleToggleGlobalNotifications = useCallback(
    (value: boolean) => {
      setNotificationsGlobal(value);
      if (!value) {
        setNotificationSettings({ feeding: false, medication: false, vet: false });
      } else {
        setNotificationSettings({ feeding: true, medication: true, vet: true });
      }
    },
    [setNotificationSettings],
  );

  const handleToggleFeedingNotifications = useCallback(
    (value: boolean) => {
      setNotificationSettings({ feeding: value });
    },
    [setNotificationSettings],
  );

  const handleToggleMedicationNotifications = useCallback(
    (value: boolean) => {
      setNotificationSettings({ medication: value });
    },
    [setNotificationSettings],
  );

  const handleToggleVetNotifications = useCallback(
    (value: boolean) => {
      setNotificationSettings({ vet: value });
    },
    [setNotificationSettings],
  );

  const handleExportData = useCallback(async () => {
    setIsExporting(true);
    try {
      await exportAllData();
    } catch {
      Alert.alert('Error', 'Failed to export data.');
    } finally {
      setIsExporting(false);
    }
  }, []);

  const handleImportData = useCallback(() => {
    Alert.alert(
      'Coming Soon',
      'Data import will be available in a future update. Stay tuned!',
    );
  }, []);

  const handleClearDataPress = useCallback(() => {
    setShowClearDialog(true);
  }, []);

  const handleClearDialogCancel = useCallback(() => {
    setShowClearDialog(false);
  }, []);

  const handleClearDialogConfirm = useCallback(() => {
    setShowClearDialog(false);
    setDeleteConfirmText('');
    setShowDeleteConfirm(true);
  }, []);

  const handleDeleteConfirmCancel = useCallback(() => {
    setShowDeleteConfirm(false);
    setDeleteConfirmText('');
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (deleteConfirmText !== 'DELETE') {
      Alert.alert('Error', 'Please type DELETE to confirm.');
      return;
    }
    setIsClearing(true);
    try {
      await clearAllData();
      resetSettings();
      setShowDeleteConfirm(false);
      setDeleteConfirmText('');
      Alert.alert('Success', 'All data has been cleared.');
    } catch {
      Alert.alert('Error', 'Failed to clear data.');
    } finally {
      setIsClearing(false);
    }
  }, [deleteConfirmText, resetSettings]);

  return (
    <View className="flex-1 bg-cream dark:bg-dark-bg">
      {/* Header */}
      <View className="px-4 pt-14 pb-3 bg-white dark:bg-dark-card">
        <Text className="text-xl font-bold text-text-primary dark:text-text-dark">
          Settings
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Appearance ──────────────────────────────────────── */}
        <Card className="mb-4">
          <View className="flex-row items-center mb-3">
            <Sun size={18} color={colors.primary[500]} />
            <Text className="text-base font-semibold text-text-primary dark:text-text-dark ml-2">
              Appearance
            </Text>
          </View>

          <View className="flex-row gap-2">
            {([
              { value: 'light' as ThemeMode, label: 'Light', Icon: Sun },
              { value: 'dark' as ThemeMode, label: 'Dark', Icon: Moon },
              { value: 'system' as ThemeMode, label: 'System', Icon: Smartphone },
            ]).map(({ value, label, Icon }) => {
              const isSelected = theme === value;
              return (
                <Pressable
                  key={value}
                  onPress={() => handleSetTheme(value)}
                  accessibilityLabel={`${label} theme`}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                  className={`flex-1 items-center py-3 rounded-xl ${
                    isSelected
                      ? 'bg-primary-500 dark:bg-primary-400'
                      : 'bg-gray-100 dark:bg-dark-surface'
                  }`}
                >
                  <Icon
                    size={20}
                    color={isSelected ? '#FFFFFF' : colors.muted}
                  />
                  <Text
                    className={`text-xs font-medium mt-1 ${
                      isSelected ? 'text-white' : 'text-muted dark:text-muted-dark'
                    }`}
                  >
                    {label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Card>

        {/* ── Currency ────────────────────────────────────────── */}
        <Card className="mb-4">
          <Text className="text-base font-semibold text-text-primary dark:text-text-dark mb-3">
            Currency Symbol
          </Text>
          <Input
            value={currencySymbol}
            onChangeText={setCurrencySymbol}
            placeholder="₱"
            accessibilityLabel="Currency symbol"
            accessibilityHint="Enter the currency symbol to use throughout the app"
          />
        </Card>

        {/* ── Notifications ───────────────────────────────────── */}
        <Card className="mb-4">
          <View className="flex-row items-center mb-3">
            <Bell size={18} color={colors.primary[500]} />
            <Text className="text-base font-semibold text-text-primary dark:text-text-dark ml-2">
              Notifications
            </Text>
          </View>

          {/* Global toggle */}
          <View className="flex-row items-center justify-between py-2">
            <Text className="text-sm text-text-primary dark:text-text-dark">
              Enable Notifications
            </Text>
            <Switch
              value={notificationsGlobal}
              onValueChange={handleToggleGlobalNotifications}
              trackColor={{ false: '#D1D5DB', true: colors.primary[300] }}
              thumbColor={notificationsGlobal ? colors.primary[500] : '#F3F4F6'}
              accessibilityLabel="Toggle all notifications"
            />
          </View>

          {/* Per-type toggles (only shown if global is on) */}
          {notificationsGlobal && (
            <View className="mt-1 ml-4 border-l-2 border-gray-100 dark:border-gray-700 pl-3">
              <View className="flex-row items-center justify-between py-2">
                <Text className="text-sm text-text-primary dark:text-text-dark">
                  Feeding Reminders
                </Text>
                <Switch
                  value={notificationSettings.feeding}
                  onValueChange={handleToggleFeedingNotifications}
                  trackColor={{ false: '#D1D5DB', true: colors.primary[300] }}
                  thumbColor={notificationSettings.feeding ? colors.primary[500] : '#F3F4F6'}
                  accessibilityLabel="Toggle feeding notifications"
                />
              </View>
              <View className="flex-row items-center justify-between py-2">
                <Text className="text-sm text-text-primary dark:text-text-dark">
                  Medication Reminders
                </Text>
                <Switch
                  value={notificationSettings.medication}
                  onValueChange={handleToggleMedicationNotifications}
                  trackColor={{ false: '#D1D5DB', true: colors.primary[300] }}
                  thumbColor={notificationSettings.medication ? colors.primary[500] : '#F3F4F6'}
                  accessibilityLabel="Toggle medication notifications"
                />
              </View>
              <View className="flex-row items-center justify-between py-2">
                <Text className="text-sm text-text-primary dark:text-text-dark">
                  Vet Visit Reminders
                </Text>
                <Switch
                  value={notificationSettings.vet}
                  onValueChange={handleToggleVetNotifications}
                  trackColor={{ false: '#D1D5DB', true: colors.primary[300] }}
                  thumbColor={notificationSettings.vet ? colors.primary[500] : '#F3F4F6'}
                  accessibilityLabel="Toggle vet visit notifications"
                />
              </View>
            </View>
          )}
        </Card>

        {/* ── Owner Info ──────────────────────────────────────── */}
        <Card className="mb-4">
          <Text className="text-base font-semibold text-text-primary dark:text-text-dark mb-3">
            Owner Information
          </Text>
          <Text className="text-xs text-muted dark:text-muted-dark mb-3">
            Used in Pet ID cards when not set on individual pets.
          </Text>
          <View className="mb-3">
            <Input
              label="Name"
              value={ownerName}
              onChangeText={setOwnerName}
              placeholder="Your name"
              accessibilityLabel="Owner name"
            />
          </View>
          <Input
            label="Contact"
            value={ownerContact}
            onChangeText={setOwnerContact}
            placeholder="Phone or email"
            accessibilityLabel="Owner contact"
          />
        </Card>

        {/* ── Data Management ─────────────────────────────────── */}
        <Card className="mb-4">
          <View className="flex-row items-center mb-3">
            <Database size={18} color={colors.primary[500]} />
            <Text className="text-base font-semibold text-text-primary dark:text-text-dark ml-2">
              Data Management
            </Text>
          </View>

          <View className="gap-2">
            <Button
              variant="outline"
              size="md"
              onPress={handleExportData}
              loading={isExporting}
              leftIcon={<Download size={16} color={colors.primary[500]} />}
              accessibilityLabel="Export all data"
            >
              Export Data
            </Button>
            <Button
              variant="outline"
              size="md"
              onPress={handleImportData}
              leftIcon={<Upload size={16} color={colors.primary[500]} />}
              accessibilityLabel="Import data"
            >
              Import Data
            </Button>
            <Button
              variant="destructive"
              size="md"
              onPress={handleClearDataPress}
              leftIcon={<Trash2 size={16} color="#FFFFFF" />}
              accessibilityLabel="Clear all data"
            >
              Clear All Data
            </Button>
          </View>
        </Card>

        {/* ── About ───────────────────────────────────────────── */}
        <Card className="mb-4">
          <View className="flex-row items-center mb-3">
            <Info size={18} color={colors.primary[500]} />
            <Text className="text-base font-semibold text-text-primary dark:text-text-dark ml-2">
              About
            </Text>
          </View>

          <View className="gap-2">
            <View className="flex-row justify-between">
              <Text className="text-sm text-muted dark:text-muted-dark">App Version</Text>
              <Text className="text-sm text-text-primary dark:text-text-dark">1.0.0</Text>
            </View>
            <View className="pt-2 border-t border-gray-100 dark:border-gray-700">
              <Text className="text-xs text-muted dark:text-muted-dark text-center">
                All data stored locally on device
              </Text>
              <Text className="text-xs text-muted dark:text-muted-dark text-center mt-1">
                No accounts, no tracking
              </Text>
            </View>
          </View>
        </Card>
      </ScrollView>

      {/* First confirmation: "Are you sure?" */}
      <ConfirmDialog
        visible={showClearDialog}
        title="Clear All Data"
        message="Are you sure you want to delete all your data? This action cannot be undone."
        confirmLabel="Continue"
        cancelLabel="Cancel"
        destructive
        onConfirm={handleClearDialogConfirm}
        onCancel={handleClearDialogCancel}
      />

      {/* Second confirmation: type DELETE */}
      <Modal
        visible={showDeleteConfirm}
        onClose={handleDeleteConfirmCancel}
        title='Type "DELETE" to confirm'
        position="center"
      >
        <Text className="text-sm text-text-secondary dark:text-text-muted text-center mb-4">
          This will permanently remove all pets, health records, and expenses from this device.
        </Text>
        <Input
          value={deleteConfirmText}
          onChangeText={setDeleteConfirmText}
          placeholder="DELETE"
          accessibilityLabel="Type DELETE to confirm"
          accessibilityHint="Type the word DELETE in all caps to confirm data deletion"
          className="mb-4"
        />
        <View className="flex-row gap-3">
          <View className="flex-1">
            <Button
              variant="ghost"
              size="md"
              onPress={handleDeleteConfirmCancel}
              accessibilityLabel="Cancel deletion"
            >
              Cancel
            </Button>
          </View>
          <View className="flex-1">
            <Button
              variant="destructive"
              size="md"
              onPress={handleDeleteConfirm}
              loading={isClearing}
              disabled={deleteConfirmText !== 'DELETE'}
              accessibilityLabel="Confirm delete all data"
            >
              Delete All
            </Button>
          </View>
        </View>
      </Modal>
    </View>
  );
}
