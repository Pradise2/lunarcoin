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
  const [userId, setUserId] = useState(null); 
  const [userName, setUserName] = useState(null);
  const [buttonText, setButtonText] = useState("Start");
  const [showRCFarm, setShowRCFarm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [identity, setIdentity] = useState(null);
  const [all, setAll] = useState([]);
  const [error, setError] = useState(null);

   const prefix = "local";
  const [dynamicVariables, setDynamicVariables] = useState({});

  useEffect(() => {
    
    if (window.Telegram && window.Telegram.WebApp) {
      const { WebApp } = window.Telegram;
      WebApp.expand();
      const user = WebApp.initDataUnsafe?.user;
      if (user) {
        setUserId(JSON.stringify(user.id));
        setIdentity(user.id)
        setUserName(user.username);
        localStorage.setItem('localUserId', JSON.stringify(user.id));
        
      } else {
        console.error('User data is not available.');
      }
    } else {
      console.error('Telegram WebApp script is not loaded.');
    }
  }, []);

 
  useEffect(() => { 
    const fetchAllData = async () => {
      try {
        const response = await axios.get(`https://lunarapp.thelunarcoin.com/backend/api/getuserbackup/${userId}`);
        const all = response.data;
        
        // Calculate Balance
        const dailyBalance = parseFloat(all.dailyBalance);
        const specialBalance = parseFloat(all.specialBalance);
        const initialFarmBalance = parseFloat(all.initialFarmBalance);
        const farmClaimCount = parseInt(all.farmClaimCount);
  
        const balance = dailyBalance + specialBalance + initialFarmBalance + (farmClaimCount * 14400);
        setAll({ ...all, balance });
  
        console.log('Fetched all data:', { ...all, balance });
      } catch (error) {
        console.error('Error fetching all data:', error.message);
        setError(`Failed to fetch data: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
  
    if (userId) {
      setLoading(true);
      fetchAllData();
    }
  }, [userId]);
  

  useEffect(() => {
      const fetchUserData = async () => {
      const variableName = `${prefix}${userId}`;
     try {
         setLoading(true);
        let data = null;
        const localData = localStorage.getItem(variableName);
        console.log('this is local data '+ localData);

        if (localData) {
          data = JSON.parse(localData);
        } else {
          data = await getUserFromFarm(userId);
        }

        const currentTime = Math.floor(Date.now() / 1000);

        if (data) {
          const elapsed = currentTime - data.LastFarmActiveTime;
          const newFarmTime = data.FarmTime - elapsed;
          console.log('this is last active time '+ data.LastFarmActiveTime);
          console.log('this is current time '+ currentTime);
          console.log('this is farm time '+ data.FarmTime);
          console.log('this is farm status '+ data.FarmStatus);

          if ( data.FarmStatus !== 'farming') {
            if (newFarmTime <= 0 ){
              data = {
                ...data,
                FarmTime: 0,
                FarmReward: (Number(data.FarmReward) || 0) + (Number(data.FarmTime) || 0) * 0.1,
                LastFarmActiveTime: currentTime,
              };
              setButtonText("Claim");
            }
            else{
              data = {
                ...data,
                FarmBalance: data.FarmBalance,
                FarmReward: 0,
                FarmStatus: 'start',
                FarmTime: 14400,
                
              };
          
              setButtonText("Start");
            }
           
          }
          else {
            data = {
              ...data,
              UserId:userId,
              FarmTime: newFarmTime,
              FarmReward: (Number(data.FarmReward) || 0) + (Number(elapsed) || 0) * 0.1,
              LastFarmActiveTime: currentTime,
            };
            setButtonText("Farming...");
          }
          setUserData(data);
        } else {
          const initialData = {
            UserId:userId,
            FarmBalance: 0,
            FarmTime: 14400,
            FarmReward: 0,
            LastFarmActiveTime: currentTime,
            StartFarmTime: currentTime,
          };
          await addUserToFarm(userId, initialData);
          setUserData(initialData);
        }
        setDynamicVariables(prevVariables => ({
          ...prevVariables,
          [variableName]: JSON.stringify(data)
        }));
        localStorage.setItem('localUserId', JSON.stringify(userId));

        localStorage.setItem(variableName, JSON.stringify(data));
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
       if (userData) {
          const currentTime = Math.floor(Date.now() / 1000);
          const elapsed = currentTime - userData.LastFarmActiveTime;
          const newFarmTime = userData.FarmTime - elapsed;
          
          if (newFarmTime <= 0) {
            setUserData((prevState) => ({
              ...prevState,
              FarmTime: 0,
              FarmReward: (Number(prevState.FarmReward) || 0) + (Number(prevState.FarmTime) || 0) * 0.1,
              LastFarmActiveTime: currentTime,
            }));
            setButtonText("Claim");
          } else {
            setUserData((prevState) => ({
              ...prevState,
              FarmTime: newFarmTime,
              FarmReward: (Number(prevState.FarmReward) || 0) + (Number(elapsed) || 0) * 0.1,
              LastFarmActiveTime: currentTime,
            }));
          } 
        }
    
    }

  }, [buttonText, userData]);

  useEffect(() => {
    const saveUserData = async () => {
      if (userId && userData) {
        const variableName = `${prefix}${userId}`;

        localStorage.setItem('localUserId', JSON.stringify(userId));

        localStorage.setItem(variableName, JSON.stringify(userData));
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
        FarmStatus: 'farming',
        LastFarmActiveTime: Math.floor(Date.now() / 1000),
      }));
    } else if (buttonText === "Claim") {
      if (userData?.FarmReward > 0) {
        if (navigator.vibrate) {
          navigator.vibrate(500);
        }
        try {
          const newFarmBalance = (Number(Math.round(userData.FarmBalance)) || 0) + (Number(Math.round(userData.FarmReward)) || 0);
          const newUserData = {
            ...userData,
            UserId:userId,
            FarmBalance: newFarmBalance,
            FarmReward: 0,
            FarmStatus: 'start',
            FarmTime: 14400,
          };
          const variableName = `${prefix}${userId}`;
          await addUserToFarm(userId, newUserData);
          setUserData(newUserData);
          setShowRCFarm(true);
          setTimeout(() => setShowRCFarm(false), 2000);
          setButtonText("Start");
          localStorage.setItem('localUserId', JSON.stringify(userId));

          localStorage.setItem(variableName, JSON.stringify(newUserData));
        } catch (error) {
          console.error('Error claiming reward:', error);
        }
      }
    }
  };

 

  if (loading ) {
    return (
      <div
        className="relative min-h-screen bg-black bg-screen bg-no-repeat bg-contain bg-center flex items-center justify-center"
      >
        <div 
          className="absolute transform -translate-y-1/2 top-1/2 flex justify-center items-center"
          style={{ top: '50%' }}
        >
          
          
        </div>
      </div>
    );
  }

  const isValidNumber = (value) => typeof value === 'number' && !isNaN(value);

  
  const total = ((all?.balance || 0) + (userData && isValidNumber(userData.FarmBalance) ? Math.round(userData.FarmBalance) : 0)).toLocaleString();

  return (
    <div className="relative min-h-screen bg-black bg-screen bg-no-repeat bg-contain bg-center flex flex-col items-center justify-center">
      
      
    </div>
  );
  
};

export default Home;
