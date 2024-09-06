import React from 'react';

const RCTasks = ({ onClose, task }) => {
  return (
    <div className="flex max-w-md items-center justify-center w-full min-h-screen backdrop-blur-sm">
      <div className="bg-zinc-800 text-white rounded-xl p-6 shadow-lg w-80">
        <div className="flex flex-col items-center">
          <div className="bg-task rounded-full p-2 mb-2">
            <img aria-hidden="true" alt="checkmark" src="https://openui.fly.dev/openui/24x24.svg?text=✔️" />
          </div>
          <h2 className="text-lg font-semibold mb-4">Well done explorer!</h2>
          <p className="text-3xl font-medium text-white mb-2">+{task.reward.toLocaleString()} <span className="text-task">LAR</span></p>
          <p className="text-center text-xs text-gray-300 mb-7">Never stop tapping, never stop building <br/>
            Get more LAR, grow your colony.</p>
          
          <button className="w-full bg-custom text-white px-4 py-2 rounded-lg" onClick={onClose}>
            Morrrre!
          </button>
        </div>
      </div>
    </div>
  );
};

export default RCTasks;
