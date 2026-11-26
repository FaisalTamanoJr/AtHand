import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';

import { AppStoreProvider } from '@/store/app-store';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AppStoreProvider>
        <StatusBar style="auto" />
        <Stack screenOptions={{ headerBackButtonDisplayMode: 'minimal' }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false, title: 'AtHand' }} />
          <Stack.Screen name="listing/[id]" options={{ title: 'Item' }} />
          <Stack.Screen name="book/[id]" options={{ title: 'Request to borrow' }} />
          <Stack.Screen name="rental/[id]" options={{ title: 'Rental' }} />
          <Stack.Screen name="pay/[id]" options={{ title: 'Payment', presentation: 'modal' }} />
          <Stack.Screen name="check/[id]" options={{ title: 'Condition check' }} />
          <Stack.Screen name="chat/[id]" options={{ title: 'Chat' }} />
          <Stack.Screen name="new-listing" options={{ title: 'New listing' }} />
          <Stack.Screen name="verify" options={{ title: 'Verify your identity' }} />
        </Stack>
      </AppStoreProvider>
    </ThemeProvider>
  );
}
