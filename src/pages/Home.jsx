import React from 'react'
import { useEffect } from 'react';

const apiUrl = import.meta.env.VITE_API_URL;
const Home = () => {
    useEffect(() => {
      console.log(apiUrl);
        
      return () => {
        
      }
    }, [])
    
  return (
    <div>Home</div>
  )
}

export default Home