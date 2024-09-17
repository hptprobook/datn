import React, { useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colorTheme } from '@/utils/colors';
import { router } from 'expo-router';
interface OnBoardingScreenProps {
	setisFirst: React.Dispatch<React.SetStateAction<boolean>>;
}
interface OnboardingItem {
	url: string;
	title: string;
	subtitle: string;
}
const OnBoardingScreen = () => {
	const handleSkip = async () => {
		await AsyncStorage.setItem('firstLogin', 'true');
		router.push('/sign-in');
	};
	const DoneButtonComponent = () => {
		return (
			<TouchableOpacity onPress={handleSkip} style={{ marginRight: 20 }}>
				<View>
					<Text style={{ fontSize: 16 }}>Khám phá ngay</Text>
				</View>
			</TouchableOpacity>
		);
	};

	const data: OnboardingItem[] = [
		{
			url: 'https://i.pinimg.com/564x/24/c7/06/24c7061d68e52c77b381f86ef32873a6.jpg',
			title: 'Onboarding',
			subtitle: 'Done with React Native Onboarding Swiper',
		},
		{
			url: 'https://i.pinimg.com/564x/22/45/7c/22457c17f09fc866d3c27fd9a999e350.jpg',
			title: 'Onboarding1',
			subtitle: 'Done with React Native Onboarding Swiper',
		},
		{
			url: 'https://i.pinimg.com/564x/e4/27/44/e42744255952f7af0a9e3b72c3f89da9.jpg',
			title: 'Onboarding2',
			subtitle: 'Done with React Native Onboarding Swiper',
		},
	];

	return (
		<View style={styles.home}>
			<Onboarding
				onSkip={() => handleSkip()}
				skipLabel={'Bỏ qua'}
				nextLabel={'Xem tiếp'}
				onDone={handleSkip}
				DoneButtonComponent={DoneButtonComponent}
				bottomBarHeight={60}
				// bottomBarColor={colorTheme.background.secondary}
				pages={data.map((item) => ({
					backgroundColor: colorTheme.background.secondary,
					image: <Image source={{ uri: item.url }} style={styles.img} />,
					title: item.title,
					subtitle: item.subtitle,
				}))}
			/>
		</View>
	);
};

export default OnBoardingScreen;

const styles = StyleSheet.create({
	home: {
		height: Dimensions.get('window').height,
		backgroundColor: colorTheme.white,
	},
	img: {
		width: Dimensions.get('window').width,
		height: Dimensions.get('window').height * 0.5,
	},
});
