import { create } from 'zustand';

interface NotificationState {
  fcmToken: string | null;
}

interface NotificationActions {
  setFcmToken: (token: string | null) => void;
  clear: () => void;
}

type NotificationStore = NotificationState & NotificationActions;

export const useNotificationStore = create<NotificationStore>((set) => ({
  fcmToken: null,
  setFcmToken: (token) => set({ fcmToken: token }),
  clear: () => set({ fcmToken: null }),
}));

