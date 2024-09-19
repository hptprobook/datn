import {
	DarkTheme,
	DefaultTheme,
	ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function SettingLayout() {
	return (
		<Stack>
			<Stack.Screen name="main" options={{ headerTitle: 'Cá nhân' }} />
			<Stack.Screen name="parameter" options={{ headerTitle: 'Thông số' }} />
			<Stack.Screen name="profile" options={{ headerTitle: 'Hồ sơ' }} />
			<Stack.Screen
				name="tas"
				options={{ headerTitle: 'Điều khoản và dịch vụ' }}
			/>
		</Stack>
	);
}
