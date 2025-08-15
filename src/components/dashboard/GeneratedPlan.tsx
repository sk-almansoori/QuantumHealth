import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { getAIRecommendations } from '../../utils/geminiAPI';

interface PlanSection {
  title: string;
  content: string[];
  icon?: string;
}

export function GeneratedPlan() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [plan, setPlan] = useState<PlanSection[]>([]);

  useEffect(() => {
    async function generatePlan() {
      if (user) {
        try {
          const formDataStr = localStorage.getItem(`healthForm_${user.id}`);
          if (!formDataStr) {
            setError('No health data found. Please complete the health assessment first.');
            setLoading(false);
            return;
          }

          const formData = JSON.parse(formDataStr);
          const hasData = Object.values(formData).some(value => value !== '');
          if (!hasData) {
            setError('No health data found. Please complete the health assessment first.');
            setLoading(false);
            return;
          }

          const prompt = `
            Based on the following health information, create a comprehensive health and fitness plan:
            
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

            Please provide a structured plan with the following sections:
            1. Exercise Plan
            2. Nutrition Plan
            3. Lifestyle Recommendations
            4. Weekly Schedule
            5. Progress Tracking Tips

            For each section, provide detailed, actionable items that are realistic and achievable.
          `;

          const response = await getAIRecommendations(prompt);
          const sections = parsePlanSections(response);
          setPlan(sections);
        } catch (err) {
          console.error('Error generating plan:', err);
          setError('Failed to generate your plan. Please try again.');
        } finally {
          setLoading(false);
        }
      }
    }

    generatePlan();
  }, [user]);

  const parsePlanSections = (response: string): PlanSection[] => {
    const sections: PlanSection[] = [];
    let currentSection: PlanSection | null = null;

    response.split('\n').forEach(line => {
      const trimmedLine = line.trim();
      if (/^\d+\.\s/.test(trimmedLine)) {
        // This is a section header
        if (currentSection) {
          sections.push(currentSection);
        }
        currentSection = {
          title: trimmedLine.replace(/^\d+\.\s/, ''),
          content: [],
          icon: getSectionIcon(trimmedLine)
        };
      } else if (trimmedLine && currentSection) {
        // This is content for the current section
        currentSection.content.push(trimmedLine);
      }
    });

    if (currentSection) {
      sections.push(currentSection);
    }

    return sections;
  };

  const getSectionIcon = (title: string): string => {
    if (title.toLowerCase().includes('exercise')) return '💪';
    if (title.toLowerCase().includes('nutrition')) return '🥗';
    if (title.toLowerCase().includes('lifestyle')) return '🌟';
    if (title.toLowerCase().includes('schedule')) return '📅';
    if (title.toLowerCase().includes('progress')) return '📈';
    return '✨';
  };

  const clearPlan = () => {
    if (user) {
      localStorage.removeItem(`healthForm_${user.id}`);
      setPlan([]);
      setError(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">{t('Generating your personalized plan...')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">❌</div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => navigate('/health-guide')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t('Go to Health Assessment')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('Your Personalized Health Plan')}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              {t('Based on your health assessment, here\'s your customized plan for success')}
            </p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => navigate('/health-guide')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {t('Update Plan')} 🔄
            </button>
            <button
              onClick={clearPlan}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              {t('Clear Plan')} 🗑️
            </button>
          </div>
        </div>

        {plan.length === 0 && !loading && !error ? (
          <div className="text-center py-12">
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('No plan generated yet!')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-lg mb-6">
                {t('Complete the health assessment to get your personalized plan.')}
              </p>
              <button
                onClick={() => navigate('/health-guide')}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium inline-flex items-center space-x-2"
              >
                <span>{t('Start Assessment')}</span>
                <span>📝</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {plan.map((section, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <span className="text-2xl">{section.icon}</span>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {section.title}
                    </h2>
                  </div>
                  <div className="space-y-3">
                    {section.content.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-start space-x-3">
                        <span className="text-blue-500 dark:text-blue-400">•</span>
                        <p className="text-gray-600 dark:text-gray-300">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <button
            onClick={() => navigate('/')}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium"
          >
            {t('Return to Dashboard')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default GeneratedPlan;
