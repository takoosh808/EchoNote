/**
 * Authentication Store using Zustand
 * 
 * This store manages all authentication-related state including:
 * - User information and authentication status
 * - JWT token management (access and refresh tokens)
 * - Login, register, logout operations
 * - Token refresh functionality
 * - Persistent storage of auth state
 * 
 * Features:
 * - Automatic token refresh when access token expires
 * - Persistent storage using Zustand's persist middleware
 * - Error handling for authentication failures
 * - Type-safe state management with TypeScript
 * 
 * Security considerations:
 * - Tokens are stored in localStorage (consider httpOnly cookies for production)
 * - Automatic logout on refresh token failure
 * - Clear error states on successful operations
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AuthState, AuthActions, LoginCredentials, RegisterCredentials, User } from '@/types/auth'
import { authApi } from '@/lib/api'

type AuthStore = AuthState & AuthActions

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      /**
       * Login function - authenticates user with email/password
       * @param credentials - User login credentials
       * @throws Error if login fails
       */
      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null })
        try {
          // Call API to authenticate user
          const response = await authApi.login(credentials)
          const { user, accessToken, refreshToken } = response.data
          
          // Update state with user data and tokens
          set({
            user,
            tokens: { accessToken, refreshToken },
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })
        } catch (error: any) {
          // Handle login errors
          set({
            error: error.response?.data?.message || 'Login failed',
            isLoading: false,
          })
          throw error
        }
      },

      /**
       * Register function - creates new user account
       * @param credentials - User registration credentials
       * @throws Error if registration fails
       */
      register: async (credentials: RegisterCredentials) => {
        set({ isLoading: true, error: null })
        try {
          // Call API to register new user
          const response = await authApi.register(credentials)
          const { user, accessToken, refreshToken } = response.data
          
          // Update state with new user data and tokens
          set({
            user,
            tokens: { accessToken, refreshToken },
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })
        } catch (error: any) {
          // Handle registration errors
          set({
            error: error.response?.data?.message || 'Registration failed',
            isLoading: false,
          })
          throw error
        }
      },

      /**
       * Logout function - clears user session
       * Removes all user data and tokens from state
       */
      logout: () => {
        set({
          user: null,
          tokens: null,
          isAuthenticated: false,
          error: null,
        })
      },

      /**
       * Refresh token function - gets new access token using refresh token
       * Automatically called by API interceptor when access token expires
       */
      refreshToken: async () => {
        const { tokens } = get()
        if (!tokens?.refreshToken) return

        try {
          // Call API to refresh access token
          const response = await authApi.refreshToken(tokens.refreshToken)
          const { accessToken } = response.data
          
          // Update access token while keeping refresh token
          set({
            tokens: { ...tokens, accessToken },
          })
        } catch (error) {
          // Refresh failed, logout user
          get().logout()
        }
      },

      /**
       * Clear error function - removes any authentication errors
       */
      clearError: () => set({ error: null }),

      /**
       * Update user function - updates user information in state
       * @param userData - Partial user data to update
       */
      updateUser: (userData: Partial<User>) => {
        const { user } = get()
        if (user) {
          set({ user: { ...user, ...userData } })
        }
      },
    }),
    {
      // Persist configuration - only store essential auth data
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        tokens: state.tokens,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
