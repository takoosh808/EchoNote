import React from 'react'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/store/authStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useTheme } from '@/components/theme-provider'
import { 
  User, 
  Mail, 
  Shield, 
  Settings, 
  Download, 
  Trash2, 
  Sun, 
  Moon,
  Monitor,
  Key,
  Lock,
  Unlock
} from 'lucide-react'
import { cn } from '@/utils'

export function ProfilePage() {
  const { user, updateUser } = useAuthStore()
  const { theme, setTheme } = useTheme()
  const [isEditing, setIsEditing] = React.useState(false)
  const [formData, setFormData] = React.useState({
    name: user?.name || '',
    email: user?.email || '',
  })

  const handleSave = () => {
    updateUser(formData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
    })
    setIsEditing(false)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100">
              Profile Settings
            </h1>
            <p className="mt-2 text-secondary-600 dark:text-secondary-400">
              Manage your account settings and preferences
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Information */}
        <motion.div
          className="lg:col-span-2 space-y-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          {/* Personal Information */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100">
                Personal Information
              </h2>
              {!isEditing && (
                <Button variant="ghost" onClick={() => setIsEditing(true)}>
                  <Settings className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-primary-600 flex items-center justify-center text-white text-xl font-bold">
                  {user?.name ? user.name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-medium text-secondary-900 dark:text-secondary-100">
                    {user?.name || 'User'}
                  </h3>
                  <p className="text-secondary-600 dark:text-secondary-400">
                    {user?.email}
                  </p>
                </div>
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <Input
                    label="Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    leftIcon={<User className="h-4 w-4" />}
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    leftIcon={<Mail className="h-4 w-4" />}
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleSave}>Save Changes</Button>
                    <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-secondary-400" />
                    <span className="text-secondary-600 dark:text-secondary-400">Name:</span>
                    <span className="text-secondary-900 dark:text-secondary-100">{user?.name || 'Not set'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-secondary-400" />
                    <span className="text-secondary-600 dark:text-secondary-400">Email:</span>
                    <span className="text-secondary-900 dark:text-secondary-100">{user?.email}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Security Settings */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-6">
              Security Settings
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-secondary-200 dark:border-secondary-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-secondary-400" />
                  <div>
                    <h3 className="font-medium text-secondary-900 dark:text-secondary-100">
                      Change Password
                    </h3>
                    <p className="text-sm text-secondary-600 dark:text-secondary-400">
                      Update your account password
                    </p>
                  </div>
                </div>
                <Button variant="secondary">Change</Button>
              </div>

              <div className="flex items-center justify-between p-4 border border-secondary-200 dark:border-secondary-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <Key className="h-5 w-5 text-secondary-400" />
                  <div>
                    <h3 className="font-medium text-secondary-900 dark:text-secondary-100">
                      Two-Factor Authentication
                    </h3>
                    <p className="text-sm text-secondary-600 dark:text-secondary-400">
                      Add an extra layer of security
                    </p>
                  </div>
                </div>
                <Button variant="secondary">Enable</Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Sidebar */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {/* Theme Settings */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
              Appearance
            </h3>
            <div className="space-y-3">
              <Button
                variant={theme === 'light' ? 'primary' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setTheme('light')}
              >
                <Sun className="h-4 w-4 mr-2" />
                Light
              </Button>
              <Button
                variant={theme === 'dark' ? 'primary' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setTheme('dark')}
              >
                <Moon className="h-4 w-4 mr-2" />
                Dark
              </Button>
              <Button
                variant={theme === 'system' ? 'primary' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setTheme('system')}
              >
                <Monitor className="h-4 w-4 mr-2" />
                System
              </Button>
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
              Privacy
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {user?.encryptionEnabled ? (
                    <Lock className="h-4 w-4 text-green-600" />
                  ) : (
                    <Unlock className="h-4 w-4 text-secondary-400" />
                  )}
                  <span className="text-sm text-secondary-900 dark:text-secondary-100">
                    Client-side Encryption
                  </span>
                </div>
                <div className={cn(
                  'h-6 w-11 rounded-full transition-colors',
                  user?.encryptionEnabled ? 'bg-green-600' : 'bg-secondary-300'
                )}>
                  <div className={cn(
                    'h-5 w-5 rounded-full bg-white transition-transform mt-0.5',
                    user?.encryptionEnabled ? 'translate-x-5' : 'translate-x-0.5'
                  )} />
                </div>
              </div>
              <p className="text-xs text-secondary-600 dark:text-secondary-400">
                {user?.encryptionEnabled 
                  ? 'Your entries are encrypted before being sent to our servers.'
                  : 'Your entries are stored securely but not encrypted client-side.'
                }
              </p>
            </div>
          </div>

          {/* Data Management */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
              Data Management
            </h3>
            <div className="space-y-3">
              <Button variant="secondary" className="w-full justify-start">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
              <Button variant="secondary" className="w-full justify-start">
                <Settings className="h-4 w-4 mr-2" />
                Import Data
              </Button>
              <Button 
                variant="secondary" 
                className="w-full justify-start text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Account
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
