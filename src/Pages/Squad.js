import React, { useState, useEffect } from 'react';
import { getUserFromFarm } from '../utils/firestoreFunctions';
import Footer from '../Component/Footer';
import { ClipLoader } from 'react-spinners';
import './bg.css';
import axios from 'axios';

const Squad = () => {
  const [copied, setCopied] = useState(false);
  const [userId, setUserId] = useState(null);
  const [username, setUserName] = useState(null);
  const [userSquad, setUserSquad] = useState(null);
  const [squads, setSquads] = useState([]);
  const [farmData, setFarmData] = useState(null);
  const [farmBalance, setFarmBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showRCSquad, setShowRCSquad] = useState(false);
  const [error, setError] = useState(null);

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
    const fetchData = async () => {
      try {
        const [squadResponse, farmData] = await Promise.all([
          axios.get(`https://lunarapp.thelunarcoin.com/backend/api/squad/${userId}`),
          getUserFromFarm(userId),
        ]);

        const { userSquad, squads } = squadResponse.data;
        setUserSquad(userSquad);
        setSquads(squads || []);
        setFarmData(farmData);
        setFarmBalance(farmData.FarmBalance || 0);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchData();
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
    const totalBalance = Number(farmBalance || 0) + Number(newTotalSquad);

    
    try {
      const response = await axios.put(`https://lunarapp.thelunarcoin.com/backend/api/squad/update`, {
        userId: userId,
        claimedreferral: newClaimedReferral,
        totalbalance: totalBalance.toFixed(2),
        totalsquad: newTotalSquad,
      });

      const updatedSquadResponse = await axios.get(`https://lunarapp.thelunarcoin.com/backend/api/squad/${userId}`);
      const updatedSquad = updatedSquadResponse.data.userSquad;
      const updatedFarmData = await getUserFromFarm(userId);

    
      setUserSquad(updatedSquad);
      setFarmBalance(updatedFarmData.FarmBalance || 0);
    } catch (error) {
      console.error('Error during claim:', error);
      setError('Error during claim');
    }

    setShowRCSquad(true);
    setTimeout(() => setShowRCSquad(false), 2000);
  };

  const totalBalance = Number(farmBalance || 0) + Number(userSquad?.claimedReferral || 0);
  const displayTotalBalance = totalBalance.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
 
  const earning = Number(userSquad?.referralCount || 0) * 5000;
  const difference = Number(earning) - Number(userSquad?.claimedReferral || 0);

  const formattedDifference = difference.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
 
  const isClaimable = difference > 0;
 
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
            speedMultiplier={1}
          />
        </div>
      </div>
    );
  }


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
            onClick={() => isClaimable ? handleClaim(userSquad?.userId) : null}
            disabled={!isClaimable}
          >
            {isClaimable ? 'Claim' : 'Claimed'}
          </button>
        </div>
      </div>
      <div className= "relative bg-sinc bg-opacity-10 p-4 rounded-xl w-full max-w-md space-y-2">
        <div className="flex justify-between bg-CharcoalGray bg-opacity-70 text-sm items-center bg-zinc-700 rounded-lg py-2 px-3">
          <p className="flex items-center">
            <img aria-hidden="true" alt="team-icon" src="https://openui.fly.dev/openui/24x24.svg?text=👥" className="mr-2" />
            Your team
          </p>
          <p>{userSquad?.referralCount} users</p>
        </div>
        <div>
          {squads.length > 0 ? (
            squads.map((referral, index) => (
              <div key={index} className="flex font-normal text-sm justify-between items-center px-3">
                <p className="flex items-center">
                  <img aria-hidden="true" alt="user-icon" src="https://openui.fly.dev/openui/24x24.svg?text=👤" className="mr-2" />
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
