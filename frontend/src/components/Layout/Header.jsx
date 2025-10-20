import { Menu, Bell, Coins, Zap, X } from 'lucide-react'
import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { 
  Home, 
  BookOpen, 
  Brain, 
  Trophy, 
  Users, 
  Settings, 
  RotateCcw,
  LogOut,
  Target
} from 'lucide-react'
import useAuthStore from '../../store/authStore'
import NotificationCenter from '../Notifications/NotificationCenter'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Chapters', href: '/chapters', icon: BookOpen },
  { name: 'Adaptive Learning', href: '/adaptive', icon: Target },
  { name: 'Flashcards', href: '/flashcards', icon: Brain },
  { name: 'Review', href: '/review', icon: RotateCcw },
  { name: 'Achievements', href: '/achievements', icon: Trophy },
  { name: 'Leaderboard', href: '/leaderboard', icon: Users },
  { name: 'Settings', href: '/settings', icon: Settings },
]

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, logout } = useAuthStore()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    setMobileMenuOpen(false)
  }

  return (
    <>
      <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
        <button
          type="button"
          className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
          onClick={() => setMobileMenuOpen(true)}
        >
          <span className="sr-only">Open sidebar</span>
          <Menu className="h-6 w-6" />
        </button>

        {/* Mobile Logo */}
        <div className="lg:hidden">
          <h1 className="text-xl font-bold text-primary-600">LinguaFr</h1>
        </div>

        {/* Separator */}
        <div className="h-6 w-px bg-gray-200 lg:hidden" />

        <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
          <div className="flex flex-1" />
          
          <div className="flex items-center gap-x-4 lg:gap-x-6">
            {/* User stats */}
            <div className="hidden sm:flex items-center gap-x-4">
              <div className="flex items-center gap-x-1 text-sm font-medium text-gray-700">
                <Zap className="h-4 w-4 text-yellow-500" />
                <span>{user?.xp || 0} XP</span>
              </div>
              <div className="flex items-center gap-x-1 text-sm font-medium text-gray-700">
                <Coins className="h-4 w-4 text-yellow-600" />
                <span>{user?.coins || 0}</span>
              </div>
              <div className="flex items-center gap-x-1 text-sm font-medium text-gray-700">
                <span className="text-orange-500">🔥</span>
                <span>{user?.streak || 0}</span>
              </div>
            </div>

            {/* Notifications */}
            <NotificationCenter />

            {/* Separator */}
            <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" />

            {/* Profile */}
            <div className="flex items-center gap-x-2">
              <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-primary-600 font-medium text-sm">
                  {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              <div className="hidden lg:block">
                <p className="text-sm font-semibold text-gray-900">{user?.name || 'User'}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.level || 'beginner'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-gray-900/80" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed inset-y-0 left-0 z-50 w-full max-w-xs bg-white px-6 py-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-primary-600">LinguaFr</h1>
              <button
                type="button"
                className="-m-2.5 p-2.5 text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <nav className="space-y-2">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href
                return (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`
                      group flex gap-x-3 rounded-md p-3 text-sm leading-6 font-semibold transition-colors
                      ${isActive
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                      }
                    `}
                  >
                    <item.icon
                      className={`h-6 w-6 shrink-0 ${
                        isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-primary-600'
                      }`}
                    />
                    {item.name}
                  </NavLink>
                )
              })}
            </nav>

            {/* Mobile User Stats */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-x-3 mb-3">
                <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-primary-600 font-medium">
                    {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{user?.name || 'User'}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-3 text-center text-sm">
                <div>
                  <div className="font-semibold text-gray-900">{user?.xp || 0}</div>
                  <div className="text-gray-500">XP</div>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{user?.coins || 0}</div>
                  <div className="text-gray-500">Coins</div>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{user?.streak || 0}</div>
                  <div className="text-gray-500">Streak</div>
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="mt-4 w-full flex items-center gap-x-3 rounded-md p-3 text-sm leading-6 font-semibold text-red-700 hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-6 w-6 shrink-0" />
              Logout
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default Header