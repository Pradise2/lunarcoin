import React, { useState, useEffect } from 'react';
import Footer from '../Component/Footer';
import { addUserToFarm, getUserFromFarm } from '../utils/firestoreFunctions';
import FormattedTime from '../Component/FormattedTime';
import './bg.css';
import { ClipLoader } from 'react-spinners';
import coin from './log.png';
import remove from './remove.png';
import screen from './screen.png';
import coin2 from './logo.png';
import wallet from './wallet.png';
import axios from 'axios';

const Home = () => {
  const [userData, setUserData] = useState(null);
  const [userId, setUserId] = useState('001');
  const [userName, setUserName] = useState(null);
  const [buttonText, setButtonText] = useState("Start");
  const [showRCFarm, setShowRCFarm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Clear local storage when the component mounts
    localStorage.clear();
  }, []);

  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      const { WebApp } = window.Telegram;
      WebApp.expand();
      const user = WebApp.initDataUnsafe?.user;
      if (user) {
        setUserId(user.id);
        setUserName(user.username);
      } else {
        console.error('User data is not available.');
      }
    } else {
      console.error('Telegram WebApp script is not loaded.');
    }
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getUserFromFarm(userId);
        const currentTime = Math.floor(Date.now() / 1000);

        if (data) {
          const elapsed = currentTime - data.LastFarmActiveTime;
          const newFarmTime = data.FarmTime - elapsed;
          if (newFarmTime <= 0) {
            setUserData({
              ...data,
              FarmTime: 0,
              FarmReward: (data.FarmReward || 0) + (data.FarmTime || 0) * 0.1,
              LastFarmActiveTime: currentTime,
            });
            setButtonText("Claim");
          } else {
            setUserData({
              ...data,
              FarmTime: newFarmTime,
              FarmReward: (data.FarmReward || 0) + (elapsed || 0) * 0.1,
              LastFarmActiveTime: currentTime,
            });
            setButtonText("Farming...");
          }
        } else {
          const initialData = {
            FarmBalance: 0,
            FarmTime: 14400,
            FarmReward: 0,
            LastFarmActiveTime: currentTime,
          };
          await addUserToFarm(userId, initialData);
          setUserData(initialData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  useEffect(() => {
    let interval;
    if (buttonText === "Farming...") {
      interval = setInterval(() => {
        if (userData) {
          const currentTime = Math.floor(Date.now() / 1000);
          const elapsed = currentTime - userData.LastFarmActiveTime;
          const newFarmTime = userData.FarmTime - elapsed;
          if (newFarmTime <= 0) {
            setUserData((prevState) => ({
              ...prevState,
              FarmTime: 0,
              FarmReward: (prevState.FarmReward || 0) + (prevState.FarmTime || 0) * 0.1,
              LastFarmActiveTime: currentTime,
            }));
            setButtonText("Claim");
          } else {
            setUserData((prevState) => ({
              ...prevState,
              FarmTime: newFarmTime,
              FarmReward: (prevState.FarmReward || 0) + (elapsed || 0) * 0.1,
              LastFarmActiveTime: currentTime,
            }));
          }
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [buttonText, userData]);

  useEffect(() => {
    const saveUserData = async () => {
      if (userId && userData) {
        await addUserToFarm(userId, userData);
      }
    };

    const handleBeforeUnload = (e) => {
      saveUserData();
      e.preventDefault();
      e.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    const saveInterval = setInterval(saveUserData, 10000);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      clearInterval(saveInterval);
      saveUserData();
    };
  }, [userId, userData]);

  const handleButtonClick = async () => {
    if (buttonText === "Start") {
      setButtonText("Farming...");
      setUserData((prevState) => ({
        ...prevState,
        LastFarmActiveTime: Math.floor(Date.now() / 1000),
      }));
    } else if (buttonText === "Claim") {
      if (userData?.FarmReward > 0) {
        if (navigator.vibrate) {
          navigator.vibrate(500); // Vibrate for 500ms
        }
        const newFarmBalance = (userData.FarmBalance || 0) + (userData.FarmReward || 0);
         
        try {
          const newUserData = {
            ...userData,
            FarmBalance: newFarmBalance,
            FarmReward: 0,
            FarmTime: 14400,
          };
          await addUserToFarm(userId, newUserData);
          setUserData(newUserData);
          setShowRCFarm(true);
          setTimeout(() => setShowRCFarm(false), 2000);
          setButtonText("Start");
        } catch (error) {
          console.error('Error claiming reward:', error);
        }
        try {
          await axios.put('https://lunarapp.thelunarcoin.com/backend/api/farm/userbackup', {
            userId,
            initialFarmBalance: newFarmBalance,
          });
          console.log('specialBalance:', newFarmBalance);
        } catch (error) {
          console.error('Error performing user backup:', error);
          
        }
      }
    };
  }

  if (loading) {
    return (
      <div
        className="relative min-h-screen bg-black bg-blur-sm bg-don bg-center bg-no-repeat text-white flex items-center justify-center p-4 space-y-4"
      >
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div 
          className="absolute transform -translate-y-1/2 top-1/2 flex justify-center items-center"
          style={{ top: '50%' }}
        >
          <ClipLoader 
          color="#FFD700" 
          size={100} 
          speedMultiplier={1} />
        </div>
      </div>
    );
  }
  
  
  const isValidNumber = (value) => typeof value === 'number' && !isNaN(value);

  return (
    <div className="relative min-h-screen bg-black bg-screen bg-no-repeat bg-contain bg-center flex flex-col items-center justify-center">
      <div className="flex flex-col items-center">
        <ClipLoader color="#FFD700" size={100} speedMultiplier={1} />
      </div>
      <div className="w-full max-w-md rounded-3xl bg-darkGray fixed bottom-0 left-0 flex justify-around py-1">
        <Footer />
      </div>
    </div>
  );
  
};

export default Home;
