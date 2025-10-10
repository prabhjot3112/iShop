import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useUser } from '../context/UserContext';
import { useRef } from 'react';

const PushNotificationToggle = ({userType , isLoggedIn , hasChecked}) => {
  const [permission, setPermission] = useState(Notification.permission);
  const [isSubscribed, setIsSubscribed] = useState(false); // 🔍 Track if user is registered in DB
  
  const [isLoading, setIsLoading] = useState(false)
  const {user} = useUser()


  useEffect(() => {


  if (!user?.id || hasChecked.current) return;

    const checkSubscriptionStatus = async () => {
      setIsLoading(true)
      const token = localStorage.getItem('token');

      try {
        const {data} = await axios.get(`${import.meta.env.VITE_API_URL}/notifications/check/${userType === 'buyer' ? 'buyer' : 'vendor'}`, {
          headers:{
            Authorization:`Bearer ${token}`
          }
        })
        setIsSubscribed(data.isSubscribed); // Backend should return { isSubscribed: true/false }
      hasChecked.current = true;

        console.log('isSubscribed:',isSubscribed)
      } catch (error) {
      hasChecked.current = true;
      toast.error(error.response.data.error)
        console.error('Failed to check subscription status:', error);
      }finally{
              setIsLoading(false);
      setPermission(Notification.permission);
      }

      setPermission(Notification.permission);
    };

    if (user != null) {
      checkSubscriptionStatus();
    }
  }, [user?.id]);

  const subscribeUserToPush = async () => {
    setIsLoading(true);
    if (!('serviceWorker' in navigator)) {
      toast.info("Push notifications are not supported in your browser.");
      return;
    }

    const permissionResult = await Notification.requestPermission();

    if (permissionResult !== 'granted') {
      toast.info("You denied notification permission!")
      setPermission(permissionResult);
      return;
    }

    const registration = await navigator.serviceWorker.ready;

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: import.meta.env.VITE_VAPID_PUBLIC_KEY,
    });
const token = localStorage.getItem("token");
 const p256dh = btoa(String.fromCharCode(...new Uint8Array(subscription.getKey('p256dh'))));
    const auth = btoa(String.fromCharCode(...new Uint8Array(subscription.getKey('auth'))));


try {
  console.log('keys 1 is:',p256dh)
  console.log('keys 2: ' , auth)
  await axios.post(`${import.meta.env.VITE_API_URL}/notifications/subscribe/${userType === 'buyer' ? 'buyer' : 'vendor'}`, {
    endpoint: subscription.endpoint ,   keys: {
        p256dh,
        auth,
      },
  },{
    headers:{
      Authorization:`Bearer ${token}`
    }
  });
   setPermission('granted');
    setIsSubscribed(true); // ✅ Update local state
    toast.success('Notifications enabled ✅');
} catch (error) {
  toast.error(error.response.data.error)
  console.error('Subscription request failed:', error);
} finally {
  setIsLoading(false);
}


   
  };

  const handleDisable = async () => {
    setIsLoading(true)
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      await subscription.unsubscribe();

      const token = localStorage.getItem("token");
      try{

        await axios.post(`${import.meta.env.VITE_API_URL}/notifications/unsubscribe/${userType === 'buyer' ? 'buyer' : 'vendor'}`,{
          endpoint:subscription.endpoint
        },{
          headers:{
            Authorization:`Bearer ${token}`
          }
        });
        
        
        toast.success('Notifications disabled ❌');
      }catch(e){
        toast.error(e.response.data.error)
      }finally{
        setIsSubscribed(false);
        setIsLoading(false)
        setPermission('default');
      }
    }

  };

  return (
    <div className='mb-4'>
      {isLoggedIn && (
        <>
          {permission === 'granted' && isSubscribed ? (
           <button
  onClick={handleDisable}
  className="flex items-center justify-center gap-2 py-1 px-3 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
  disabled={isLoading}
>
  {isLoading ? (
    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
  ) : (
    'Disable Push Notifications'
  )}
</button>

          ) : (
           <button
  onClick={subscribeUserToPush}
  className="flex items-center justify-center gap-2 py-1 px-3 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed"
  disabled={isLoading}
>
  {isLoading ? (
    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
  ) : (
    'Enable Push Notifications'
  )}
</button>

          )}
        </>
      )}
    </div>
  );
};

export default PushNotificationToggle;
