import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { blink } from '@/lib/blink'

interface User {
  id: string
  email: string
  displayName?: string
  role?: string
  district?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, displayName: string) => Promise<void>
  signOut: () => Promise<void>
  verify2FA: (code: string) => Promise<boolean>
  sendVerificationCode: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged(async (state) => {
      if (state.user) {
        // Fetch user profile from database
        const members = await blink.db.members.list({
          where: { userId: state.user.id },
          limit: 1
        })
        
        const member = members[0]
        setUser({
          id: state.user.id,
          email: state.user.email || '',
          displayName: member?.fullName || state.user.displayName || '',
          role: member?.isFullMember ? 'member' : 'member',
          district: member?.district,
        })
      } else {
        setUser(null)
      }
      setIsLoading(false)
    })

    return unsubscribe
  }, [])

  const signIn = async (email: string, password: string) => {
    await blink.auth.signInWithEmail(email, password)
  }

  const signUp = async (email: string, password: string, displayName: string) => {
    await blink.auth.signUp({
      email,
      password,
      displayName,
    })
  }

  const signOut = async () => {
    await blink.auth.signOut()
  }

  const verify2FA = async (code: string): Promise<boolean> => {
    // Verify the code against stored verification codes
    const currentUser = await blink.auth.me()
    if (!currentUser) return false

    const codes = await blink.db.verificationCodes.list({
      where: { userId: currentUser.id, used: '0' },
      orderBy: { createdAt: 'desc' },
      limit: 1
    })

    const validCode = codes.find(c => c.code === code && new Date(c.expiresAt) > new Date())
    
    if (validCode) {
      // Mark code as used
      await blink.db.verificationCodes.update(validCode.id, { used: '1' })
      return true
    }
    return false
  }

  const sendVerificationCode = async () => {
    const currentUser = await blink.auth.me()
    if (!currentUser) throw new Error('User not authenticated')

    // Generate a 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString() // 10 minutes

    await blink.db.verificationCodes.create({
      userId: currentUser.id,
      code,
      expiresAt,
    })

    // In production, this would send SMS via a notification service
    console.log('Verification code:', code)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        signIn,
        signUp,
        signOut,
        verify2FA,
        sendVerificationCode,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
