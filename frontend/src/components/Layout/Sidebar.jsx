import { NavLink, useLocation } from 'react-router-dom'
import { 
  Home, 
  BookOpen, 
  Brain, 
  Trophy, 
  Users, 
  Settings, 
  RotateCcw,
  LogOut 
} from 'lucide-react'
import useAuthStore from '../../store/authStore'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Chapters', href: '/chapters', icon: BookOpen },
  { name: 'Flashcards', href: '/flashcards', icon: Brain },
  { name: 'Review', href: '/review', icon: RotateCcw },
  { name: 'Achievements', href: '/achievements', icon: Trophy },
  { name: 'Leaderboard', href: '/leaderboard', icon: Users },
  { name: 'Settings', href: '/settings', icon: Settings },
]

const Sidebar = () => {
  const location = useLocation()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
  }

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white border-r border-gray-200 px-6 pb-4">
        <div className="flex h-16 shrink-0 items-center">
          <h1 className="text-2xl font-bold text-primary-600">LinguaFr</h1>
        </div>
        
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href
                  return (
                    <li key={item.name}>
                      <NavLink
                        to={item.href}
                        className={`
                          group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors
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
                    </li>
                  )
                })}
              </ul>
            </li>
            
            <li className="mt-auto">
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center gap-x-4 px-2 py-3 text-sm font-semibold leading-6 text-gray-900">
                  <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-primary-600 font-medium">
                      {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="flex-1 truncate">
                    <p className="truncate">{user?.name || 'User'}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  </div>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="group flex w-full gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-gray-700 hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-red-600" />
                  Logout
                </button>
              </div>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
}

export default Sidebar