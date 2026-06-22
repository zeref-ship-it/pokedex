import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { FavoritesProvider } from '@/context/FavoritesContext';
import ErrorBoundary from '@/components/ErrorBoundary';
import { COLORS } from '@/constants/theme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const loadFonts = async () => {
      try {
        await Font.loadAsync({
          Poppins: require('@/assets/fonts/Poppins-Regular.ttf'),
          'Poppins-SemiBold': require('@/assets/fonts/Poppins-SemiBold.ttf'),
          'Poppins-Bold': require('@/assets/fonts/Poppins-Bold.ttf'),
        });
      } catch (e) {
        console.warn('Font loading failed, using system fonts:', e);
      } finally {
        setFontsLoaded(true);
      }
    };

    loadFonts();
  }, []);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // Safety: hide splash after timeout even if fonts fail
  useEffect(() => {
    const timeout = setTimeout(() => {
      SplashScreen.hideAsync();
      if (!fontsLoaded) setFontsLoaded(true);
    }, 5000);
    return () => clearTimeout(timeout);
  }, []);

  if (!fontsLoaded) return null;

  return (
    <ErrorBoundary>
      <FavoritesProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: COLORS.backgroundDark },
            animation: 'slide_from_right',
          }}
        />
      </FavoritesProvider>
    </ErrorBoundary>
  );
}
