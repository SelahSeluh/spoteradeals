// Web Push API Client Service for Spotera Deals UAE

export interface PushStatus {
  isSupported: boolean;
  permission: NotificationPermission;
  isSubscribed: boolean;
  subscription: PushSubscription | null;
}

// Convert urlBase64 to Uint8Array for applicationServerKey
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export class PushService {
  public static isSupported(): boolean {
    return (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      'PushManager' in window &&
      'Notification' in window
    );
  }

  public static async getStatus(): Promise<PushStatus> {
    if (!this.isSupported()) {
      return {
        isSupported: false,
        permission: 'default',
        isSubscribed: false,
        subscription: null,
      };
    }

    const permission = Notification.permission;
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      return {
        isSupported: true,
        permission,
        isSubscribed: !!sub,
        subscription: sub,
      };
    } catch {
      return {
        isSupported: true,
        permission,
        isSubscribed: false,
        subscription: null,
      };
    }
  }

  public static async subscribe(options?: {
    emirate?: string;
    userId?: string;
    userEmail?: string;
  }): Promise<{ success: boolean; message: string }> {
    if (!this.isSupported()) {
      return { success: false, message: 'Web Push is not supported on this browser/device.' };
    }

    try {
      // 1. Request user permission
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        return { success: false, message: 'Push notification permission was denied or dismissed.' };
      }

      // 2. Fetch public VAPID key from backend
      let vapidPublicKey = 'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSPOeWfNBxeQmA09Nd_0061xeS2JeAZ64CXk';
      try {
        const keyRes = await fetch('/api/push/public-key');
        if (keyRes.ok) {
          const keyData = await keyRes.json();
          if (keyData.publicKey) {
            vapidPublicKey = keyData.publicKey;
          }
        }
      } catch {
        // Fallback to default public key
      }

      // 3. Register service worker if needed
      let reg: ServiceWorkerRegistration;
      if (navigator.serviceWorker.controller) {
        reg = await navigator.serviceWorker.ready;
      } else {
        reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
        await navigator.serviceWorker.ready;
      }

      // 4. Subscribe with PushManager
      const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);
      let sub = await reg.pushManager.getSubscription();
      if (!sub) {
        sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedVapidKey,
        });
      }

      // 5. Send subscription to server
      const p256dh = sub.getKey('p256dh');
      const auth = sub.getKey('auth');

      const subData = {
        endpoint: sub.endpoint,
        keys: {
          p256dh: p256dh ? btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(p256dh)))) : '',
          auth: auth ? btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(auth)))) : '',
        },
      };

      const res = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscription: subData,
          emirate: options?.emirate || 'all',
          userId: options?.userId,
          userEmail: options?.userEmail,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to register subscription on server');
      }

      // Optional: Trigger a welcome notification
      if ('showNotification' in reg) {
        reg.showNotification('Spotera Deals Alerts Active 🔔', {
          body: `You will now receive instant alerts for exclusive family offers and expiring passes in ${options?.emirate ? options.emirate.toUpperCase() : 'the UAE'}!`,
          icon: '/spotera-logo.png',
          badge: '/spotera-logo.png',
        });
      }

      return { success: true, message: 'Web Push alerts enabled successfully!' };
    } catch (err: any) {
      console.error('Push subscription failed:', err);
      return { success: false, message: err.message || 'Failed to enable notifications.' };
    }
  }

  public static async unsubscribe(): Promise<{ success: boolean; message: string }> {
    if (!this.isSupported()) {
      return { success: true, message: 'Not supported' };
    }

    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        const endpoint = sub.endpoint;
        await sub.unsubscribe();
        await fetch('/api/push/unsubscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ endpoint }),
        }).catch(() => {});
      }
      return { success: true, message: 'Push notifications disabled.' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Failed to unsubscribe.' };
    }
  }
}
