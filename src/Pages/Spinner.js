import React, { useState, useEffect, useCallback } from 'react';
import Footer from '../Component/Footer';
import './Spinner.css';
import { ClipLoader } from 'react-spinners';
import { updateFarmBalance, getUserFromFarm } from '../utils/firestoreFunctions';
import './bg.css';
import RCTasks from '../Component/RCTasks';
import { motion, AnimatePresence } from 'framer-motion';
import logo from './logo.png';
import facebook from './facebook.png'
import youtube from './youtube.png'
import twitter from './twitter.png'
import axios from 'axios';
import telegram  from './telegram.png';

const Tasks = () => {
  const [userData, setUserData] = useState({ TasksStatus: {}, TasksComplete: {} });
  const [userId, setUserId] = useState('001'); // Replace with dynamic ID if possible
  const [taskFilter, setTaskFilter] = useState('new');
  const [loadingTask, setLoadingTask] = useState(null);
  const [specialTask, setSpecialTask] = useState([]);
  const [farmData, setFarmData] = useState(null);
  const [taskReadyToClaim, setTaskReadyToClaim] = useState(null);
  const [showRCTasks, setShowRCTasks] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showGoButton, setShowGoButton] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dailyTask, setDailyTask] = useState([]);


  const taskLogos = {
    '1': youtube,
    '2': facebook,
    '3': telegram,
    '4': twitter 
  };

  
  const dtaskLogos = {
    '1': youtube,
    '2': youtube,
    '3': youtube,
    '4': youtube,
    '5': facebook,
    '6': facebook,
    '7': twitter,
    '8': twitter,
    '9': telegram,
    '10': telegram

  };

