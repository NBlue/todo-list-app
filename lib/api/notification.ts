import apiClient from './axios';

type DevicePlatform = 'android' | 'ios' | 'web';

interface RegisterDevicePayload {
  fcmToken: string;
  platform: DevicePlatform;
  deviceId?: string;
}

export const notificationApi = {
  registerDevice: async (data: RegisterDevicePayload) => {
    await apiClient.post('/notification/device/register', data);
  },

  unregisterDevice: async (fcmToken: string) => {
    await apiClient.post('/notification/device/unregister', { fcmToken });
  },
};
