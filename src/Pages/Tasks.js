import React, { useState, useEffect } from 'react';
import Footer from '../Component/Footer';
import './Spinner.css';
import { ClipLoader } from 'react-spinners';
import { addUserTasks, getUserTasks, updateFarmBalance, getUserFromFarm } from '../utils/firestoreFunctions';
import './bg.css';
import RCTasks from '../Component/RCTasks';
import { motion, AnimatePresence } from 'framer-motion';
import logo from './logo.png';

const Tasks = () => {
  const [userData, setUserData] = useState(null);
  const [userId, setUserId] = useState("01"); // Replace with dynamic ID if possible
  const [taskFilter, setTaskFilter] = useState('new');
  const [loadingTask, setLoadingTask] = useState(null);
  const [farmData, setFarmData] = useState(null);
  const [taskReadyToClaim, setTaskReadyToClaim] = useState(null);
  const [showRCTasks, setShowRCTasks] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null); // New state for selected task
  const [showGoButton, setShowGoButton] = useState(false); // New state for showing "Go" button
  const [loading, setLoading] = useState(true); // New state for loading

  const tasks = [
    { id: 1, title: 'Follow Community', reward: 1500, link: "https://t.me/lunarcoincommunity" },
    { id: 2, title: 'React to post', reward: 1000, link: " https://t.me/lunarcoincommunity/11" },
    { id: 3, title: 'React to post', reward: 1000, link: " https://t.me/lunarcoincommunity/12" },
    { id: 4, title: 'React to post', reward: 1000, link: " https://t.me/lunarcoincommunity/15" },
    { id: 5, title: 'Retweet, comment to tweet', reward: 1000, link: " https://x.com/TheLunar_Coin/status/1815147922029199429?t=-waUnThgS_cwOvMibbqhsg&s=19" },
    { id: 6, title: 'Retweet, like tweet', reward: 1000, link: " https://x.com/TheLunar_Coin/status/1815378630198841422?s=19" },
    { id: 7, title: 'Subscribe to YouTube', reward: 1500, link: "https://youtube.com/@thelunarcoinofficial?si=qQttWxKSGuQpuoim"}, 
    ];

  useEffect(() => {
    const initializeUserId = () => {
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
    };
    initializeUserId();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getUserTasks(userId);
        if (data) {
          let updatedData = { ...data };
          let newTaskAdded = false;
          tasks.forEach(task => {
            if (!updatedData.TasksComplete.hasOwnProperty(task.id)) {
              updatedData.TasksComplete[task.id] = false;
              newTaskAdded = true;
            }
            if (!updatedData.TasksStatus.hasOwnProperty(task.id)) {
              updatedData.TasksStatus[task.id] = 'start';
              newTaskAdded = true;
            }
          });
          if (newTaskAdded) {
            await addUserTasks(userId, updatedData);
          }
          setUserData(updatedData);
          if (updatedData.taskFilter) {
            setTaskFilter(updatedData.taskFilter);
          }
        } else {
          const initialData = {
            TasksComplete: {},
            TasksStatus: {},
          };
          tasks.forEach(task => {
            initialData.TasksComplete[task.id] = false;
            initialData.TasksStatus[task.id] = 'start';
          });
          await addUserTasks(userId, initialData);
          setUserData(initialData);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  useEffect(() => {
    const fetchFarmData = async () => {
      try {
        const data = await getUserFromFarm(userId);
        setFarmData(data);
      } catch (error) {
        console.error('Error fetching farm data:', error);
      }
    };
    if (userId) {
      fetchFarmData();
    }
  }, [userId]);

  useEffect(() => {
    const saveUserData = async () => {
      if (userId && userData) {
        try {
          await addUserTasks(userId, userData);
        } catch (error) {
          console.error('Error saving data:', error);
        }
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

  const handleClaimClick = async (taskId, reward) => {
    const task = tasks.find(t => t.id === taskId);

    if (navigator.vibrate) {
      navigator.vibrate(500);
    }

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

    try {
      const updatedHomeData = await getUserFromFarm(userId);
      const newFarmBalance = updatedHomeData.FarmBalance + reward;
      await updateFarmBalance(userId, newFarmBalance);
      setFarmData(prevData => ({
        ...prevData,
        FarmBalance: newFarmBalance,
      }));
      setSelectedTask(task);
      setShowRCTasks(true);
      setShowGoButton(true);
      setTimeout(() => setShowRCTasks(false), 2000);
    } catch (error) {
      console.error('Error updating FarmBalance:', error);
    }
  };

  const handleStartClick = (taskId, link) => {
    setLoadingTask(taskId);
    window.open(link, '_blank');
    setTimeout(() => {
      setLoadingTask(null);
      setTaskReadyToClaim(taskId);
      setUserData(prevData => ({
        ...prevData,
        TasksStatus: {
          ...prevData.TasksStatus,
          [taskId]: 'claim',
        }
      }));
    }, 5000);
  };

  const filteredTasks = tasks.filter(task => {
    if (taskFilter === 'new') {
      return userData && userData.TasksStatus[task.id] !== 'completed';
    } else if (taskFilter === 'completed') {
      return userData && userData.TasksStatus[task.id] === 'completed';
    }
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-cover text-white p-4">
        <div className="flex flex-col items-center space-y-4">
          <h1 className="text-white text-4xl font-normal">
            <ClipLoader
              color="#FFD700"
              size={60}
              speedMultiplier={1}
            />
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cover min-h-screen flex flex-col">
      <div className="flex-grow overflow-y-auto  text-center text-white p-4">
        <h1 className="text-2xl font-bold">Curious about the moon's secrets? <br />Complete tasks to find out!</h1>
        <p className="text-zinc-500 mt-2">But hey, only qualified actions unlock the <br /> LAR galaxy! ✨</p>
        <div className="flex justify-center w-full mt-4">
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
        <div className="mt-6 space-y-4">
          {filteredTasks.length === 0 && taskFilter === 'completed' && (
            <div>No completed tasks yet.</div>
          )}
          {filteredTasks.map((task) => (
            <div key={task.id} className="bg-zinc-950 bg-opacity-70 p-4 rounded-xl flex justify-between items-center">
              <div>
                <p className="font-semibold">{task.title}</p>
                <p className="text-golden-moon flex">            
                  <img aria-hidden="true" alt="team-icon" src={logo} className="mr-2" width='25' height='5'/>
                {task.reward.toLocaleString()} LAR</p>
              </div>
              <div className="flex items-center space-x-2">
                {userData.TasksStatus[task.id] === 'start' && (
                  <button 
                    onClick={() => handleStartClick(task.id, task.link)} 
                    className="bg-golden-moon text-white py-2 px-4 rounded-xl"
                    disabled={loadingTask === task.id}
                  >
                    {loadingTask === task.id ? (
                      <div className="spinner-border spinner-border-sm"></div>
                    ) : (
                      'Start'
                    )}
                  </button>
                )}
                {userData.TasksStatus[task.id] === 'claim' && (
                  <button 
                    onClick={() => handleClaimClick(task.id, task.reward)} 
                    className="bg-golden-moon text-white py-2 px-4 rounded-xl"
                  >
                    Claim
                  </button>
                )}
                {userData.TasksStatus[task.id] === 'completed' && (
                  <button 
                    className="bg-golden-moon text-white py-2 px-4 rounded-xl"
                    disabled
                  >
                    Completed
                  </button>
                )}
                {showGoButton && userData.TasksStatus[task.id] === 'completed' && (
                  <a href={task.link} target="_blank" rel="noopener noreferrer" className="bg-primary text-primary-foreground py-2 px-4 text-golden-moon rounded-lg">
                    Go
                  </a>
                )}
              </div>
            </div>
          ))}
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
