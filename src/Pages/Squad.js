import React, { useState, useEffect } from 'react';
import Footer from '../Component/Footer';
import { ClipLoader } from 'react-spinners';
import './bg.css';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import user from './user.png';
import './bgvh.css';
import moon from './moon.png'

const Squad = () => {
  const [copied, setCopied] = useState(false);
  const [userId, setUserId] = useState(null);
  const [username, setUserName] = useState(null);
  const [userSquad, setUserSquad] = useState(null);
  const [squads, setSquads] = useState([]);
  const [all, setAll] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRCSquad, setShowRCSquad] = useState(false);
  const [error, setError] = useState(null); // Define error state

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

  useEffect(() => { 
    const fetchSquadData = async () => {
      try {
        const response = await axios.get(`https://lunarapp.thelunarcoin.com/backend/api/squad/${userId}`);
        const { userSquad, squads } = response.data;
        setUserSquad(userSquad);
        setSquads(squads || []); 
        console.log('Fetched squad data:', { userSquad, squads }); 
      } catch (error) {
        console.error('Error fetching squad data:', error);
        setError('Error fetching squad data');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchSquadData();
    }
  }, [userId]);

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
  


  const copyToClipboard = () => {
    const reflink = `https://t.me/ThelunarCoin_bot?start=ref_${userId}`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(reflink).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1000);
      }).catch(err => {
        console.error('Failed to copy text:', err);
      });
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = reflink;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
      document.body.removeChild(textArea);
    }
  };

 

  const handleClaim = async (userId) => {
    if (navigator.vibrate) {
      navigator.vibrate(500); // Vibrate for 500ms
    }
  
    const earning = Number(userSquad?.referralCount || 0) * 5000;
    const difference = Number(earning) - Number(userSquad?.claimedReferral || 0);
    const newClaimedReferral = Number(userSquad?.claimedReferral || 0) + Number(difference);
    const newTotalSquad = Number(userSquad?.totalBalance || 0) + Number(difference);
    const totalBalance = Number(all?.balance || 0) + Number(newTotalSquad);
  
    console.log('Earning:', earning);
    console.log('Difference:', difference);
    console.log('New Claimed Referral:', newClaimedReferral);
    console.log('New Total Squad:', newTotalSquad);
    console.log('Total Balance:', totalBalance);
  
    try {
      const response = await axios.put(`https://lunarapp.thelunarcoin.com/backend/api/squad/update`, {
        userId: userId,
        claimedreferral: newClaimedReferral,
        totalbalance: totalBalance.toFixed(2),
        totalsquad: newTotalSquad,
      });
  
      console.log('Claim response:', response.data);
  
      // Re-fetch updated squad and farm data
      const updatedSquadResponse = await axios.get(`https://lunarapp.thelunarcoin.com/backend/api/squad/${userId}`);
      const updatedSquad = updatedSquadResponse.data.userSquad;
     console.log('Claim update response:', updatedSquadResponse.data);
  
   

      setUserSquad(updatedSquad);
   } catch (error) {
      console.error('Error during claim:', error);
      setError('Error during claim');
    }
  
    setShowRCSquad(true);
    setTimeout(() => setShowRCSquad(false), 2000);
  };
  

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-cover text-white p-4">
        <div className="flex flex-col items-center space-y-4">
          <h1 className="text-white text-4xl font-normal">
            <ClipLoader
              color="#FFD700" // Golden color
              size={60}
              speedMultiplier={1}
            />
          </h1>
        </div>
      </div>
    );
  }

  const totalBalance = Number(all?.balance || 0) + Number(userSquad?.totalSquad || 0);
  const displayTotalBalance = totalBalance.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });


  console.log('TotalBal', totalBalance);
  console.log('Total', all?.balance);
  
  // Format the difference with commas and two decimal places
 

  const earning = Number(userSquad?.referralCount || 0) * 5000;
  const difference = Number(earning) - Number(userSquad?.claimedReferral || 0);
  const newTotalSquad = Number(userSquad?.totalBalance || 0) + Number(difference);
    
  const formattedDifference = difference.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const isClaimable = difference > 0;

  console.log('Earning:', earning);
    console.log('Difference:', difference);
    console.log('Total Balance:', totalBalance);
    console.log('new Balance:', newTotalSquad);
  
  return (
    <div
    className="relative min-h-screen bg-black bg-blur-sm bg-don bg-[center_top_5rem] bg-no-repeat text-white flex flex-col items-center p-4 space-y-4 ">
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>
    <h1 className="text-center text-4xl font-normal relative z-10">
     The bigger the tribe, <br /> the better the vibe!
      </h1>
      <p className='relative text-fin font-normal text-center items-center'>
      But hey, only qualification actions unlock <br/>
      <span className='text-fin font-bold'>The LAR galaxy!</span>
      </p>
      <div className="relative bg-sinc bg-opacity-10 p-4  rounded-xl w-full max-w-md space-y-2">
        <p className="text-zinc-400 text-center">Total squad balance</p>
        <p className="text-center text-3xl font-bold">
          {displayTotalBalance} <span className="text-golden-moon font-bold">LAR</span>
        </p>
      </div>
      <div className="relative bg-sinc bg-opacity-10 p-4 rounded-xl w-full max-w-md space-y-2">
        <p className="text-zinc-400 text-center">Your rewards</p>
        <p className="text-center text-3xl font-bold">
         {formattedDifference} <span className="text-golden-moon font-bold">LAR</span>
        </p>
        <p className="text-sm mb-4 text-center">Earn 5,000 LAR per Referral</p>
        <div className="flex p-1 justify-center">
          <button
            className={`px-4 py-2 rounded-xl ${isClaimable ? 'bg-golden-moon text-white ' : 'bg-gray-500 text-white'}`}
            onClick={isClaimable ? handleClaim : null}
            disabled={!isClaimable}
          >
            {isClaimable ? 'Claim' : 'Claimed'}
          </button>
        </div>
      </div>
      <div className= "relative bg-sinc bg-opacity-10 p-4 rounded-xl w-full max-w-md space-y-2">
        <div className="flex justify-between bg-CharcoalGray bg-opacity-70 text-sm items-center bg-zinc-700 rounded-lg py-2 px-3">
          <p className="flex items-center">
            <img aria-hidden="true" alt="team-icon" src={user} className="mr-2" />
            Your team
          </p>
          <p>{userSquad?.referralCount} users</p>
        </div>
        <div>
          {squads.length > 0 ? (
            squads.map((referral, index) => (
              <div key={index} className="flex font-normal text-sm justify-between items-center px-3">
                <p className="flex items-center">
                  <img aria-hidden="true" alt="user-icon"  src={user} className="mr-2" />
                  {referral.newUserName}
                </p>
                <p className="text-primary">{referral.referralEarning} <span className="text-golden-moon">LAR</span></p>
              </div>
            ))
          ) : (  
            <p className="text-center text-sm text-zinc-400">No referrals yet.</p>
          )}
        </div> 
      </div>
      <div className="relative w-full max-w-md flex space-x-2 mt-5">
        <button className="flex-1 bg-custom py-2 rounded-lg" onClick={copyToClipboard}>
          Invite friends
        </button>
        <button className="bg-sinc bg-opacity-10 p-2 rounded-lg" onClick={copyToClipboard}>
          {copied ? <span>Copied!</span> : <span>Copy</span>}
        </button>
      </div>
      <div className="w-full max-w-md sticky bottom-0 left-0 flex text-white bg-zinc-900 justify-around py-1">
        <Footer />
      </div>
    </div>
  );
};

export default Squad;
