import React from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/input'
import { Plus, Search, Filter, MoreVertical, Edit, Trash2, Share } from 'lucide-react'
import { cn } from '@/utils'

export function JournalPage() {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedEntry, setSelectedEntry] = React.useState<string | null>(null)

  const entries = [
    {
      id: '1',
      title: 'Morning thoughts on productivity',
      content: 'Today I realized that my most productive hours are between 9-11 AM. I should schedule my most important tasks during this time. The key is to eliminate distractions and focus on deep work.',
      createdAt: '2024-01-15T10:30:00Z',
      type: 'text' as const,
      isEncrypted: false,
    },
    {
      id: '2',
      title: 'Voice note about weekend plans',
      content: '',
      createdAt: '2024-01-14T18:45:00Z',
      type: 'audio' as const,
      isEncrypted: true,
    },
    {
      id: '3',
      title: 'Reflection on work-life balance',
      content: 'I\'ve been thinking about how to better manage my time between work and personal life. It\'s important to set boundaries and stick to them.',
      createdAt: '2024-01-13T20:15:00Z',
      type: 'text' as const,
      isEncrypted: false,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100">
              My Journal
            </h1>
            <p className="mt-2 text-secondary-600 dark:text-secondary-400">
              Capture your thoughts and memories
            </p>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Entry
          </Button>
        </div>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        className="flex flex-col sm:flex-row gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <div className="flex-1">
          <Input
            placeholder="Search entries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
          />
        </div>
        <Button variant="secondary" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </motion.div>

      {/* Entries Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Entries List */}
        <motion.div
          className="lg:col-span-1 space-y-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {entries.map((entry, index) => (
            <motion.div
              key={entry.id}
              className={cn(
                'card p-4 cursor-pointer transition-all duration-200',
                selectedEntry === entry.id
                  ? 'ring-2 ring-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'hover:shadow-lg hover:scale-[1.02]'
              )}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1, duration: 0.3 }}
              onClick={() => setSelectedEntry(entry.id)}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium text-secondary-900 dark:text-secondary-100 line-clamp-2">
                  {entry.title}
                </h3>
                <div className="flex items-center gap-1 ml-2">
                  {entry.isEncrypted && (
                    <div className="h-2 w-2 bg-green-500 rounded-full" title="Encrypted" />
                  )}
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <MoreVertical className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              {entry.content && (
                <p className="text-sm text-secondary-600 dark:text-secondary-400 line-clamp-3 mb-2">
                  {entry.content}
                </p>
              )}
              
              <div className="flex items-center justify-between text-xs text-secondary-500 dark:text-secondary-400">
                <span>{new Date(entry.createdAt).toLocaleDateString()}</span>
                <span className="capitalize">{entry.type}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Entry Detail */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {selectedEntry ? (
            <div className="card p-6">
              {(() => {
                const entry = entries.find(e => e.id === selectedEntry)
                if (!entry) return null

                return (
                  <div className="space-y-6">
                    {/* Entry Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-2">
                          {entry.title}
                        </h2>
                        <div className="flex items-center gap-4 text-sm text-secondary-500 dark:text-secondary-400">
                          <span>{new Date(entry.createdAt).toLocaleString()}</span>
                          <span className="capitalize">{entry.type}</span>
                          {entry.isEncrypted && (
                            <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                              <div className="h-2 w-2 bg-green-500 rounded-full" />
                              Encrypted
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Share className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Entry Content */}
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      {entry.type === 'audio' ? (
                        <div className="flex items-center justify-center h-32 bg-secondary-100 dark:bg-secondary-800 rounded-lg">
                          <div className="text-center">
                            <div className="h-12 w-12 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-2">
                              <div className="h-6 w-6 bg-white rounded-full" />
                            </div>
                            <p className="text-sm text-secondary-600 dark:text-secondary-400">
                              Audio Entry
                            </p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-secondary-700 dark:text-secondary-300 leading-relaxed">
                          {entry.content}
                        </p>
                      )}
                    </div>

                    {/* AI Summary */}
                    <div className="border-t border-secondary-200 dark:border-secondary-700 pt-6">
                      <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-3">
                        AI Summary
                      </h3>
                      <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                        <p className="text-sm text-primary-700 dark:text-primary-300">
                          This entry focuses on productivity and time management. The author identifies their most productive hours and emphasizes the importance of eliminating distractions for deep work.
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })()}
            </div>
          ) : (
            <div className="card p-12 text-center">
              <div className="mx-auto h-24 w-24 bg-secondary-100 dark:bg-secondary-800 rounded-full flex items-center justify-center mb-4">
                <BookOpen className="h-12 w-12 text-secondary-400" />
              </div>
              <h3 className="text-lg font-medium text-secondary-900 dark:text-secondary-100 mb-2">
                Select an entry to view
              </h3>
              <p className="text-secondary-600 dark:text-secondary-400">
                Choose an entry from the list to read its content and AI insights.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
