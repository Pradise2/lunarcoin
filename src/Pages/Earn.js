import React, { useState, useEffect } from 'react';
import './bgvh.css';
import Footer from '../Component/Footer';
import logo from './logo.png';
import gift from './gift.png';
import bit from './bitcoin-03.png';  
import ClipLoader from 'react-spinners/ClipLoader';
import Popup from './Popup';

const Earn = () => {
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [username, setUserName] = useState(null);
  const [hasClaimed, setHasClaimed] = useState(false); // State to track if claimed
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isContentHidden, setIsContentHidden] = useState(false);

  const handleOpenPopup = () => {
    setIsPopupOpen(true);
    setIsContentHidden(true); // Hide the content
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setIsContentHidden(false); // Show the content again
  };

  useEffect(() => {
    // Check if Telegram WebApp is available
    if (window.Telegram && window.Telegram.WebApp) {
      const { WebApp } = window.Telegram;

      // Expand the WebApp
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

  const handleClaimClick = async () => {
    try {
      const response = await fetch('https://lunarapp.thelunarcoin.com/backend/api/dailybonus', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          dailyBonus: 50000, // Include the daily bonus amount
        }),
      });
  
      const data = await response.json();
      if (response.ok) {
        console.log('Bonus updated successfully:', data);
        setHasClaimed(true); // Set claimed state to true
      } else {
        console.error('Failed to update bonus:', data);
      }
    } catch (error) {
      console.error('Error updating bonus:', error);
    }
  };
     

  if (loading) {
    return (
      <div className="relative min-h-screen bg-black bg-blur-sm bg-don bg-center bg-no-repeat text-white flex items-center justify-center p-4 space-y-4">
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="absolute transform -translate-y-1/2 top-1/2 flex justify-center items-center">
          <ClipLoader color="#FFD700" size={100} speedMultiplier={1} />
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-black bg-blur-sm bg-don bg-[center_top_5rem] bg-no-repeat text-white flex flex-col items-center p-4 space-y-4">
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>

      <div className="relative z-10 text-white text-center p-2 sm:p-4">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold leading-snug">
          The more you claim, the more you <br />
          gain, fortune follows <br />
          those who sustain
        </h1>
      </div>

      <div className="mt-9 space-y-6 w-full z-10">

        <div className="bg-golden p-4 rounded-xl flex justify-between items-center shadow-lg">
          <div className="flex items-center">
            <img aria-hidden="true" alt="gift-icon" src={gift} className="mr-3 w-6 h-6" />
            <div>
              <p className="font-normal">Daily Bonus</p>
              <p className="text-golden-moon flex items-center">
                <img aria-hidden="true" alt="coin-icon" src={logo} className="mr-2 w-6 h-6" />
                50,000 LAR
              </p>
            </div>
          </div>
          
       {/*
<button
  className={`py-2 px-5 rounded-xl ${hasClaimed ? 'bg-darkGray text-white' : 'bg-golden-moon text-white'}`}
  onClick={handleClaimClick}
  disabled={loading}
>
  {hasClaimed ? 'Earn' : 'Claim'}
</button>
*/}
   <button 
            className="bg-darkGray text-white py-2 px-5 rounded-xl cursor-not-allowed"
          >
            ...
          </button>

          
        </div>
        
      <div className="bg-golden p-4 rounded-xl flex justify-between items-center shadow-lg">
          <div className="flex items-center">
            <img aria-hidden="true" alt="bitcoin-icon" src={bit} className="mr-3 w-6 h-6" />
            <div>
              <p className="font-normal">Daily Check-In</p>
              <p className="text-golden-moon flex items-center">
                <img aria-hidden="true" alt="coin-icon" src={logo} className="mr-2 w-6 h-6" />
                400,000 LAR
              </p>
            </div>
          </div>
          <button 
            className="bg-darkGray text-white py-2 px-5 rounded-xl cursor-not-allowed"
          >
            ...
          </button>
        </div>

       
      <div className="flex w-full bg-golden pl-4 pt-2 pb-2 flex-col rounded-3xl">
      {/* Conditionally render the main content */}
      {!isContentHidden && (
        <div className='flex flex-col'>
          <div className='text-left ml-4 space-y-2 flex-col flex'>
            <p className='text-xl font-normal w-full'>🚀 Lunar Astronauts 
              <br/> $15 Airdrop Campaign! 🚀✨ </p>
          </div>
          <button onClick={handleOpenPopup} className="w-16 m-4 p-2 bg-golden-moon text-white rounded-2xl">
            Open
          </button>
        </div>
        
      )}

      {/* Conditionally render the ReferralPopup component */}
      {isPopupOpen && <Popup onClose={handleClosePopup} />}
    </div>

      

      </div>

      <div className="w-full max-w-md rounded-3xl bg-darkGray fixed bottom-0 left-0 flex justify-around py-1 z-20">
        <Footer />
      </div>                   
    </div>
  );
};

export default Earn;
