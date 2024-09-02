import React, { useState } from 'react';
import './bgvh.css';
import Footer from '../Component/Footer';
import logo from './logo.png';
import gift from './gift.png';
import bit from './bitcoin-03.png';
import ClipLoader from 'react-spinners/ClipLoader';

const Earn = () => {
  const [loading, setLoading] = useState(false);

  const handleClaimClick = () => {
    console.log("Claim button clicked");
   
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

        <div className="bg-golden p-4 rounded-xl flex justify-between items-center shadow-lg">
          <div className="flex items-center">
            <div>
              <p className="font-normal">Daily Combo Soon</p>
            </div>
          </div>
          <button 
            className="bg-darkGray text-white py-2 px-5 rounded-xl cursor-not-allowed"
          >
            ...
          </button>
        </div>
      </div>

      <div className="w-full max-w-md rounded-3xl bg-darkGray fixed bottom-0 left-0 flex justify-around py-1 z-20">
        <Footer />
      </div>
    </div>
  );
};

export default Earn;
