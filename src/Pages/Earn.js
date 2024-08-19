import React from 'react';
import './bgvh.css';  // Ensure this CSS file contains the necessary styles
import Footer from '../Component/Footer';
import logo from './logo.png';
import gift from './gift.png';
import bit from './bitcoin-03.png';

const Earn = () => {

  const handleClaimClick = () => {
    // Add your claim logic here
    console.log("Claim button clicked");
  };

  return (
    <div className="relative min-h-screen bg-ove text-white flex flex-col items-center p-4 space-y-6">
      
      {/* Black Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-70"></div>

      {/* Main Heading */}
      <div className="relative z-10 text-white text-center">
        <h1 className="text-2xl font-bold leading-relaxed">
          The more you claim, the more you gain, <br/>
          fortune follows those who sustain
        </h1>
      </div>

      {/* Daily Bonus Section */}
      <div className="mt-9 space-y-6 w-full  z-10">
        {/* Daily Bonus Card */}
        <div className="bg-golden p-4 rounded-xl flex justify-between items-center shadow-lg">
          <div className="flex items-center">
            <img aria-hidden="true" alt="gift-icon" src={gift} className="mr-3 w-6 h-6"/>
            <div>
              <p className="font-normal">Daily Bonus</p>
              <p className="text-golden-moon flex items-center">
                <img aria-hidden="true" alt="coin-icon" src={logo} className="mr-2 w-6 h-6"/>
                50,000 LAR
              </p>
            </div>
          </div>
          <button 
            onClick={handleClaimClick} 
            className="bg-custom text-white py-2 px-5 rounded-xl hover:bg-custom-dark transition-colors"
          >
            Claim
          </button>
        </div>

        {/* Daily Check-In Card */}
        <div className="bg-golden p-4 rounded-xl flex justify-between items-center shadow-lg">
          <div className="flex items-center">
            <img aria-hidden="true" alt="bitcoin-icon" src={bit} className="mr-3 w-6 h-6"/>
            <div>
              <p className="font-normal">Daily Check-In</p>
              <p className="text-golden-moon flex items-center">
                <img aria-hidden="true" alt="coin-icon" src={logo} className="mr-2 w-6 h-6"/>
                400,000 LAR
              </p>
            </div>
          </div>
          <button 
            onClick={handleClaimClick} 
            className="bg-custom text-white py-2 px-5 rounded-xl hover:bg-custom-dark transition-colors"
          >
            Claim
          </button>
        </div>

        {/* Daily Combo Soon Card */}
        <div className="bg-golden p-4 rounded-xl flex justify-between items-center shadow-lg">
          <div className="flex items-center">
            <div>
              <p className="font-normal">Daily Combo Soon</p>
              <p className="text-golden-moon flex items-center">
                <img aria-hidden="true" alt="coin-icon" src={logo} className="mr-2 w-6 h-6"/>
              </p>
            </div>
          </div>
          <button 
            className="bg-darkGray text-white py-2 px-5 rounded-xl cursor-not-allowed"
          >
            Soon
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="w-full max-w-md rounded-3xl bg-darkGray fixed bottom-0 left-0 flex justify-around py-1 z-20">
        <Footer />
      </div>
    </div>
  );
};

export default Earn;
