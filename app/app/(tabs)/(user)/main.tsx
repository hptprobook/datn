import { ThemedView } from '@/components/ThemedView';
import { Iconic } from '@/components/icon/Iconic';
import * as SecureStore from 'expo-secure-store';

import { router } from 'expo-router';
import { useState, useEffect, useCallback } from 'react';
const packageJson = require('@/package.json');
import {
	StyleSheet,
	Image,
	Alert,
	View,
	Text,
	TouchableOpacity,
	FlatList,
	VirtualizedList,
	Switch,
	Platform,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useSession } from '@/auth/ctx';
import { useStorageState } from '@/auth/useStorageState';
import { showToast } from '@/utils/toast';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

type ItemData = {
	id: string;
	title: string;
	icon: any;
	hidden?: boolean;
	toggle?: boolean;
};
const DATA: ItemData[] = [
	{
		id: 'profile',
		title: 'Hồ sơ',
		icon: 'person-circle-outline',
	},
	{
		id: 'parameter',
		title: 'Thông số',
		icon: 'person-outline',
	},
	{
		id: 'notification',
		title: 'Thông báo',
		icon: 'notifications-outline',
		toggle: true, // Add this line
		hidden: true,
	},
	// {
	// 	id: 'bd7acbea-c1da-46c2-aed5-3ad53abb28ba',
	// 	title: 'Cài đặt',
	// 	icon: 'settings-outline',
	// },
];

const DATA2: ItemData[] = [
	{
		id: 'rate',
		title: 'Đánh giá',
		icon: 'star-outline',
		hidden: true,
	},
	{
		id: 'version',
		title: `Phiên bản ${packageJson.version}`,
		icon: 'alert-circle-outline',
		hidden: true,
	},
	{
		id: 'tas',
		title: 'Điều khoản và dịch vụ',
		icon: 'book-outline',
	},
	{
		id: 'log-out',
		title: 'Đăng xuất',
		icon: 'exit-outline',
		hidden: true,
	},
];

type ItemProps = {
	item: ItemData;
	onPress: () => void;
};
Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: true,
		shouldSetBadge: false,
	}),
});
const Item = ({
	item,
	onPress,
	isToggleSwitchOn,
	setIsToggleSwitchOn,
}: ItemProps) => (
	<TouchableOpacity onPress={onPress} style={[styles.item]}>
		<View style={styles.itemLeft}>
			<Iconic name={item.icon} style={styles.icon} />
			<Text style={[styles.label]}>{item.title}</Text>
		</View>
		{item.toggle && (
			<Switch
				value={isToggleSwitchOn}
				onValueChange={(value) => setIsToggleSwitchOn(value)}
			/>
		)}
		{item.hidden !== true && (
			<FontAwesome name="chevron-right" size={16} color="black" />
		)}
	</TouchableOpacity>
);
async function registerForPushNotificationsAsync() {
	let token;

	if (Platform.OS === 'android') {
		await Notifications.setNotificationChannelAsync('default', {
			name: 'default',
			importance: Notifications.AndroidImportance.MAX,
			vibrationPattern: [0, 250, 250, 250],
			lightColor: '#FF231F7C',
		});
	}

	if (Device.isDevice) {
		const { status: existingStatus } =
			await Notifications.getPermissionsAsync();
		let finalStatus = existingStatus;
		if (existingStatus !== 'granted') {
			const { status } = await Notifications.requestPermissionsAsync();
			finalStatus = status;
		}
		if (finalStatus !== 'granted') {
			if (Device.brand !== 'Apple' && Device.brand !== 'Microsoft') {
				// Check if the device is not a PC
				// No alert, just return
				return;
			}
		}
		token = (
			await Notifications.getExpoPushTokenAsync({
				projectId: 'fe578bec-6565-4590-b832-edb66bbb355f',
			})
		).data;
	} else {
		if (Device.brand !== 'Apple' && Device.brand !== 'Microsoft') {
			// Check if the device is not a PC
			// No alert, just return
			return;
		}
	}

	return token;
}

