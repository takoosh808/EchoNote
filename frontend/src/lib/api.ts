/**
 * API Client for EchoNote Backend Communication
 * 
 * This module provides a centralized API client with:
 * - Automatic JWT token attachment to requests
 * - Token refresh handling for expired access tokens
 * - Request/response interceptors for error handling
 * - Type-safe API methods for all backend endpoints
 * 
 * Architecture:
 * - Uses Axios for HTTP requests with interceptors
 * - Integrates with Zustand auth store for token management
 * - Provides convenience methods for different API groups
 * - Handles authentication errors gracefully
 * 
 * Security features:
 * - Automatic token refresh on 401 errors
 * - Logout on refresh token failure
 * - Request timeout handling
 * - CORS support
 */

import axios, { AxiosInstance, AxiosResponse } from 'axios'
import { useAuthStore } from '@/store/authStore'

// Get API base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

/**
 * Main API client class with authentication and error handling
 */
class ApiClient {
  private client: AxiosInstance

  constructor() {
    // Create Axios instance with base configuration
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000, // 10 second timeout
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Set up request/response interceptors
    this.setupInterceptors()
  }

  /**
   * Set up Axios interceptors for authentication and error handling
   * 
   * Request Interceptor:
   * - Automatically adds JWT access token to Authorization header
   * - Gets token from Zustand auth store
   * 
   * Response Interceptor:
   * - Handles 401 Unauthorized responses
   * - Automatically refreshes access token using refresh token
   * - Retries original request with new token
   * - Logs out user if refresh fails
   */
  private setupInterceptors() {
    // Request interceptor - add auth token to all requests
    this.client.interceptors.request.use(
      (config) => {
        // Get current tokens from auth store
        const { tokens } = useAuthStore.getState()
        if (tokens?.accessToken) {
          // Add Bearer token to Authorization header
          config.headers.Authorization = `Bearer ${tokens.accessToken}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    // Response interceptor - handle token refresh on 401 errors
    this.client.interceptors.response.use(
      (response) => response, // Pass through successful responses
      async (error) => {
        const originalRequest = error.config

        // Handle 401 Unauthorized errors (expired access token)
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true // Prevent infinite retry loops

          try {
            // Attempt to refresh the access token
            await useAuthStore.getState().refreshToken()
            const { tokens } = useAuthStore.getState()
            
            if (tokens?.accessToken) {
              // Update the original request with new token
              originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`
              // Retry the original request
              return this.client(originalRequest)
            }
          } catch (refreshError) {
            // Refresh failed - logout user
            useAuthStore.getState().logout()
            return Promise.reject(refreshError)
          }
        }

        return Promise.reject(error)
      }
    )
  }

  // ==================== AUTHENTICATION ENDPOINTS ====================

  /**
   * Authenticate user with email and password
   * @param credentials - User login credentials
   * @returns Promise with user data and JWT tokens
   */
  async login(credentials: { email: string; password: string }) {
    return this.client.post('/auth/login', credentials)
  }

  /**
   * Register new user account
   * @param credentials - User registration data
   * @returns Promise with user data and JWT tokens
   */
  async register(credentials: { email: string; password: string; name?: string }) {
    return this.client.post('/auth/register', credentials)
  }

  /**
   * Refresh access token using refresh token
   * @param refreshToken - Valid refresh token
   * @returns Promise with new access token
   */
  async refreshToken(refreshToken: string) {
    return this.client.post('/auth/refresh', { refreshToken })
  }

  /**
   * Logout user (client should discard tokens)
   * @returns Promise with logout confirmation
   */
  async logout() {
    return this.client.post('/auth/logout')
  }

  // ==================== JOURNAL ENDPOINTS ====================

  /**
   * Get user's journal entries with pagination and search
   * @param params - Query parameters for pagination and search
   * @returns Promise with paginated entries list
   */
  async getEntries(params?: { page?: number; limit?: number; search?: string }) {
    return this.client.get('/entries', { params })
  }

  /**
   * Get specific journal entry by ID
   * @param id - Entry UUID
   * @returns Promise with entry data
   */
  async getEntry(id: string) {
    return this.client.get(`/entries/${id}`)
  }

  /**
   * Create new journal entry
   * @param data - Entry data (title, content, type)
   * @returns Promise with created entry
   */
  async createEntry(data: { title: string; content: string; contentType: 'text' | 'audio' }) {
    return this.client.post('/entries', data)
  }

  /**
   * Update existing journal entry
   * @param id - Entry UUID
   * @param data - Updated entry data
   * @returns Promise with updated entry
   */
  async updateEntry(id: string, data: { title?: string; content?: string }) {
    return this.client.put(`/entries/${id}`, data)
  }

  /**
   * Delete journal entry
   * @param id - Entry UUID
   * @returns Promise with deletion confirmation
   */
  async deleteEntry(id: string) {
    return this.client.delete(`/entries/${id}`)
  }

  // ==================== AI ENDPOINTS ====================

  /**
   * Trigger AI summarization for journal entry
   * @param entryId - Entry UUID to summarize
   * @returns Promise with summarization status
   */
  async summarizeEntry(entryId: string) {
    return this.client.post(`/ai/summarize`, { entryId })
  }

  /**
   * Get user's AI-generated summaries
   * @param params - Query parameters for pagination
   * @returns Promise with paginated summaries list
   */
  async getSummaries(params?: { page?: number; limit?: number }) {
    return this.client.get('/ai/summaries', { params })
  }

  /**
   * Generate weekly reflection from user's entries
   * @param weekStart - Start date of the week
   * @param weekEnd - End date of the week
   * @returns Promise with reflection generation status
   */
  async generateReflection(weekStart: string, weekEnd: string) {
    return this.client.post('/ai/reflections', { weekStart, weekEnd })
  }

  // ==================== FILE UPLOAD ENDPOINTS ====================

  /**
   * Upload audio file for journal entry
   * @param entryId - Entry UUID to attach audio to
   * @param file - Audio file to upload
   * @returns Promise with upload confirmation and file metadata
   */
  async uploadAudio(entryId: string, file: File) {
    const formData = new FormData()
    formData.append('audio', file)
    return this.client.post(`/entries/${entryId}/audio`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  }
}

