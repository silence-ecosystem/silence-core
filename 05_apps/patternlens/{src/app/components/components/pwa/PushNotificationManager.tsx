'use client';

import { useState, useEffect } from 'react';
import { Bell, BellOff } from 'lucide-react';

export function PushNotificationManager() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
      checkSubscription();
    }
  }, []);

  const checkSubscription = async () => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        setIsSubscribed(!!subscription);
      } catch (error) {
        console.error('Error checking push subscription:', error);
      }
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setPermission(permission);
      
      if (permission === 'granted') {
        await subscribeToPush();
      }
    }
  };

  const subscribeToPush = async () => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      try {
        const registration = await navigator.serviceWorker.ready;
        
        // VAPID public key - do wygenerowania w produkcji
        const vapidPublicKey = 'YOUR_VAPID_PUBLIC_KEY_HERE';
        
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: vapidPublicKey
        });

        // Send subscription to server
        await fetch('/api/push/subscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(subscription)
        });

        setIsSubscribed(true);
        console.log('Push notification subscription successful');
      } catch (error) {
        console.error('Error subscribing to push notifications:', error);
      }
    }
  };

  const unsubscribeFromPush = async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        
        if (subscription) {
          await subscription.unsubscribe();
          
          // Remove subscription from server
          await fetch('/api/push/unsubscribe', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(subscription)
          });
        }
        
        setIsSubscribed(false);
        console.log('Push notification unsubscribed');
      } catch (error) {
        console.error('Error unsubscribing from push notifications:', error);
      }
    }
  };

  if (!('Notification' in window)) {
    return null;
  }

  return (
    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-2">
        {isSubscribed ? (
          <Bell className="w-5 h-5 text-green-600" />
        ) : (
          <BellOff className="w-5 h-5 text-gray-400" />
        )}
        <span className="font-medium">
          Powiadomienia kryzysowe
        </span>
      </div>
      
      <div className="flex-1" />
      
      {permission === 'granted' ? (
        isSubscribed ? (
          <button
            onClick={unsubscribeFromPush}
            className="px-3 py-1.5 bg-red-100 text-red-700 rounded text-sm"
          >
            Wyłącz
          </button>
        ) : (
          <button
            onClick={subscribeToPush}
            className="px-3 py-1.5 bg-green-100 text-green-700 rounded text-sm"
          >
            Włącz
          </button>
        )
      ) : (
        <button
          onClick={requestNotificationPermission}
          className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded text-sm"
        >
          Zezwól
        </button>
      )}
    </div>
  );
}