const test ={

}

  const initializeUserId = useCallback(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      const { WebApp } = window.Telegram;
      WebApp.expand();
      const user = WebApp.initDataUnsafe?.user;
      if (user) {
        setUserId(user.id);
        console.log('User ID set from Telegram:', user.id);
      } else {
        console.error('User data is not available.');
      }
    } else {
      console.error('Telegram WebApp script is not loaded.');
    }
  }, []);

  useEffect(() => {
    initializeUserId();
  }, [initializeUserId]);

  useEffect(() => { 
    const fetchSpecialTaskData = async () => {
      try {
        const response = await axios.get(`https://lunarapp.thelunarcoin.com/backend/api/specialtask/${userId}`);
        const special = response.data;
        setSpecialTask(special);
        console.log('Fetched SpecialTask', special); 
      } catch (error) {
        console.error('Error fetching special task data:', error);
        setError('Error fetching special task data');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchSpecialTaskData();
      console.log('Fetching special tasks for user ID:', userId);
    }
  }, [userId]);

  useEffect(() => { 
    const fetchDailyTaskData = async () => {
      try {
        const response = await axios.get(`https://lunarapp.thelunarcoin.com/backend/api/dailytask/${userId}`);
        const daily = response.data;
        setDailyTask(daily);
        console.log('Fetched DailyTask', daily); 
      } catch (error) {
        console.error('Error fetching special task data:', error);
        setError('Error fetching special task data');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchDailyTaskData();
      console.log('Fetching special tasks for user ID:', userId);
    }
  }, [userId]);

  useEffect(() => {
    const fetchFarmData = async () => {
      try {
        const data = await getUserFromFarm(userId);
        setFarmData(data);
        console.log('Fetched farm data:', data);
      } catch (error) {
        console.error('Error fetching farm data:', error);
      }
    };
    if (userId) {
      fetchFarmData();
      console.log('Fetching farm data for user ID:', userId);
    }
  }, [userId]);

  const saveUserData = useCallback(async () => {
    if (userId && userData) {
      try {
        console.log('Saving user data:', userData);
        // Your save logic here
      } catch (error) {
        console.error('Error saving data:', error);
      }
    }
  }, [userId, userData]);

  useEffect(() => {
    window.addEventListener('beforeunload', saveUserData);
    const saveInterval = setInterval(saveUserData, 10000);

    return () => {
      window.removeEventListener('beforeunload', saveUserData);
      clearInterval(saveInterval);
      saveUserData();
    };
  }, [saveUserData]);

  const handleClaimClick = async (taskId, reward) => {
    const task = specialTask.find(t => t.taskId === taskId);
  
    console.log('Claim button clicked for task:', task);
  
    if (navigator.vibrate) {
      navigator.vibrate(500);
      console.log('Vibration triggered.');
    }
  
    try {
      await axios.put('https://lunarapp.thelunarcoin.com/backend/api/specialtask/updateStatus', {
        userId,
        taskId,
      });
      console.log('Updated task status to completed for taskId:', taskId);
  
      // Update the specific task's status to "completed"
      setSpecialTask(prevTasks => prevTasks.map(task => 
        task.taskId === taskId ? { ...task, status: 'complete' } : task
      ));
  
      setUserData(prevData => ({
        ...prevData,
        TasksComplete: {
          ...prevData.TasksComplete,
          [taskId]: true,
        },
        TasksStatus: {
          ...prevData.TasksStatus,
          [taskId]: 'completed',
        }
      }));
      console.log('Updated userData after task completion:', userData);
  
      const updatedFarmData = await getUserFromFarm(userId);
      const newFarmBalance = updatedFarmData.FarmBalance + reward;
      console.log('New farm balance after reward:', newFarmBalance);
  
      await updateFarmBalance(userId, newFarmBalance);
      console.log('Farm balance updated in the database.');
  
      setFarmData(prevData => ({
        ...prevData,
        FarmBalance: newFarmBalance,
      }));
      console.log('Updated farmData state:', farmData);
  
      setSelectedTask(task);
      setShowRCTasks(true);
      setShowGoButton(true);
      console.log('Showing reward collection modal.');
  
      setTimeout(() => setShowRCTasks(false), 1000);
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const handleDailyClaim = async (taskId, reward) => {
    const dtask = dailyTask.find(t => t.taskId === taskId);
  
    console.log('Claim button clicked for task:', dtask);
  
    if (navigator.vibrate) {
      navigator.vibrate(500);
      console.log('Vibration triggered.');
    }
  
    try {
      await axios.put('https://lunarapp.thelunarcoin.com/backend/api/dailytask/updateStatus', {
        userId,
        taskId,
      });
      console.log('Updated task status to completed for taskId:', taskId);
  
      // Update the specific task's status to "completed"
      setDailyTask(prevTasks => prevTasks.map(dtask => 
        dtask.taskId === taskId ? { ...dtask, status: 'complete' } : dtask
      ));
  
      setUserData(prevData => ({
        ...prevData,
        TasksComplete: {
          ...prevData.TasksComplete,
          [taskId]: true,
        },
        TasksStatus: {
          ...prevData.TasksStatus,
          [taskId]: 'completed',
        }
      }));
      console.log('Updated userData after task completion:', userData);
  
      const updatedFarmData = await getUserFromFarm(userId);
      const newFarmBalance = updatedFarmData.FarmBalance + reward;
      console.log('New farm balance after reward:', newFarmBalance);
  
      await updateFarmBalance(userId, newFarmBalance);
      console.log('Farm balance updated in the database.');
  
      setFarmData(prevData => ({
        ...prevData,
        FarmBalance: newFarmBalance,
      }));
      console.log('Updated farmData state:', farmData);
  
      setSelectedTask(dtask);
      setShowRCTasks(true);
      setShowGoButton(true);
      console.log('Showing reward collection modal.');
  
      setTimeout(() => setShowRCTasks(false), 1000);
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  
  const handleStartClick = async (taskId, link) => {
    setLoadingTask(taskId);
    console.log('Start button clicked for taskId:', taskId);
  
    try {
      await axios.put('https://lunarapp.thelunarcoin.com/backend/api/specialtask/update', {
        userId,
        taskId,
      });
      console.log('Updated task status to "started" for taskId:', taskId);
  
      const formattedLink = link.startsWith('http://') || link.startsWith('https://') ? link : `https://${link}`;
      window.open(formattedLink, '_blank');
      console.log('Opened link in new tab:', formattedLink);
  
      setTimeout(() => {
        setLoadingTask(null);
  
        // Update the specific task's status to "claim"
        setSpecialTask(prevTasks => prevTasks.map(task => 
          task.taskId === taskId ? { ...task, status: 'claim' } : task
        ));
        
        console.log('Task ready to claim:', taskId);
      }, 6000);
    } catch (error) {
      console.error('Error starting task:', error);
      setLoadingTask(null);
    }
  };
  
  const handleDailyStart = async (taskId, link) => {
    setLoadingTask(taskId);
    console.log('Start button clicked for taskId:', taskId);
  
    try {
      await axios.put('https://lunarapp.thelunarcoin.com/backend/api/dailytask/update', {
        userId,
        taskId,
      });
      console.log('Updated task status to "started" for taskId:', taskId);
  
      const formattedLink = link.startsWith('http://') || link.startsWith('https://') ? link : `https://${link}`;
      window.open(formattedLink, '_blank');
      console.log('Opened link in new tab:', formattedLink);
  
      setTimeout(() => {
        setLoadingTask(null);
  
        // Update the daily task's status to "claim"
        setDailyTask(prevTasks => prevTasks.map(dtask => 
          dtask.taskId === taskId ? { ...dtask, status: 'claim' } : dtask
        ));
        
        console.log('Task ready to claim:', taskId);
      }, 6000);
    } catch (error) {
      console.error('Error starting task:', error);
      setLoadingTask(null);
    }
  };

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

  const filteredTasks = specialTask.filter(task => {
    const taskStatus = task.status
    if (taskFilter === 'completed') {
      return taskStatus === 'complete';
    } else {
      return taskStatus !== 'complete';
    }
  });

  const dfilteredTasks = dailyTask.filter(dtask => {
    const taskStatus = dtask.status
    if (taskFilter === 'completed') {
      return taskStatus === 'complete';
    } else {
      return taskStatus !== 'complete';
    }
  });
  
  console.log('Filtered tasks based on dtaskFilter:', dfilteredTasks);

  console.log('Filtered tasks based on taskFilter:', filteredTasks);

  return (
    <div className="relative min-h-screen bg-black bg-blur-sm bg-don bg-[center_top_5rem] bg-no-repeat text-white flex flex-col p-1 space-y-4">
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>
      <div className="relative flex-grow overflow-y-auto text-center text-white p-4">
        <h1 className="text-2xl font-bold">Curious about the moon's secrets? <br />Complete tasks to find out!</h1>
                <p className="text-zinc-500 mt-2">But hey, only qualified actions unlock the <br /> LAR galaxy! ✨</p>
        <div className="relative flex justify-center w-full mt-4">
          <button 
            className={`py-2 bg-opacity-70 text-center text-sm w-full rounded-2xl ${taskFilter === 'new' ? 'bg-white text-black' : 'bg-zinc-950 text-zinc-400'}`}
            onClick={() => setTaskFilter('new')}
          > 
            New
          </button>
          <button 
            className={`bg-opacity-70 py-2 text-center text-sm w-full rounded-2xl ${taskFilter === 'completed' ? 'bg-white text-black' : 'bg-zinc-950 text-zinc-400'}`}
            onClick={() => setTaskFilter('completed')}
          >
            Completed
          </button>
        </div>
  
        <div className="relative mt-6 space-y-4">
          <h1 className='font-bold text-2xl flex'>Daily Tasks</h1>
          {dfilteredTasks.length === 0 && taskFilter === 'completed' && (
            <div>No completed tasks yet.</div>
          )}
         {dfilteredTasks.length > 0 ? (
  dfilteredTasks.map((dtask) => {
    const dtaskStatus = dtask.status;
    console.log('Rendering dtask:', dtask);

    // Determine the logo based on dtask status
    const dtaskLogo = dtaskStatus === 'complete' ? logo : dtaskLogos[dtask.taskId] || ''; 

    return (
      <div key={dtask.id} className="bg-sinc bg-opacity-10 pt-4 pb-4 pl-1 pr-4  rounded-xl flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className='bg-hy  flex items-center rounded-3xl'>
            <img aria-hidden="true" alt="task-icon" src={dtaskLogo} className="m-2 mr-5 items-center w-7 h-7" />
          </div>
          <div className='flex text-left flex-col'>
            <p className="font-bold w-4/5 text-white">{dtask.title}</p>
            <p className="text-golden-moon font-semibold">{dtask.reward} LAR</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {dtaskStatus === 'start' && (
            <button 
              onClick={() => handleDailyStart(dtask.taskId, dtask.linkz)} 
              className="bg-golden-moon text-white py-2 px-4 rounded-xl"
              disabled={loadingTask === dtask.taskId}
            >
              {loadingTask === dtask.taskId ? (
                <div className="spinner-border spinner-border-sm"></div>
              ) : (
                'Start'
              )}
            </button>
          )}
          {dtaskStatus === 'claim' && (
            <button 
              onClick={() => handleDailyClaim(dtask.taskId, parseInt(dtask.reward))} 
              className="bg-golden-moon text-white py-2 px-4 rounded-xl"
            >
              Claim
            </button>
          )}
          {dtaskStatus === 'completed' && (
            <button 
              className="bg-golden-moon text-white py-2 px-4 rounded-xl"
              disabled
            >
              Completed
            </button>
          )}
        </div>
      </div>
    )
  })
) : (
  <div>No daily tasks available.</div>
)}

        </div>
  
        <div className="relative mt-6 space-y-4">
          <h1 className='font-bold text-2xl flex'>Special Tasks</h1>
          {filteredTasks.length === 0 && taskFilter === 'completed' && (
            <div>No completed tasks yet.</div>
          )}
        {filteredTasks.length > 0 ? (
  filteredTasks.map((task) => {
    const taskStatus = task.status;
    console.log('Rendering task:', task);

    // Determine the logo based on task status
    const taskLogo = taskStatus === 'complete' ? logo : taskLogos[task.taskId] || ''; 

    return (
      <div key={task.id} className="bg-sinc bg-opacity-10 p-4 rounded-xl flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className='bg-hy rounded-3xl'>
            <img aria-hidden="true" alt="task-icon" src={taskLogo} className="m-2 w-6 h-6" />
          </div>
          <div className='flex text-left flex-col'>
            <p className="font-bold text-white">{task.title}</p>
            <p className="text-golden-moon font-semibold">{task.reward} LAR</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {taskStatus === 'start' && (
            <button 
              onClick={() => handleStartClick(task.taskId, task.linkz)} 
              className="bg-golden-moon text-white py-2 px-4 rounded-xl"
              disabled={loadingTask === task.taskId}
            >
              {loadingTask === task.taskId ? (
                <div className="spinner-border spinner-border-sm"></div>
              ) : (
                'Start'
              )}
            </button>
          )}
          {taskStatus === 'claim' && (
            <button 
              onClick={() => handleClaimClick(task.taskId, parseInt(task.reward))} 
              className="bg-golden-moon text-white py-2 px-4 rounded-xl"
            >
              Claim
            </button>
          )}
          {taskStatus === 'completed' && (
            <button 
              className="bg-golden-moon text-white py-2 px-4 rounded-xl"
              disabled
            >
              Completed
            </button>
          )}
        </div>
      </div>
    )
  })
) : (
  <div>No special tasks available.</div>
)}

        </div>
      </div>
  
      <AnimatePresence>
        {showRCTasks && selectedTask && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
            onClick={() => setShowRCTasks(false)}
          >
            <RCTasks onClose={() => setShowRCTasks(false)} task={selectedTask} />
          </motion.div>
        )}
      </AnimatePresence>
  
      <div className="w-full max-w-md sticky bottom-0 left-0 flex text-white bg-zinc-900 justify-around py-1">
        <Footer />
      </div>
    </div>
  );
  
};
export default Tasks;
