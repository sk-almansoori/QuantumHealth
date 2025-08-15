import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../stores/authStore';

const healthTips = [
  { metric: 'Steps', threshold: 5000, tip: 'Try to walk at least 10,000 steps a day for better cardiovascular health.' },
  { metric: 'Calories Burned', threshold: 300, tip: 'Burning more calories can help you maintain a healthy weight. Aim for 500 calories a day.' },
  { metric: 'Sleep', threshold: 7, tip: 'Ensure you get at least 7-8 hours of sleep each night for optimal recovery.' },
  { metric: 'Hydration', threshold: 2, tip: 'Drink at least 2 liters of water daily to stay hydrated.' },
  { metric: 'Heart Rate', threshold: 70, tip: 'Maintain a healthy heart rate by engaging in regular physical activity.' }
];

export function Dashboard() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [overallProgress, setOverallProgress] = useState<number>(0);
  const [healthTip, setHealthTip] = useState<string>('');

  // Get username from email (everything before @)
  const username = user?.email ? user.email.split('@')[0] : '';

  useEffect(() => {
    // Display a random health tip
    const randomTip = healthTips[Math.floor(Math.random() * healthTips.length)];
    setHealthTip(randomTip.tip);
  }, []);

  useEffect(() => {
    if (user) {
      const storedTasks = localStorage.getItem(`tasks_${user.id}`);
      if (storedTasks) {
        const tasks = JSON.parse(storedTasks);
        const totalProgress = tasks.reduce((acc, task) => acc + task.progress, 0);
        setOverallProgress(tasks.length ? totalProgress / tasks.length : 0);
      }
    }
  }, [user]);

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          {t('Welcome')} {username}! 👋
        </h1>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
          <button
            onClick={() => navigate('/dashboard-tasks')}
            className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base"
          >
            {t('View All Tasks')} 📋
          </button>
          <button
            onClick={() => navigate('/generated-plan')}
            className="w-full sm:w-auto px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm sm:text-base"
          >
            {t('Get Personalized AI Plan')} 🤖
          </button>
        </div>
      </div>

      <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t('Progress Overview')} 📊
          </h2>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" 
              style={{ width: `${overallProgress}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {t('Overall Progress')}: {overallProgress.toFixed(0)}%
          </p>
        </div>
      </div>

      <div className="mb-6 bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t('Health Tip')} 💡
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {healthTip}
        </p>
      </div>
    </div>
  );
}

export default Dashboard;