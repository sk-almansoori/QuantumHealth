import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../stores/authStore';
import { getAIRecommendations } from '../../utils/geminiAPI';
import { useNavigate } from 'react-router-dom';

interface FormData {
  age: string;
  height: string;
  weight: string;
  exercisePreference: string;
  currentDiet: string;
  dietaryRestrictions: string;
  lifestyleGoals: string;
  gender: string;
  activityLevel: string;
  goals: string;
  medicalConditions: string;
}

interface Task {
  id: number;
  name: string;
  progress: number;
  time: string;
}

export function AIHealthInsights() {
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const { t, i18n } = useTranslation();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    age: '',
    height: '',
    weight: '',
    exercisePreference: '',
    currentDiet: '',
    dietaryRestrictions: '',
    lifestyleGoals: '',
    gender: '',
    activityLevel: '',
    goals: '',
    medicalConditions: ''
  });
  const [userTasks, setUserTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (user) {
      const storedFormData = localStorage.getItem(`healthForm_${user.id}`);
      if (storedFormData) {
        setFormData(JSON.parse(storedFormData));
      }
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Save form data to localStorage
      if (user) {
        localStorage.setItem(`healthForm_${user.id}`, JSON.stringify(formData));
      }

      const prompt = `
        Based on the following health information, provide personalized health recommendations and tasks in ${i18n.language}:
        
        Age: ${formData.age}
        Height: ${formData.height} cm
        Weight: ${formData.weight} kg
        Exercise Preference: ${formData.exercisePreference}
        Current Diet: ${formData.currentDiet}
        Dietary Restrictions: ${formData.dietaryRestrictions}
        Lifestyle Goals: ${formData.lifestyleGoals}
        Gender: ${formData.gender}
        Activity Level: ${formData.activityLevel}
        Health Goals: ${formData.goals}
        Medical Conditions: ${formData.medicalConditions}
        
        Please provide specific recommendations and include at least 3-5 actionable tasks.`;

      const response = await getAIRecommendations(prompt);
      setAiResponse(response);

      // Extract tasks from AI response and save them
      if (user) {
        const lines = response.split('\n');
        const newTasks: Task[] = [];
        
        lines.forEach(line => {
          if (line.includes('🎯 Task:')) {
            const taskName = line.replace('🎯 Task:', '').trim();
            newTasks.push({
              id: Date.now() + newTasks.length,
              name: taskName,
              progress: 0,
              time: ''
            });
          }
        });

        if (newTasks.length > 0) {
          const existingTasksStr = localStorage.getItem(`tasks_${user.id}`);
          const existingTasks = existingTasksStr ? JSON.parse(existingTasksStr) : [];
          const updatedTasks = [...existingTasks, ...newTasks];
          
          localStorage.setItem(`tasks_${user.id}`, JSON.stringify(updatedTasks));
          setUserTasks(updatedTasks);
        }
      }
    } catch (error) {
      console.error('Error getting AI recommendations:', error);
      setError(t('Sorry, there was an error getting recommendations. Please try again later.'));
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (name: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="w-full max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            {t('Health Assessment Form')}
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            {t('Get personalized Quantum AI-powered health insights')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              {t('Age')}
            </label>
            <input
              type="number"
              value={formData.age}
              onChange={(e) => handleInputChange('age', e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              {t('Gender')}
            </label>
            <select
              value={formData.gender}
              onChange={(e) => handleInputChange('gender', e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            >
              <option value="">{t('Select Gender')}</option>
              <option value="male">{t('Male')}</option>
              <option value="female">{t('Female')}</option>
              <option value="other">{t('Other')}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              {t('Height (cm)')}
            </label>
            <input
              type="number"
              value={formData.height}
              onChange={(e) => handleInputChange('height', e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              {t('Weight (kg)')}
            </label>
            <input
              type="number"
              value={formData.weight}
              onChange={(e) => handleInputChange('weight', e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              {t('Activity Level')}
            </label>
            <select
              value={formData.activityLevel}
              onChange={(e) => handleInputChange('activityLevel', e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            >
              <option value="">{t('Select Activity Level')}</option>
              <option value="sedentary">{t('Sedentary')}</option>
              <option value="light">{t('Light')}</option>
              <option value="moderate">{t('Moderate')}</option>
              <option value="active">{t('Active')}</option>
              <option value="very_active">{t('Very Active')}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              {t('Health Goals')}
            </label>
            <textarea
              value={formData.goals}
              onChange={(e) => handleInputChange('goals', e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              rows={4}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              {t('Medical Conditions (if any)')}
            </label>
            <textarea
              value={formData.medicalConditions}
              onChange={(e) => handleInputChange('medicalConditions', e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              rows={4}
            />
          </div>

          <button
            type="submit"
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-[1.02]"
          >
            {t('Generate AI Health Insights')}
          </button>
        </form>

        {loading && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">
              {t('Analyzing your health data...')}
            </p>
          </div>
        )}

        {error && (
          <div className="text-red-600 dark:text-red-400 text-center mt-4">
            {error}
          </div>
        )}

        {aiResponse && (
          <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              {t('Your Personalized Health Insights')}
            </h3>
            <div className="prose prose-blue dark:prose-invert max-w-none space-y-4">
              {aiResponse.split('\n').map((line, index) => {
                // Check if line is a header (starts with number and dot)
                if (/^\d+\./.test(line)) {
                  return (
                    <h4 key={index} className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-6 mb-3">
                      {line}
                    </h4>
                  );
                }
                // Check if line is a task
                else if (line.includes('🎯 Task:')) {
                  return (
                    <div key={index} className="flex items-start space-x-3 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                      <span className="text-2xl">🎯</span>
                      <p className="text-gray-800 dark:text-gray-200 font-medium">
                        {line.replace('🎯 Task:', '').trim()}
                      </p>
                    </div>
                  );
                }
                // Check if line is a bullet point
                else if (line.trim().startsWith('•')) {
                  return (
                    <div key={index} className="flex items-start space-x-2 ml-4 my-1">
                      <span className="text-blue-500 dark:text-blue-400 text-lg">•</span>
                      <p className="text-gray-700 dark:text-gray-300">
                        {line.replace(/^•\s*/, '')}
                      </p>
                    </div>
                  );
                }
                // Empty lines
                else if (!line.trim()) {
                  return <div key={index} className="h-2" />;
                }
                // Regular text
                else {
                  return (
                    <p key={index} className="text-gray-700 dark:text-gray-300 my-2">
                      {line}
                    </p>
                  );
                }
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}