import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../stores/authStore';
import jsPDF from 'jspdf';

export interface Task {
  id: number;
  name: string;
  progress: number;
  time: string;
}

export function DashboardTasks() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [overallProgress, setOverallProgress] = useState<number>(0);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [taskName, setTaskName] = useState<string>('');

  useEffect(() => {
    if (user) {
      const storedTasks = localStorage.getItem(`tasks_${user.id}`);
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    }
  }, [user]);

  useEffect(() => {
    const totalProgress = tasks.reduce((acc, task) => acc + task.progress, 0);
    setOverallProgress(tasks.length ? totalProgress / tasks.length : 0);
  }, [tasks]);

  const handleProgressChange = (taskId: number, newProgress: number) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, progress: newProgress } : task
    );
    setTasks(updatedTasks);
    if (user) {
      localStorage.setItem(`tasks_${user.id}`, JSON.stringify(updatedTasks));
    }
  };

  const handleTimeChange = (taskId: number, newTime: string) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, time: newTime } : task
    );
    setTasks(updatedTasks);
    if (user) {
      localStorage.setItem(`tasks_${user.id}`, JSON.stringify(updatedTasks));
    }
  };

  const handleTaskNameChange = (taskId: number, newName: string) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, name: newName } : task
    );
    setTasks(updatedTasks);
    if (user) {
      localStorage.setItem(`tasks_${user.id}`, JSON.stringify(updatedTasks));
    }
  };

  const clearTasks = () => {
    if (user) {
      localStorage.removeItem(`tasks_${user.id}`);
      setTasks([]);
    }
  };

  const exportTasksToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Health Tasks', 10, 10);
    doc.setFontSize(12);
    doc.text(`Overall Progress: ${overallProgress.toFixed(0)}%`, 10, 20);
    doc.setFontSize(14);
    doc.text('Tasks:', 10, 30);
    tasks.forEach((task, index) => {
      doc.text(`${index + 1}. ${task.name} - ${task.progress}% - Time: ${task.time}`, 10, 40 + (index * 10));
    });
    doc.save('tasks.pdf');
  };

  return (
    <div className="mt-16 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          {t('Your Health Tasks')}
        </h2>
        <div className="space-x-4">
          <button
            onClick={() => navigate('/health-guide')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t('Get AI Analysis')}
          </button>
          {tasks.length > 0 && (
            <>
              <button
                onClick={clearTasks}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                {t('Clear Tasks')}
              </button>
              <button
                onClick={exportTasksToPDF}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {t('Export Tasks as PDF')}
              </button>
            </>
          )}
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

      {tasks.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              {t('Your journey starts now!')}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-6">
              {t('Create your personalized health plan to begin.')}
            </p>
            <button
              onClick={() => navigate('/health-guide')}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium inline-flex items-center space-x-2"
            >
              <span>{t('Create Your Plan')}</span>
              <span>📝</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map(task => (
            <div
              key={task.id}
              className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600"
            >
              <div className="flex items-center justify-between mb-2">
                {editingTaskId === task.id ? (
                  <input
                    type="text"
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                    onBlur={() => {
                      handleTaskNameChange(task.id, taskName);
                      setEditingTaskId(null);
                    }}
                    className="w-full px-2 py-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                ) : (
                  <h3
                    className="font-medium text-gray-900 dark:text-white cursor-pointer"
                    onClick={() => {
                      setEditingTaskId(task.id);
                      setTaskName(task.name);
                    }}
                  >
                    {task.name}
                  </h3>
                )}
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {task.progress}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={task.progress}
                onChange={(e) => handleProgressChange(task.id, parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex items-center justify-between mt-2">
                <label className="text-sm text-gray-600 dark:text-gray-400">{t('Time')}</label>
                <input
                  type="time"
                  value={task.time}
                  onChange={(e) => handleTimeChange(task.id, e.target.value)}
                  className="w-32 px-2 py-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              {task.time && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  {t('Deadline')}: {task.time}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
      <p className="text-gray-600 dark:text-gray-400 text-lg mt-8 text-center">
        Welcome to your health dashboard!
      </p>
    </div>
  );
}
