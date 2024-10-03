import React, { useState, useEffect, useCallback } from 'react';
import logo from './logo.png';
import facebook from './facebook.png'
import youtube from './youtube.png'
import twitter from './twitter.png'
import axios from 'axios';
import telegram  from './telegram.png';
import frame from './Frame.jpg'
import add from './add.png' 

const Popup = ({ onClose }) => {
  const [copied, setCopied] = useState(false);
  const [specialTask, setSpecialTask] = useState([]);
  const [refTask, setRefTask] = useState(0);
  const [checkTask, setCheckTask] = useState([]);
  const [userData, setUserData] = useState({ TasksStatus: {}, TasksComplete: {} });
  const [userId, setUserId] = useState(null);
  const [taskFilter, setTaskFilter] = useState('new');
  const [showRCTasks, setShowRCTasks] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showGoButton, setShowGoButton] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingTask, setLoadingTask] = useState(null);

  const taskLogos = {
    '1': telegram,
    '2': youtube,
    '3': facebook,
    '4': twitter,
    '5': telegram,
    '6': twitter,
  };

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
        const response = await axios.get(`https://lunarapp.thelunarcoin.com/backend/api/bonustask/${userId}`);
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
    const fetchRefTaskData = async () => {
      try {
        const response = await axios.get(`https://lunarapp.thelunarcoin.com/backend/api/bonustask/bonuscountref/${userId}`);
        const ref = response.data;
        setRefTask(ref);

        console.log('ref', ref);

      } catch (error) {
        console.error('Error fetching special task data:', error);
        setError('Error fetching special task data');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchRefTaskData();
   }
  }, [userId]);

  useEffect(() => { 
    const fetchCheckTaskData = async () => {
      try {
        const response = await axios.get(`https://lunarapp.thelunarcoin.com/backend/api/bonustask/taskcheck/${userId}`);
        const taskcheck = response.data;
        setCheckTask(taskcheck);

        console.log('taskcheck', taskcheck);

      } catch (error) {
        console.error('Error fetching special task data:', error);
        setError('Error fetching special task data');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchCheckTaskData();
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

  
  const handleStartClick = async (userId, taskId, link) => {
    setLoadingTask(taskId);
    console.log('Start button clicked for taskId:', taskId);
    
    window.open(link, '_blank');
    
    try {
      await axios.put('https://lunarapp.thelunarcoin.com/backend/api/bonustask/updateStatus', {
        userId,
        taskId,
      });
     
      setTimeout(() => {
        setLoadingTask(null);
  
        // Update the specific task's status to "complete"
        setSpecialTask(prevTasks => 
          prevTasks.map(task => 
            task.taskId === taskId ? { ...task, status: 'complete' } : task
          )
        );
        
        // Call setCheckTask after task status has been changed
        setCheckTask([]);
        
      }, 20000);
  
    } catch (error) {
      console.error('Error starting task:', error);
      setLoadingTask(null);
    }
  };
     
  const filteredTasks = specialTask.filter(task => {
    const taskStatus = task.status
    if (taskFilter === 'completed') {
      return taskStatus === 'complete';
    } else {
      return taskStatus !== 'complete';
    }
  });


  return (
    <div className="backdrop-blur-sm bg-hy bg-opacity-10 flex items-center justify-center fixed inset-0 z-50">
      <div className="bg-card bg-zinc-800 rounded-lg shadow-lg p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-primary">
            LunarCoin <span className="text-gold-500">★</span>
          </h2>
          <button onClick={onClose} className="text-golden-moon hover:text-golden-moon">
            ✖
          </button>
        </div>
        <div className="mb-4">
          <img
            src={frame}
            alt="LunarCoin Frame"
            className="rounded-lg h-[270px] w-full"
          />
        </div>
        <p className="text-muted-foreground mb-2">
    Get a chance to earn up to $15 by completing simple tasks and inviting 5 friends!
</p>
<ul className='text-left mb-2'>
    <li>🔹 Complete tasks to unlock rewards</li>
    <li>🔹 Refer 16 friends and above to earn $1 per referral</li>
</ul>
<p>Don’t miss out on this opportunity! Start completing tasks and sharing with friends today! 🌕</p>
<p className='text-golden-moon text-center' >{refTask} out of 5 invites completed</p>
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
          {filteredTasks.length === 0 && taskFilter === 'completed' && (
            <div>No completed tasks yet.</div>
          )}
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => {
              const taskStatus = task.status;
  
              // Determine the logo based on task status
              const taskLogo = taskStatus === 'complete' ? logo : taskLogos[task.taskId] || ''; 
           
           
            
              return (
                <div key={task.id} className="text-sm bg-opacity-10 rounded-xl flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="bg-hy rounded-3xl">
                      <img aria-hidden="true" alt="task-icon" src={taskLogo} className="m-2 w-6 h-6" />
                    </div>
                    <div className="flex text-left flex-col">
                      <p className="font-bold text-white">{task.title}</p>
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
                
              );
            })
          ) : (
            checkTask === 'Task is completed' && (
              <div className="flex text-left flex-row justify-between items-center mt-4">
              <p>Claim button will be activated on Oct 15th, only for eligible users</p>
              <button className="bg-zinc-500 text-white py-2 px-5 rounded-xl cursor-not-allowed">
                Claim
              </button>
            </div>
            
            )
          )}
        </div>
        <div className="text-sm mt-2 bg-opacity-10 rounded-xl flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="bg-hy rounded-3xl">
                  <img aria-hidden="true" alt="task-icon" src={add} className="m-2 w-6 h-6" />
                </div>
                <div className="flex text-left flex-col">
                  <p className="font-bold text-white">{refTask} out of 5 invites completed</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
              <button className="bg-sinc bg-opacity-10 p-2 rounded-lg" onClick={copyToClipboard}>
          {copied ? <span>Copied!</span> : <span>Copy</span>}
        </button>
               
              </div>
            </div>
       
  
      </div>
    </div>
  );
  
  
};

export default Popup;
