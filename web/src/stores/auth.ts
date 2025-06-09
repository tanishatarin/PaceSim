import { atom } from 'nanostores'

export interface UserData {
  id: string
  name: string
  email: string
  role: string
  institution?: string
  username?: string
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
  console.log('Logging in user:', userData)
  $isAuthenticated.set(true)
  $userData.set(userData)
  if (typeof window !== 'undefined') {
    localStorage.setItem('pacesim_auth', JSON.stringify(userData))
  }
}

export const logoutUser = () => {
  console.log('Logging out user')
  $isAuthenticated.set(false)
  $userData.set(null)
  if (typeof window !== 'undefined') {
    localStorage.removeItem('pacesim_auth')
    window.location.href = '/' // Simple redirect
  }
}

// Check for existing auth on app start
export const initAuth = () => {
  $authLoading.set(true)
  try {
    if (typeof window !== 'undefined') {
      const savedAuth = localStorage.getItem('pacesim_auth')
      if (savedAuth) {
        const userData = JSON.parse(savedAuth)
        console.log('Loading saved auth:', userData)
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