import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Linking, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';

import { registerForPushNotificationsAsync } from '@/utils/registerForPushNotificationsAsync';
import { useAuthStore } from '@/store/auth-store';
import { notificationApi } from '@/lib/api/notification';
import { useNotificationStore } from '@/store/notification-store';

type PermissionState = 'unknown' | 'granted' | 'denied' | 'blocked';

interface NotificationContextType {
  fcmToken: string | null;
  lastNotification: Notifications.Notification | null;
  lastRemoteMessage: FirebaseMessagingTypes.RemoteMessage | null;
  permission: PermissionState;
  error: Error | null;
  openSettings: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

export function useNotification() {
  const ctx = useContext(NotificationContext);
  if (!ctx)
    throw new Error('useNotification must be used within NotificationProvider');
  return ctx;
}

// Show notifications while app is foregrounded (expo-notifications)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

function getPlatform(): 'android' | 'ios' | 'web' {
  if (Platform.OS === 'ios') return 'ios';
  if (Platform.OS === 'android') return 'android';
  return 'web';
}

async function ensureFcmPermission(): Promise<PermissionState> {
  // iOS needs explicit permission. Android 13+ also needs runtime permission.
  try {
    const current = await messaging().hasPermission();

    const isGranted =
      current === messaging.AuthorizationStatus.AUTHORIZED ||
      current === messaging.AuthorizationStatus.PROVISIONAL;

    if (isGranted) return 'granted';

    const requested = await messaging().requestPermission();
    const granted =
      requested === messaging.AuthorizationStatus.AUTHORIZED ||
      requested === messaging.AuthorizationStatus.PROVISIONAL;

    return granted ? 'granted' : 'denied';
  } catch {
    // If request permission throws, treat as blocked
    return 'blocked';
  }
}

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [permission, setPermission] = useState<PermissionState>('unknown');
  const [error, setError] = useState<Error | null>(null);
  const [lastNotification, setLastNotification] =
    useState<Notifications.Notification | null>(null);
  const [lastRemoteMessage, setLastRemoteMessage] =
    useState<FirebaseMessagingTypes.RemoteMessage | null>(null);

  const { isAuthenticated, accessToken } = useAuthStore();
  const { fcmToken, setFcmToken } = useNotificationStore();

  const registeredRef = useRef<string | null>(null);
  const inFlightRegisterRef = useRef<Promise<void> | null>(null);

  console.log({ fcmToken });

  const openSettings = () => {
    Linking.openSettings().catch(() => {});
  };

  // 1) Permission + token bootstrap
  useEffect(() => {
    let unsubTokenRefresh: (() => void) | undefined;
    let unsubOnMessage: (() => void) | undefined;
    let notifSub: Notifications.Subscription | undefined;
    let respSub: Notifications.Subscription | undefined;
    let cancelled = false;

    const init = async () => {
      try {
        // Permission for OS presentation + Android channel
        await registerForPushNotificationsAsync();

        // Permission for FCM (iOS + Android 13+)
        const perm = await ensureFcmPermission();
        if (cancelled) return;
        setPermission(perm);

        if (perm !== 'granted') return;

        // Get FCM token
        const token = await messaging().getToken();
        if (cancelled) return;
        setFcmToken(token);

        // Token refresh
        unsubTokenRefresh = messaging().onTokenRefresh((newToken) => {
          setFcmToken(newToken);
        });

        // Foreground messages: show local notification + keep lastRemoteMessage
        unsubOnMessage = messaging().onMessage(async (remoteMessage) => {
          setLastRemoteMessage(remoteMessage);

          const title = remoteMessage.notification?.title ?? 'Notification';
          const body = remoteMessage.notification?.body ?? '';

          // Show local notification in foreground (Android/iOS)
          await Notifications.scheduleNotificationAsync({
            content: {
              title,
              body,
              data: remoteMessage.data,
            },
            trigger: null,
          });
        });

        // expo-notifications listeners (when notification is received / tapped)
        notifSub = Notifications.addNotificationReceivedListener((n) => {
          setLastNotification(n);
        });

        respSub = Notifications.addNotificationResponseReceivedListener(
          (_r) => {
            // You can route based on _r.notification.request.content.data if needed
          },
        );
      } catch (e) {
        if (!cancelled) setError(e as Error);
      }
    };

    init();

    return () => {
      cancelled = true;
      unsubTokenRefresh?.();
      unsubOnMessage?.();
      notifSub?.remove();
      respSub?.remove();
    };
  }, [setFcmToken]);

  // 2) Register device token with backend when user is logged in
  useEffect(() => {
    const canRegister = Boolean(isAuthenticated && accessToken && fcmToken);
    if (!canRegister) return;

    // Avoid duplicate register calls for same token
    if (registeredRef.current === fcmToken) return;

    if (!inFlightRegisterRef.current) {
      inFlightRegisterRef.current = (async () => {
        try {
          await notificationApi.registerDevice({
            fcmToken: fcmToken!,
            platform: getPlatform(),
          });
          registeredRef.current = fcmToken!;
        } catch (e) {
          setError(e as Error);
        } finally {
          inFlightRegisterRef.current = null;
        }
      })();
    }
  }, [isAuthenticated, accessToken, fcmToken]);

  // 3) If permission is blocked/denied, surface a helpful error once
  useEffect(() => {
    if (permission === 'denied') {
      setError(
        new Error(
          'Notifications permission denied. Enable it in Settings to receive notifications.',
        ),
      );
    }
    if (permission === 'blocked') {
      setError(
        new Error(
          'Notifications permission blocked. Enable it in Settings to receive notifications.',
        ),
      );
    }
  }, [permission]);

  const value = useMemo<NotificationContextType>(
    () => ({
      fcmToken,
      lastNotification,
      lastRemoteMessage,
      permission,
      error,
      openSettings,
    }),
    [fcmToken, lastNotification, lastRemoteMessage, permission, error],
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}