export default function UserMainScreen() {
	const { signOut } = useSession();
	const [[isLoading, session], setSession] = useStorageState('session');
	// Add a state variable for the notification toggle
	const [expoPushToken, setExpoPushToken] = useState('');
	const [isToggleSwitchOn, setIsToggleSwitchOn] = useState(false);
	useEffect(() => {
		registerForPushNotificationsAsync()
			.then((token) => setExpoPushToken(token))
			.catch((err) => console.log(err));
	}, []);

	const sendNotification = useCallback(async () => {
		const message = {
			to: expoPushToken,
			sound: 'default',
			title: 'Nhắc nhở  bài tập',
			body: 'Bài tập hàng ngày của bạn đã sẵn sàng. Hãy bắt đầu ngay!',
		};

		await fetch('https://exp.host/--/api/v2/push/send', {
			method: 'POST',
			headers: {
				host: 'exp.host',
				accept: 'application/json',
				'accept-encoding': 'gzip, deflate',
				'content-type': 'application/json',
			},
			body: JSON.stringify(message),
		});
	}, [expoPushToken]);

	useEffect(() => {
		let intervalId;

		if (isToggleSwitchOn) {
			intervalId = setInterval(() => {
				sendNotification();
			}, 10800000); // 3 hours in milliseconds
		}

		return () => {
			if (intervalId) {
				clearInterval(intervalId);
			}
		};
	}, [isToggleSwitchOn, sendNotification]);

	//
	const handlePress = (id: string) => {
		switch (id) {
			case 'log-out':
				Alert.alert('Đăng xuất', 'Bạn có chắc chắn muốn đăng xuất?', [
					{
						text: 'Hủy',
						style: 'cancel',
					},
					{
						text: 'Đăng xuất',
						onPress: () => {
							signOut();
							showToast('Đã đăng xuất khỏi hệ thống');
							SecureStore.deleteItemAsync("token")
							router.replace('/sign-in');
						},
					},
				]);
				break;
			case 'rate':
				showToast('Chức năng đánh giá đang được phát triển');
				break;
			case 'parameter':
				router.push('/parameter');
				break;
			case 'tas':
				router.push('/tas');
				break;
			case 'profile':
				router.push('/profile');
				break;
			case 'notification':
				setIsToggleSwitchOn(!isToggleSwitchOn);
				break;
			default:
				console.log('default');
				break;
		}
	};
	const renderItem = ({ item }: { item: ItemData }) => {
		return (
			<Item
				item={item}
				onPress={() => handlePress(item.id)}
				isToggleSwitchOn={isToggleSwitchOn}
				setIsToggleSwitchOn={setIsToggleSwitchOn}
			/>
		);
	};
	return (
		<ThemedView style={styles.container}>
			<View>
				<Text style={styles.title}>Tổng quan</Text>
				<FlatList
					data={DATA}
					renderItem={renderItem}
					keyExtractor={(item) => item.id}
				/>
			</View>
			<View>
				<Text style={styles.title}>Về chúng tôi</Text>
				<FlatList
					data={DATA2}
					renderItem={renderItem}
					keyExtractor={(item) => item.id}
				/>
			</View>
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 12,
	},
	content: {
		backgroundColor: '#F5F5F5',
	},
	itemLeft: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
	},
	item: {
		padding: 8,
		borderRadius: 8,
		marginVertical: 4,
		marginHorizontal: 8,
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		backgroundColor: '#F5F5F5',
		fontWeight: 'bold',
	},
	title: {
		fontSize: 16,
		marginTop: 8,
		marginBottom: 8,
		fontWeight: 'semibold',
		color: '#222222',
	},
	label: {
		fontSize: 16,
		marginTop: 8,
		marginBottom: 8,
		fontWeight: 'bold',
		color: '#222222',
	},
	icon: {
		marginRight: 8,
		fontWeight: 'bold',
	},
});
