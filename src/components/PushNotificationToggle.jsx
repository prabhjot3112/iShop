import React, { useEffect, useState } from 'react';

const PushNotificationToggle = () => {
  const [permission, setPermission] = useState(Notification.permission);
  const [isSubscribed, setIsSubscribed] = useState(false); // 🔍 Track if user is registered in DB
  const isLoggedIn = !!localStorage.getItem('token');
  const userType = localStorage.getItem('userType');

  useEffect(() => {
    const checkSubscriptionStatus = async () => {
      const token = localStorage.getItem('token');

      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/notifications/check/${userType === 'buyer' ? 'buyer' : 'vendor'}`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});


        const data = await res.json();
        setIsSubscribed(data.isSubscribed); // Backend should return { isSubscribed: true/false }
      } catch (error) {
        console.error('Failed to check subscription status:', error);
      }

      setPermission(Notification.permission);
    };

    if (isLoggedIn) {
      checkSubscriptionStatus();
    }
  }, [isLoggedIn, userType]);

  // ...subscribeUserToPush and handleDisable remain unchanged

  const subscribeUserToPush = async () => {
    if (!('serviceWorker' in navigator)) {
      alert("Push notifications are not supported in your browser.");
      return;
    }

    const permissionResult = await Notification.requestPermission();

    if (permissionResult !== 'granted') {
      alert('You denied notification permission.');
      setPermission(permissionResult);
      return;
    }

    const registration = await navigator.serviceWorker.ready;

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: import.meta.env.VITE_VAPID_PUBLIC_KEY,
    });

    const token = localStorage.getItem("token");
    await fetch(`${import.meta.env.VITE_API_URL}/notifications/subscribe/${userType === 'buyer' ? 'buyer' : 'vendor'}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(subscription),
    });

    setPermission('granted');
    setIsSubscribed(true); // ✅ Update local state
    alert('Notifications enabled ✅');
  };

  const handleDisable = async () => {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      await subscription.unsubscribe();

      const token = localStorage.getItem("token");
      await fetch(`${import.meta.env.VITE_API_URL}/notifications/unsubscribe/${userType === 'buyer' ? 'buyer' : 'vendor'}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ endpoint: subscription.endpoint }),
      });

      alert('Notifications disabled ❌');
    }

    setIsSubscribed(false);
    setPermission('default');
  };

  return (
    <div className='mb-4'>
      {isLoggedIn && (
        <>
          {permission === 'granted' && isSubscribed ? (
            <button
              onClick={handleDisable}
              className='py-1 px-2 bg-red-400 text-white rounded hover:bg-red-500'
            >
              Disable Push Notifications
            </button>
          ) : (
            <button
              onClick={subscribeUserToPush}
              className='py-1 px-3 bg-yellow-300 rounded hover:bg-yellow-400'
            >
              Enable Push Notifications
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default PushNotificationToggle;
