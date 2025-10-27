import React from 'react'
import Header from '../components/Header'
import { useEffect } from 'react'
import { useNotificationContext } from '../context/NotificationContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { FaBackward, FaEdit, FaPen, FaTrash } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
const BASE_URL = import.meta.env.VITE_API_URL;

const Notifications = () => {

    const context = useNotificationContext()
    const [notiDelLoading, setNotiDelLoading] = useState({id:null , isTrue:false})
    const deleteNotification = async (index) => {
  try {
    setNotiDelLoading({ id: index, isTrue: true });
    const token = localStorage.getItem("token");
    const userType = localStorage.getItem("userType");

    const { data } = await axios.delete(
      `${BASE_URL}/notifications/delete/${userType}/${index}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    // Update context with new messages
    context.setNotifications(data.messages);
    toast.success("Notification deleted!");
  } catch (error) {
    toast.error(error.response?.data?.error || "Failed to delete");
  } finally {
    setNotiDelLoading({ id: null, isTrue: false });
  }
};

    useEffect(() => {
      console.log('context is:' , context)
      const token = localStorage.getItem('token')
        const apiCall = async() => {
            try {
                const {data} = await axios.get(`${BASE_URL}/notifications/noti/${localStorage.getItem('userType') == 'vendor' ? 'vendor' : 'buyer'}` , 
            {
                headers:{
                    Authorization:`Bearer ${token}`
                }
            }
            )
            console.log('data is:',data)
            // console.log('notifications are:',data.notifications[0])
            context.setNotifications(data.messages)
            } catch (error) {
             toast.error(error.response.data.error || error.response.data.message)   
            }
            finally{
                setTimeout(() => {
                    console.log('context notifications are:',context.notifications)
                }, 3000);
                context.setIsLoading(false)
            }
        }
        apiCall()
      return () => {
        
      }
    }, [])
    const navigate = useNavigate()
    
  return (
    <div>
        <Header />
     {   <div className='mt-5 py-2 px-3 max-w-5xl mx-auto'>
            <button className='mb-5 cursor-pointer p-2 border border-black rounded' onClick={() => navigate(-1)}><FaBackward /></button>
            <h1 className='text-left text-2xl font-black'>Notifications</h1>
        
{
  context.isLoading ? (
    <div className="w-full flex justify-center items-center">
      <div className="rounded-full h-14 w-14 animate-spin border-2 mt-5 border-t-transparent border-blue-700"></div>
    </div>
  ) : (
    <div className="mt-5">
      {context.notifications && context.notifications.length > 0 ? (
        context.notifications
          .slice() // avoid mutating original
          .reverse()
          .map((notification, id) => (
            <div
              key={id}
              className="bg-white flex justify-between shadow-md rounded-lg p-4 mb-2 hover:bg-gray-50 transition-colors duration-200"
            >
              <p className={`${notification.includes('Enjoy') ? 'text-green-900' : notification.includes('out for delivery') ? 'text-blue-600' : notification.includes('on its way') ? 'text-yellow-700' :  notification.includes('cancelled')  ? 'text-red-700' : 'text-black'}`}>{notification}</p>
              <button onClick={() => deleteNotification(id)}>
                {notiDelLoading.id === id && notiDelLoading.isTrue ? (
                  <div className="mx-auto w-6 h-6 border-black border-2 rounded-full animate-spin border-t-transparent"></div>
                ) : (
                  <FaTrash color="red" />
                )}
              </button>
            </div>
          ))
      ) : (
        <div className="text-gray-500 text-left py-10 italic">
          No Notifications
        </div>
      )}
    </div>
  )
}

                </div>
            }
        </div>
            
  )
}

export default Notifications