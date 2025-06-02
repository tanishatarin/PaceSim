// src/stores/auth.ts - Updated to use the new router
import { atom } from 'nanostores'
import { $router } from './router'

export interface UserData {
  id: string
  name: string
  email: string
  role: string
  institution?: string
  stats?: {
    completedModules: string[]
    inProgressModules: string[]
  }
}

export const $isAuthenticated = atom<boolean>(false)
export const $userData = atom<UserData | null>(null)
export const $authLoading = atom<boolean>(true)

// Auth actions
export const loginUser = (userData: UserData) => {
  $isAuthenticated.set(true)
  $userData.set(userData)
  if (typeof window !== 'undefined') {
    localStorage.setItem('pacesim_auth', JSON.stringify(userData))
  }
}

export const logoutUser = () => {
  $isAuthenticated.set(false)
  $userData.set(null)
  if (typeof window !== 'undefined') {
    localStorage.removeItem('pacesim_auth')
  }
  $router.open('/')
}

// Check for existing auth on app start
export const initAuth = () => {
  $authLoading.set(true)
  try {
    if (typeof window !== 'undefined') {
      const savedAuth = localStorage.getItem('pacesim_auth')
      if (savedAuth) {
        const userData = JSON.parse(savedAuth)
        $isAuthenticated.set(true)
        $userData.set(userData)
      }
    }
  } catch (error) {
    console.error('Error loading auth:', error)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('pacesim_auth')
    }
  } finally {
    $authLoading.set(false)
  }
}