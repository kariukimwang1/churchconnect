import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useFrameworkReady } from '@/hooks/useFrameworkReady'
import { AuthProvider } from '@/hooks/useAuth'

// Create a client for React Query with safer defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      networkMode: 'always',
    },
    mutations: {
      networkMode: 'always',
    },
  },
})

export default function RootLayout() {
  useFrameworkReady()

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="auth/login" options={{ presentation: 'modal' }} />
          <Stack.Screen name="auth/register" options={{ presentation: 'modal' }} />
          <Stack.Screen name="payments" />
          <Stack.Screen name="elders" />
          <Stack.Screen name="prayer-requests" />
          <Stack.Screen name="member-directory" />
          <Stack.Screen name="devotional" />
          <Stack.Screen name="contact" />
          <Stack.Screen name="report-issue" />
          <Stack.Screen name="church-calendar" />
          <Stack.Screen name="profile/children" />
          <Stack.Screen name="admin/dashboard" />
          <Stack.Screen name="admin/members" />
          <Stack.Screen name="admin/notifications" />
          <Stack.Screen name="admin/announcements" />
          <Stack.Screen name="admin/payments" />
          <Stack.Screen name="admin/events" />
          <Stack.Screen name="admin/groups" />
          <Stack.Screen name="admin/export" />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </AuthProvider>
    </QueryClientProvider>
  )
}
