import { useEffect, useState } from 'react'
import { Save, User, Bell, Palette, Target } from 'lucide-react'
import { settingsAPI, authAPI } from '../../services/api'
import useGameStore from '../../store/gameStore'
import useAuthStore from '../../store/authStore'
import toast from 'react-hot-toast'

const Settings = () => {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')
  
  const { settings, setSettings } = useGameStore()
  const { user, updateUser } = useAuthStore()
  
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    level: user?.level || 'beginner',
  })
  
  const [settingsData, setSettingsData] = useState({
    darkMode: false,
    notifications: true,
    streakReminder: true,
    reviewReminder: true,
    soundEffects: true,
    dailyGoalMinutes: 10,
  })

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await settingsAPI.get()
        setSettings(response.data)
        setSettingsData(response.data)
      } catch (error) {
        toast.error('Failed to load settings')
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [setSettings])

  const handleProfileSave = async () => {
    setSaving(true)
    try {
      // Update profile via auth API if needed
      updateUser(profileData)
      toast.success('Profile updated successfully')
    } catch (error) {
      toast.error('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleSettingsSave = async () => {
    setSaving(true)
    try {
      await settingsAPI.update(settingsData)
      setSettings(settingsData)
      toast.success('Settings updated successfully')
    } catch (error) {
      toast.error('Failed to update settings')
    } finally {
      setSaving(false)
    }
  }

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'preferences', name: 'Preferences', icon: Palette },
    { id: 'goals', name: 'Goals', icon: Target },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-2 text-gray-600">
          Manage your account and learning preferences
        </p>
      </div>

      <div className="flex space-x-8">
        {/* Sidebar */}
        <div className="w-64 flex-shrink-0">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="mr-3 h-5 w-5" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="card p-6">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Profile Information</h3>
                
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="input w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      className="input w-full"
                      disabled
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Learning Level
                    </label>
                    <select
                      value={profileData.level}
                      onChange={(e) => setProfileData({ ...profileData, level: e.target.value })}
                      className="input w-full"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleProfileSave}
                  disabled={saving}
                  className="btn-primary"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Notification Preferences</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Push Notifications</h4>
                      <p className="text-sm text-gray-500">Receive notifications about your progress</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settingsData.notifications}
                      onChange={(e) => setSettingsData({ ...settingsData, notifications: e.target.checked })}
                      className="h-4 w-4 text-primary-600 rounded border-gray-300"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Streak Reminders</h4>
                      <p className="text-sm text-gray-500">Get reminded to maintain your learning streak</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settingsData.streakReminder}
                      onChange={(e) => setSettingsData({ ...settingsData, streakReminder: e.target.checked })}
                      className="h-4 w-4 text-primary-600 rounded border-gray-300"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Review Reminders</h4>
                      <p className="text-sm text-gray-500">Get reminded when flashcards are due for review</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settingsData.reviewReminder}
                      onChange={(e) => setSettingsData({ ...settingsData, reviewReminder: e.target.checked })}
                      className="h-4 w-4 text-primary-600 rounded border-gray-300"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSettingsSave}
                  disabled={saving}
                  className="btn-primary"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? 'Saving...' : 'Save Notifications'}
                </button>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">App Preferences</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Dark Mode</h4>
                      <p className="text-sm text-gray-500">Use dark theme for the interface</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settingsData.darkMode}
                      onChange={(e) => setSettingsData({ ...settingsData, darkMode: e.target.checked })}
                      className="h-4 w-4 text-primary-600 rounded border-gray-300"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Sound Effects</h4>
                      <p className="text-sm text-gray-500">Play sounds for correct/incorrect answers</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settingsData.soundEffects}
                      onChange={(e) => setSettingsData({ ...settingsData, soundEffects: e.target.checked })}
                      className="h-4 w-4 text-primary-600 rounded border-gray-300"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSettingsSave}
                  disabled={saving}
                  className="btn-primary"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? 'Saving...' : 'Save Preferences'}
                </button>
              </div>
            )}

            {activeTab === 'goals' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Learning Goals</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Daily Goal (minutes)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="120"
                    value={settingsData.dailyGoalMinutes}
                    onChange={(e) => setSettingsData({ ...settingsData, dailyGoalMinutes: parseInt(e.target.value) })}
                    className="input w-32"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Set your daily learning goal in minutes
                  </p>
                </div>

                <button
                  onClick={handleSettingsSave}
                  disabled={saving}
                  className="btn-primary"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? 'Saving...' : 'Save Goals'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings