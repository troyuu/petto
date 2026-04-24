import notifee, {
  AndroidImportance,
  RepeatFrequency,
  TriggerType,
  type TimestampTrigger,
} from '@notifee/react-native';
import { Platform } from 'react-native';

const CHANNEL_IDS = {
  feeding: 'petto-feeding',
  medication: 'petto-medication',
  vet: 'petto-vet',
  general: 'petto-general',
} as const;

export async function setupNotificationChannels(): Promise<void> {
  if (Platform.OS !== 'android') return;

  await notifee.createChannel({
    id: CHANNEL_IDS.feeding,
    name: 'Feeding Reminders',
    importance: AndroidImportance.HIGH,
  });

  await notifee.createChannel({
    id: CHANNEL_IDS.medication,
    name: 'Medication Reminders',
    importance: AndroidImportance.HIGH,
  });

  await notifee.createChannel({
    id: CHANNEL_IDS.vet,
    name: 'Vet Visit Reminders',
    importance: AndroidImportance.HIGH,
  });

  await notifee.createChannel({
    id: CHANNEL_IDS.general,
    name: 'General Reminders',
    importance: AndroidImportance.DEFAULT,
  });
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS === 'ios') {
    const settings = await notifee.requestPermission();
    return settings.authorizationStatus >= 1;
  }
  return true;
}

export async function scheduleFeedingReminder(
  petName: string,
  hour: number,
  minute: number,
): Promise<string> {
  const now = new Date();
  const triggerDate = new Date();
  triggerDate.setHours(hour, minute, 0, 0);

  if (triggerDate.getTime() <= now.getTime()) {
    triggerDate.setDate(triggerDate.getDate() + 1);
  }

  const trigger: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: triggerDate.getTime(),
    repeatFrequency: RepeatFrequency.DAILY,
  };

  const notificationId = await notifee.createTriggerNotification(
    {
      title: 'Feeding Time',
      body: `Time to feed ${petName}!`,
      android: {
        channelId: CHANNEL_IDS.feeding,
        pressAction: { id: 'default' },
      },
    },
    trigger,
  );

  return notificationId;
}

export async function scheduleMedicationReminder(
  petName: string,
  medicationName: string,
  scheduledAt: Date,
  repeatFrequency?: RepeatFrequency,
): Promise<string> {
  const trigger: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: scheduledAt.getTime(),
    repeatFrequency,
  };

  const notificationId = await notifee.createTriggerNotification(
    {
      title: 'Medication Reminder',
      body: `Give ${petName} their ${medicationName}`,
      android: {
        channelId: CHANNEL_IDS.medication,
        pressAction: { id: 'default' },
      },
    },
    trigger,
  );

  return notificationId;
}

export async function scheduleVetVisitReminder(
  petName: string,
  clinicName: string | null,
  visitDate: Date,
  daysBefore: number = 1,
): Promise<string> {
  const reminderDate = new Date(visitDate);
  reminderDate.setDate(reminderDate.getDate() - daysBefore);
  reminderDate.setHours(9, 0, 0, 0);

  const trigger: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: reminderDate.getTime(),
  };

  const clinicText = clinicName ? ` at ${clinicName}` : '';
  const notificationId = await notifee.createTriggerNotification(
    {
      title: 'Vet Visit Reminder',
      body: `${petName} has a vet visit${clinicText} ${daysBefore === 0 ? 'today' : 'tomorrow'}`,
      android: {
        channelId: CHANNEL_IDS.vet,
        pressAction: { id: 'default' },
      },
    },
    trigger,
  );

  return notificationId;
}

export async function cancelNotification(notifeeId: string): Promise<void> {
  await notifee.cancelNotification(notifeeId);
}

export async function cancelAllNotifications(): Promise<void> {
  await notifee.cancelAllNotifications();
}