// Create singleton instance of API client
export const apiClient = new ApiClient()

// ==================== CONVENIENCE API EXPORTS ====================
// These provide organized access to API methods by feature area

/**
 * Authentication API methods
 * Provides type-safe access to all authentication endpoints
 */
export const authApi = {
  login: (credentials: { email: string; password: string }) => apiClient.login(credentials),
  register: (credentials: { email: string; password: string; name?: string }) => apiClient.register(credentials),
  refreshToken: (refreshToken: string) => apiClient.refreshToken(refreshToken),
  logout: () => apiClient.logout(),
}

/**
 * Journal API methods
 * Provides type-safe access to all journal entry endpoints
 */
export const journalApi = {
  getEntries: (params?: { page?: number; limit?: number; search?: string }) => apiClient.getEntries(params),
  getEntry: (id: string) => apiClient.getEntry(id),
  createEntry: (data: { title: string; content: string; contentType: 'text' | 'audio' }) => apiClient.createEntry(data),
  updateEntry: (id: string, data: { title?: string; content?: string }) => apiClient.updateEntry(id, data),
  deleteEntry: (id: string) => apiClient.deleteEntry(id),
  uploadAudio: (entryId: string, file: File) => apiClient.uploadAudio(entryId, file),
}

/**
 * AI API methods
 * Provides type-safe access to all AI-powered features
 */
export const aiApi = {
  summarizeEntry: (entryId: string) => apiClient.summarizeEntry(entryId),
  getSummaries: (params?: { page?: number; limit?: number }) => apiClient.getSummaries(params),
  generateReflection: (weekStart: string, weekEnd: string) => apiClient.generateReflection(weekStart, weekEnd),
}
