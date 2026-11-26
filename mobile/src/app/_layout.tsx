import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { AppStoreProvider } from '@/store/app-store';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = useTheme();
  const navTheme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;
  return (
    <ThemeProvider
      value={{
        ...navTheme,
        colors: { ...navTheme.colors, primary: theme.tint, background: theme.background, card: theme.backgroundElement, border: theme.border, text: theme.text },
      }}>
      <AppStoreProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerBackButtonDisplayMode: 'minimal',
            headerStyle: { backgroundColor: theme.tint },
            headerTintColor: '#FFFFFF',
            headerTitleStyle: { fontWeight: '700' },
            headerShadowVisible: false,
            contentStyle: { backgroundColor: theme.background },
          }}>
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
