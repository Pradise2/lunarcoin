import React, { useState, useEffect, useCallback } from 'react';
import Footer from '../Component/Footer';
import './Spinner.css';
import { ClipLoader } from 'react-spinners';
import './bg.css';
import RCTasks from '../Component/RCTasks';
import { motion, AnimatePresence } from 'framer-motion';
import logo from './logo.png';
import facebook from './facebook.png'
import blum from './blum.jpg'
import cat from './cat.jpg'
import hamster from './hams.jpg'
import youtube from './youtube.png'
import twitter from './twitter.png'
import axios from 'axios';
import telegram  from './telegram.png';

const Tasks = () => {
  const [userData, setUserData] = useState({ TasksStatus: {}, TasksComplete: {} });
  const [userId, setUserId] = useState(null); // Replace with dynamic ID if possible
  const [taskFilter, setTaskFilter] = useState('new');
  const [loadingTask, setLoadingTask] = useState(null);
  const [specialTask, setSpecialTask] = useState([]);
   const [taskReadyToClaim, setTaskReadyToClaim] = useState(null);
  const [showRCTasks, setShowRCTasks] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showGoButton, setShowGoButton] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dailyTask, setDailyTask] = useState([]);
  const [delayLoading, setDelayLoading] = useState(true)

  const taskLogos = {
    '1': youtube,
    '2': facebook,
    '3': logo,
    '4': twitter,
    '5': youtube,
    '6': youtube,
    '7': youtube,
    '8': youtube,
    '9': youtube,
    '10': youtube,
    '11': telegram,
    '12': twitter,
    '14': youtube,
    '15': youtube,
    '16': youtube,
    '17': blum,
    '18': cat,
    '19': hamster,
    '20': youtube,
    '21': youtube,
    '22': twitter,
    '23': twitter,
  };
  
  const dtaskLogos = {
    '54': twitter,
    '55': twitter,
    '56': twitter,
    '57': telegram,
    '58': youtube,
    '59': youtube,
    '60': youtube,
    '61': twitter,
    '62': twitter,
    '63': twitter, 
    '64': twitter,
    '65': twitter,
    '66': telegram,
    '67': telegram,
    '68': telegram,
    '69': twitter,
    '70': twitter,
    '71': twitter,
    '72': telegram,
    '73': telegram,
    '74': telegram
  };

  const initializeUserId = useCallback(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      const { WebApp } = window.Telegram;
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
    initializeUserId();
  }, [initializeUserId]);

  useEffect(() => { 
    const fetchSpecialTaskData = async () => {
      try {
        const response = await axios.get(`https://lunarapp.thelunarcoin.com/backend/api/specialtask/${userId}`);
        const special = response.data;
        setSpecialTask(special);
      } catch (error) {
        console.error('Error fetching special task data:', error);
        setError('Error fetching special task data');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchSpecialTaskData();
   }
  }, [userId]);

  useEffect(() => { 
    const fetchDailyTaskData = async () => {
      try {
        const response = await axios.get(`https://lunarapp.thelunarcoin.com/backend/api/dailytask/${userId}`);
        const daily = response.data;
        setDailyTask(daily);
      } catch (error) {
        console.error('Error fetching special task data:', error);
        setError('Error fetching special task data');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchDailyTaskData();
   }
  }, [userId]);

  

  const saveUserData = useCallback(async () => {
    if (userId && userData) {
      try {  
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

  const handleClaimClick = async (userId, taskId, reward) => {
    const task = specialTask.find(t => t.taskId === taskId);
  
    if (navigator.vibrate) {
      navigator.vibrate(500);
    }
  
    try {
      await axios.put('https://lunarapp.thelunarcoin.com/backend/api/specialtask/updateStatus', {
        userId,
        taskId,
      });
  
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
  
     
      setSelectedTask(task);
      setShowRCTasks(true);
      setShowGoButton(true);
      
      setTimeout(() => setShowRCTasks(false), 1000);
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  
    try {
      // Ensure reward is not null or undefined before making the API call
      await axios.put('https://lunarapp.thelunarcoin.com/backend/api/specialtask/userbackup', {
        userId,
        specialBalance: reward, // Assuming you meant to pass the reward as the specialBalance
      });
  
   } catch (error) {
      console.error('Error performing user backup:', error);
    }
  };

  const handleDailyClaim = async (userId, taskId, reward) => {
    const task = dailyTask.find(t => t.taskId === taskId);
  
    if (navigator.vibrate) {
      navigator.vibrate(500);
    }
  
    try {
      // Update the task status
      await axios.put('https://lunarapp.thelunarcoin.com/backend/api/dailytask/updateStatus', {
        userId,
        taskId,
      });
   
      // Update the specific task's status to "completed"
      setDailyTask(prevTasks => prevTasks.map(t => 
        t.taskId === taskId ? { ...t, status: 'complete' } : t
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
  
     
      
      setSelectedTask(task);
      setShowRCTasks(true);
      setShowGoButton(true);
     
      setTimeout(() => setShowRCTasks(false), 1000);
    } catch (error) {
      console.error('Error updating task status:', error);
    }

    try {
      await axios.put('https://lunarapp.thelunarcoin.com/backend/api/dailytask/userbackup', {
        userId,
        dailyBalance: reward, 
      });
  
    } catch (error) {
      console.error('Error performing user backup:', error);
    }
};

  const handleStartClick = async (userId, taskId, link) => {
    setLoadingTask(taskId);
   
    window.open(link, '_blank');
    
    try {
      await axios.put('https://lunarapp.thelunarcoin.com/backend/api/specialtask/update', {
        userId,
        taskId,
      });
     
  
      setTimeout(() => {
        setLoadingTask(null);
  
        // Update the specific task's status to "claim"
        setSpecialTask(prevTasks => prevTasks.map(task => 
          task.taskId === taskId ? { ...task, status: 'claim' } : task
        ));
        
   }, 17000);
    } catch (error) {
      console.error('Error starting task:', error);
      setLoadingTask(null);
    }
  };

  const handleDailyStart = async (userId, taskId, link) => {
    setLoadingTask(taskId);
    // Open the link immediately
    window.open(link, '_blank');
  
    try {
      await axios.put('https://lunarapp.thelunarcoin.com/backend/api/dailytask/update', {
        userId,
        taskId,
      });
    
      setTimeout(() => {
        setLoadingTask(null);
        // Update the daily task's status to "claim"
        setDailyTask(prevTasks => prevTasks.map(dtask => 
          dtask.taskId === taskId ? { ...dtask, status: 'claim' } : dtask
        ));
  
     setLoadingTask(null);
      }, 17000); // 17 seconds delay
  
    } catch (error) {
      console.error('Error starting task:', error);
      setLoadingTask(null);
    }
 
  };

 
  if (delayLoading) {
    setTimeout(() => {
      
      setDelayLoading(false); // Stop loading after 3 seconds
    }, 1000);

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
          <h1 className='font-bold text-2xl flex'>Special Tasks</h1>
          {filteredTasks.length === 0 && taskFilter === 'completed' && (
            <div>No completed tasks yet.</div>
          )}
        {filteredTasks.length > 0 ? (
  filteredTasks.map((task) => {
    const taskStatus = task.status;
   
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
            onClick={() => handleStartClick(task.userId, task.taskId, task.linkz)}
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
            onClick={() => handleClaimClick(task.userId, task.taskId, parseInt(task.reward))}
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

        <div className="relative mt-6 space-y-4">
          <h1 className='font-bold text-2xl flex'>Daily Tasks</h1>
          {dfilteredTasks.length === 0 && taskFilter === 'completed' && (
            <div>No completed tasks yet.</div>
          )}
         {dfilteredTasks.length > 0 ? (
         dfilteredTasks.map((dtask) => {
        const dtaskStatus = dtask.status;
    
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
            onClick={() => handleDailyStart(dtask.userId, dtask.taskId, dtask.linkz)}
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
            onClick={() => handleDailyClaim(dtask.userId, dtask.taskId, parseInt(dtask.reward))}
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
