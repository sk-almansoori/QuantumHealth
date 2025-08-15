import React, { useState, useEffect } from 'react';
import { User, Award, Star, CheckCircle } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useTranslation } from 'react-i18next';

const badges = [
  { id: 1, name: 'Step Master', criteria: 'Walk 10,000 steps in a day', icon: <Award className="h-6 w-6 text-yellow-500" /> },
  { id: 2, name: 'Calorie Burner', criteria: 'Burn 500 calories in a day', icon: <Star className="h-6 w-6 text-red-500" /> },
  { id: 3, name: 'Distance Runner', criteria: 'Run 7 km in a day', icon: <CheckCircle className="h-6 w-6 text-green-500" /> },
];

export function UserProfile() {
  const { user, updateUser, signOut } = useAuthStore();
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || t('This is a sample bio.'));
  const [streak, setStreak] = useState(0);
  const [userBadges, setUserBadges] = useState(badges);

  useEffect(() => {
    // Calculate the user's streak
    const calculateStreak = () => {
      const storedStreak = localStorage.getItem(`streak_${user?.id}`);
      if (storedStreak) {
        setStreak(parseInt(storedStreak, 10));
      } else {
        setStreak(0);
      }
    };

    calculateStreak();
  }, [user]);

  useEffect(() => {
    // Check achievements
    const checkAchievements = () => {
      const updatedBadges = userBadges.map(badge => {
        if (badge.name === 'Step Master' && streak >= 10) {
          return { ...badge, achieved: true };
        }
        if (badge.name === 'Calorie Burner' && streak >= 5) {
          return { ...badge, achieved: true };
        }
        if (badge.name === 'Distance Runner' && streak >= 7) {
          return { ...badge, achieved: true };
        }
        return badge;
      });
      setUserBadges(updatedBadges);
    };

    checkAchievements();
  }, [streak]);

  const handleSave = () => {
    updateUser({ name, bio });
    setIsEditing(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 h-full mt-2">
      <div className="flex items-center space-x-4 mb-4">
        <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-full">
          <User className="h-6 w-6 text-gray-600 dark:text-gray-300" />
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">{t('Profile')}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
        </div>
      </div>
      <div className="space-y-4">
        {isEditing ? (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('Name')}</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full px-2 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('Bio')}</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="mt-1 block w-full px-2 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <button
              onClick={handleSave}
              className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {t('Save')}
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="w-full px-4 py-2 text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              {t('Cancel')}
            </button>
          </>
        ) : (
          <>
            <div>
              <h4 className="text-md font-medium text-gray-900 dark:text-white">{t('Name')}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">{user?.name || t('John Doe')}</p>
            </div>
            <div>
              <h4 className="text-md font-medium text-gray-900 dark:text-white">{t('Bio')}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">{user?.bio || t('This is a sample bio.')}</p>
            </div>
            <div className="mt-4 p-4 bg-green-100 dark:bg-green-800 rounded-lg shadow-lg text-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('Current Streak')}</h3>
              <p className="mt-2 text-gray-700 dark:text-gray-300">{t('You have met your activity goals for')} {streak} {t('consecutive days!')}</p>
            </div>
            <div className="mt-4 p-4 bg-yellow-100 dark:bg-yellow-800 rounded-lg shadow-lg text-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('Achievements')}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {userBadges.map(badge => (
                  <div key={badge.id} className={`p-4 rounded-lg shadow ${badge.achieved ? 'bg-green-100 dark:bg-green-800' : 'bg-gray-100 dark:bg-gray-700'}`}>
                    <div className="flex items-center space-x-2">
                      {badge.icon}
                      <h4 className="text-md font-semibold text-gray-900 dark:text-white">{t(badge.name)}</h4>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{t(badge.criteria)}</p>
                    {badge.achieved && <p className="text-sm text-green-600 dark:text-green-400">{t('Achieved')}</p>}
                  </div>
                ))}
              </div>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {t('Edit Profile')}
            </button>
            <button
              onClick={() => signOut()}
              className="w-full px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              {t('Sign Out')}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default UserProfile;