import React from 'react'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/store/authStore'
import { Button } from '@/components/ui/button'
import { BookOpen, Plus, TrendingUp, Shield, Clock, BarChart3 } from 'lucide-react'
import { cn } from '@/utils'

export function DashboardPage() {
  const { user } = useAuthStore()

  const stats = [
    { name: 'Total Entries', value: '24', change: '+12%', changeType: 'positive' },
    { name: 'This Week', value: '7', change: '+3', changeType: 'positive' },
    { name: 'AI Insights', value: '18', change: '+5', changeType: 'positive' },
    { name: 'Reflections', value: '4', change: '+1', changeType: 'positive' },
  ]

  const recentEntries = [
    {
      id: '1',
      title: 'Morning thoughts on productivity',
      content: 'Today I realized that my most productive hours are...',
      createdAt: '2024-01-15T10:30:00Z',
      type: 'text' as const,
    },
    {
      id: '2',
      title: 'Voice note about weekend plans',
      content: '',
      createdAt: '2024-01-14T18:45:00Z',
      type: 'audio' as const,
    },
    {
      id: '3',
      title: 'Reflection on work-life balance',
      content: 'I\'ve been thinking about how to better manage...',
      createdAt: '2024-01-13T20:15:00Z',
      type: 'text' as const,
    },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100">
              Welcome back, {user?.name || 'User'}!
            </h1>
            <p className="mt-2 text-secondary-600 dark:text-secondary-400">
              Ready to capture your thoughts and gain insights?
            </p>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Entry
          </Button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            className="card p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.1, duration: 0.5 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600 dark:text-secondary-400">
                  {stat.name}
                </p>
                <p className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
                  {stat.value}
                </p>
              </div>
              <div className="flex items-center">
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
            </div>
            <div className="mt-4">
              <span
                className={cn(
                  'text-sm font-medium',
                  stat.changeType === 'positive'
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                )}
              >
                {stat.change} from last month
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Recent Entries */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100">
                Recent Entries
              </h2>
              <Button variant="ghost" size="sm">
                View all
              </Button>
            </div>
            <div className="space-y-4">
              {recentEntries.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  className="p-4 rounded-lg border border-secondary-200 dark:border-secondary-700 hover:bg-secondary-50 dark:hover:bg-secondary-800/50 transition-colors cursor-pointer"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.3 }}
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        {entry.type === 'audio' ? (
                          <div className="h-2 w-2 bg-blue-500 rounded-full" />
                        ) : (
                          <BookOpen className="h-4 w-4 text-secondary-400" />
                        )}
                        <h3 className="text-sm font-medium text-secondary-900 dark:text-secondary-100 truncate">
                          {entry.title}
                        </h3>
                      </div>
                      {entry.content && (
                        <p className="text-sm text-secondary-600 dark:text-secondary-400 line-clamp-2">
                          {entry.content}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Clock className="h-4 w-4 text-secondary-400" />
                      <span className="text-xs text-secondary-500 dark:text-secondary-400">
                        {new Date(entry.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Quick Actions & AI Insights */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {/* Quick Actions */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <Button variant="ghost" className="w-full justify-start">
                <BookOpen className="h-4 w-4 mr-2" />
                Write Entry
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <BarChart3 className="h-4 w-4 mr-2" />
                View Insights
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Shield className="h-4 w-4 mr-2" />
                Privacy Settings
              </Button>
            </div>
          </div>

          {/* AI Insights */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
              AI Insights
            </h3>
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-primary-50 dark:bg-primary-900/20">
                <p className="text-sm text-primary-700 dark:text-primary-300">
                  Your most productive writing time is between 9-11 AM
                </p>
              </div>
              <div className="p-3 rounded-lg bg-accent-50 dark:bg-accent-900/20">
                <p className="text-sm text-accent-700 dark:text-accent-300">
                  You've been focusing on productivity and wellness themes
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
