import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../stores/authStore';
import { Award, Star, CheckCircle, AlertTriangle, Heart, Activity, Thermometer } from 'lucide-react';

interface HealthMetric {
  name: string;
  value: number;
}

interface Achievement {
  id: number;
  name: string;
  criteria: string;
  achieved: boolean;
  icon: JSX.Element;
}

const data = [
  { day: 'Mon', steps: 7400, distance: 5.6, calories: 300 },
  { day: 'Tue', steps: 8200, distance: 6.2, calories: 350 },
  { day: 'Wed', steps: 7900, distance: 6.0, calories: 340 },
  { day: 'Thu', steps: 8439, distance: 6.4, calories: 360 },
  { day: 'Fri', steps: 6800, distance: 5.1, calories: 280 },
  { day: 'Sat', steps: 9100, distance: 7.0, calories: 400 },
  { day: 'Sun', steps: 8300, distance: 6.3, calories: 370 },
];

const earlyDetectionData = [
  { name: 'Blood Pressure', value: 120 },
  { name: 'Cholesterol', value: 200 },
  { name: 'Blood Sugar', value: 90 },
];

const healthMetrics: HealthMetric[] = [
  { name: 'Heart Rate', value: 75 },
  { name: 'Blood Pressure', value: 120 },
  { name: 'Blood Sugar', value: 90 },
];

const badges: Achievement[] = [
  { 
    id: 1, 
    name: 'Step Master 🏃‍♂️', 
    criteria: 'Walk 10,000 steps in a day', 
    achieved: false, 
    icon: <Award className="h-6 w-6 text-yellow-500" /> 
  },
  { 
    id: 2, 
    name: 'Calorie Burner 🔥', 
    criteria: 'Burn 500 calories in a day', 
    achieved: false, 
    icon: <Star className="h-6 w-6 text-red-500" /> 
  },
  { 
    id: 3, 
    name: 'Distance Runner 🏃‍♀️', 
    criteria: 'Run 7 km in a day', 
    achieved: false, 
    icon: <CheckCircle className="h-6 w-6 text-green-500" /> 
  },
];

export function ActivityChart() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [userBadges, setUserBadges] = useState(badges);
  const showRecommendations = user?.age && user?.weight && user?.fitnessGoal;

  useEffect(() => {
    const checkAchievements = () => {
      const updatedBadges = userBadges.map(badge => {
        if (badge.name.includes('Step Master') && data.some(day => day.steps >= 10000)) {
          return { ...badge, achieved: true };
        }
        if (badge.name.includes('Calorie Burner') && data.some(day => day.calories >= 500)) {
          return { ...badge, achieved: true };
        }
        if (badge.name.includes('Distance Runner') && data.some(day => day.distance >= 7)) {
          return { ...badge, achieved: true };
        }
        return badge;
      });
      setUserBadges(updatedBadges);
    };

    checkAchievements();
  }, []);

  console.log('Rendering ActivityChart component');

  const healthRisks = [
    {
      id: 1,
      icon: <Heart className="h-5 w-5 text-red-500" />,
      title: t("Cardiovascular Health"),
      risk: t("Moderate Risk"),
      details: t("Blood pressure trending higher than optimal range"),
      recommendation: t("Schedule a check-up with your healthcare provider"),
      urgency: "medium",
      metrics: {
        current: "135/85",
        optimal: "120/80",
        trend: "+5%"
      }
    },
    {
      id: 2,
      icon: <Activity className="h-5 w-5 text-orange-500" />,
      title: t("Metabolic Health"),
      risk: t("Low Risk"),
      details: t("Glucose levels occasionally elevated"),
      recommendation: t("Monitor diet and exercise patterns"),
      urgency: "low",
      metrics: {
        current: "105 mg/dL",
        optimal: "< 100 mg/dL",
        trend: "+2%"
      }
    },
    {
      id: 3,
      icon: <Thermometer className="h-5 w-5 text-yellow-500" />,
      title: t("Sleep Pattern"),
      risk: t("High Risk"),
      details: t("Irregular sleep schedule detected"),
      recommendation: t("Establish consistent sleep routine"),
      urgency: "high",
      metrics: {
        current: "5.5 hrs",
        optimal: "7-9 hrs",
        trend: "-15%"
      }
    }
  ];

  return (
    <div className="mt-4 bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6">
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {t('Early Detection')} 🔍
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              {t('Proactive health monitoring and risk assessment')}
            </p>
          </div>
          <AlertTriangle className="h-8 w-8 text-amber-500 mt-2" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {healthMetrics.map((metric, index) => (
            <div key={index} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <h3 className="text-gray-600 dark:text-gray-300 text-sm font-medium">{t(metric.name)}</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{metric.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 bg-white dark:bg-gray-700 rounded-lg p-4 shadow-sm">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {t('These insights are based on your activity patterns, vital signs, and historical data. Always consult with healthcare professionals for medical advice.')}
          </p>
        </div>
      </div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 text-center mt-8">{t('Weekly Activity')} 📊</h3>
      <div className="h-80 sm:h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="steps" stroke="#0ea5e9" strokeWidth={2} dot={{ r: 5 }} activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="distance" stroke="#34d399" strokeWidth={2} dot={{ r: 5 }} activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="calories" stroke="#f87171" strokeWidth={2} dot={{ r: 5 }} activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 text-center">{t('Achievements')} 🏆</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {userBadges.map(badge => (
            <div
              key={badge.id}
              className={`p-4 rounded-lg border ${
                badge.achieved
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                  : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  {badge.icon}
                </div>
                <div>
                  <h3 className={`font-semibold ${
                    badge.achieved
                      ? 'text-blue-700 dark:text-blue-300'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}>
                    {t(badge.name)}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t(badge.criteria)}</p>
                </div>
                {badge.achieved && (
                  <div className="ml-auto">
                    <CheckCircle className="h-6 w-6 text-green-500 dark:text-green-400" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      {showRecommendations && (
        <>
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 text-center">{t('Personalized Fitness Plans')} 🏋️‍♂️</h3>
            <p className="text-gray-700 dark:text-gray-300 text-center">{t('Based on your activity data, here are some personalized fitness plans for you.')}</p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
              <li>{t('Plan 1: 30 minutes of cardio, 3 times a week')}</li>
              <li>{t('Plan 2: Strength training, 2 times a week')}</li>
              <li>{t('Plan 3: Yoga and stretching, 2 times a week')}</li>
            </ul>
          </div>
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 text-center">{t('Dietary Suggestions')} 🍎</h3>
            <p className="text-gray-700 dark:text-gray-300 text-center">{t('Based on your activity data, here are some dietary suggestions for you.')}</p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
              <li>{t('Suggestion 1: Increase protein intake')}</li>
              <li>{t('Suggestion 2: Reduce sugar consumption')}</li>
              <li>{t('Suggestion 3: Stay hydrated')}</li>
            </ul>
          </div>
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 text-center">{t('Health Assessments')} 🩺</h3>
            <p className="text-gray-700 dark:text-gray-300 text-center">{t('Based on your activity data, here are some health assessments for you.')}</p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
              <li>{t('Assessment 1: Your cardiovascular health is good')}</li>
              <li>{t('Assessment 2: Your muscle strength is average')}</li>
              <li>{t('Assessment 3: Your flexibility is below average')}</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

export default ActivityChart;