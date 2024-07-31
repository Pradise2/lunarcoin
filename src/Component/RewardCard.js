import React, { useState, useEffect } from 'react';
import { getUserFromHome } from '../utils/firestoreFunctions';

const RewardCard = () => {
  const [userData, setUserData] = useState(null);
  const [userId, setUserId] = useState("743737380");
  
  useEffect(() => {
    // Check if Telegram WebApp is available
    if (window.Telegram && window.Telegram.WebApp) {
      const { WebApp } = window.Telegram;
      
      // Expand the WebApp
      WebApp.expand();
  
      const user = WebApp.initDataUnsafe?.user;
      if (user) {
        setUserId(user.id);
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
        const data = await getUserFromHome(userId);
        if (data) {
          setUserData(data);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [userId]);

  return (
    <div className="flex max-w-md items-center justify-center w-full min-h-screen backdrop-blur-sm">
      <div className="bg-zinc-800 text-white rounded-xl p-6 shadow-lg w-80">
        <div className="flex flex-col items-center">
          <div className="bg-green-500 rounded-full p-2 mb-4">
            <img aria-hidden="true" alt="checkmark" src="https://openui.fly.dev/openui/24x24.svg?text=✔️" />
          </div>
          <h2 className="text-lg font-semibold mb-2">Well done explorer!</h2>
          <p className="text-4xl font-medium text-white mb-2">+{userData?.TapClaim.toLocaleString()} <span className="text-golden-moon">LAR</span></p>
          <p className="text-center text-gray-300 mb-4">Never stop tapping, never stop building
          Get more LAR, grow your colony.</p>
          <button className="bg-transparent border border-white text-white px-4 py-2 rounded-full hover:bg-white hover:text-zinc-500 transition-colors">
            Morrrre!
          </button>
        </div>
      </div>
    </div>
  );
};

export default RewardCard;
