import React, { useState, useEffect } from 'react';
import { Activity, Heart, Weight, Moon, Droplet, Thermometer } from 'lucide-react';
import { MetricCard } from './MetricCard';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../stores/authStore';

interface Metric {
  id: number;
  name: string;
  value: number;
}

export function HealthMetrics() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [healthScore, setHealthScore] = useState<number>(0);

  useEffect(() => {
    if (user) {
      const storedMetrics = localStorage.getItem(`metrics_${user.id}`);
      if (storedMetrics) {
        setMetrics(JSON.parse(storedMetrics));
      } else {
        const defaultMetrics = [
          { id: 1, name: t('Steps'), value: 8000 },
          { id: 2, name: t('Calories Burned'), value: 500 },
          { id: 3, name: t('Active Minutes'), value: 60 },
        ];
        setMetrics(defaultMetrics);
        localStorage.setItem(`metrics_${user.id}`, JSON.stringify(defaultMetrics));
      }
    }
  }, [user, t]);

  useEffect(() => {
    const calculateHealthScore = () => {
      const totalValue = metrics.reduce((acc, metric) => acc + metric.value, 0);
      const score = totalValue / metrics.length;
      setHealthScore(score);
    };

    calculateHealthScore();
  }, [metrics]);

  const getStepsMessage = (steps: number) => {
    if (steps >= 10000) {
      return t('Great job! You have reached your daily step goal.');
    } else if (steps >= 5000) {
      return t('Good effort! Try to reach 10,000 steps.');
    } else {
      return t('Keep moving! Aim for at least 5,000 steps.');
    }
  };

  const getCaloriesMessage = (calories: number) => {
    if (calories >= 500) {
      return t('Excellent! You have burned a significant amount of calories.');
    } else if (calories >= 300) {
      return t('Good work! Try to burn 500 calories.');
    } else {
      return t('Keep going! Aim to burn at least 300 calories.');
    }
  };

  const getActiveMinutesMessage = (minutes: number) => {
    if (minutes >= 60) {
      return t('Fantastic! You have been active for an hour.');
    } else if (minutes >= 30) {
      return t('Nice job! Try to be active for 60 minutes.');
    } else {
      return t('Keep it up! Aim for at least 30 active minutes.');
    }
  };

  const getStepsBadge = (steps: number) => {
    if (steps >= 10000) {
      return '🏅';
    } else if (steps >= 5000) {
      return '🥈';
    } else {
      return '🥉';
    }
  };

  const getCaloriesBadge = (calories: number) => {
    if (calories >= 500) {
      return '🔥';
    } else if (calories >= 300) {
      return '💪';
    } else {
      return '🏃';
    }
  };

  const getActiveMinutesBadge = (minutes: number) => {
    if (minutes >= 60) {
      return '🏆';
    } else if (minutes >= 30) {
      return '🏅';
    } else {
      return '🎖️';
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-center">{t('Health Metrics')}</h1>
      <div className="mt-4 text-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{t('Your Health Score')}</h2>
        <div className="mt-2 p-4 bg-green-100 dark:bg-green-800 rounded-lg shadow-lg inline-block">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{healthScore.toFixed(2)}</h3>
          <p className="text-sm text-gray-700 dark:text-gray-300">{t('This score is an aggregate of your health metrics.')}</p>
        </div>
      </div>
      <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {metrics.map(metric => (
          <div key={metric.id} className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{metric.name}</h3>
            <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{metric.value}</p>
            {metric.name === t('Steps') && (
              <>
                <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{getStepsMessage(metric.value)}</p>
                <p className="mt-2 text-2xl">{getStepsBadge(metric.value)}</p>
              </>
            )}
            {metric.name === t('Calories Burned') && (
              <>
                <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{getCaloriesMessage(metric.value)}</p>
                <p className="mt-2 text-2xl">{getCaloriesBadge(metric.value)}</p>
              </>
            )}
            {metric.name === t('Active Minutes') && (
              <>
                <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{getActiveMinutesMessage(metric.value)}</p>
                <p className="mt-2 text-2xl">{getActiveMinutesBadge(metric.value)}</p>
              </>
            )}
          </div>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard
          title={t('Heart Rate')}
          value="72"
          unit={t('bpm')}
          icon={<Heart className="h-6 w-6" />}
          trend={t('+2%')}
          color="text-red-500"
        />
        <MetricCard
          title={t('Steps')}
          value="8,439"
          unit={t('steps')}
          icon={<Activity className="h-6 w-6" />}
          trend={t('+12%')}
          color="text-blue-500"
        />
        <MetricCard
          title={t('Weight')}
          value="68.5"
          unit={t('kg')}
          icon={<Weight className="h-6 w-6" />}
          trend={t('-1%')}
          color="text-green-500"
        />
        <MetricCard
          title={t('Sleep')}
          value="7.5"
          unit={t('hours')}
          icon={<Moon className="h-6 w-6" />}
          trend={t('+5%')}
          color="text-purple-500"
        />
        <MetricCard
          title={t('Calories Burned')}
          value="500"
          unit={t('kcal')}
          icon={<Activity className="h-6 w-6" />}
          trend={t('+10%')}
          color="text-orange-500"
        />
        <MetricCard
          title={t('Hydration')}
          value="2.5"
          unit={t('liters')}
          icon={<Droplet className="h-6 w-6" />}
          trend={t('+8%')}
          color="text-blue-400"
        />
        <MetricCard
          title={t('Body Temperature')}
          value="36.6"
          unit={t('°C')}
          icon={<Thermometer className="h-6 w-6" />}
          trend={t('0%')}
          color="text-yellow-500"
        />
        <MetricCard
          title={t('Blood Pressure')}
          value="120/80"
          unit={t('mmHg')}
          icon={<Heart className="h-6 w-6" />}
          trend={t('0%')}
          color="text-red-500"
        />
      </div>
    </div>
  );
}

export default HealthMetrics;