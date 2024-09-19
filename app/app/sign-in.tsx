import {
	SafeAreaView,
	StyleSheet,
	TextInput,
	View,
	TouchableOpacity,
	Text,
	Button,
	Alert,
	
	Image,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import { colorTheme } from '@/utils/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSession } from '@/auth/ctx';
import { router } from 'expo-router';
import { showToast } from '@/utils/toast';
const apiUrl = process.env.EXPO_PUBLIC_API_URL;
import Entypo from '@expo/vector-icons/Entypo';
import { Link } from 'expo-router';
import Toast from 'react-native-toast-message';
export default function SignIn() {
	const { signIn } = useSession();
	const [password, onChangePassword] = useState('');
	const [email, onChangeText] = useState('');
	const [secureTextEntry, setSecureTextEntry] = useState(true);

	const handleLogin = () => {
		const check = validateForm();
		if (!check) {
			return;
		}
		console.log(apiUrl);
		fetch(`${apiUrl}api/auth/login`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				email,
				password,
			}),
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error('Network response was not ok');
				}
				return response.text(); // Get the raw response text
			})
			.then((text) => {
				try {
					const data = JSON.parse(text); // Attempt to parse the response as JSON
					if (data.error) {
						Alert.alert('Error', data.error);
					} else {
						console.log(data);
						if (data) {
							if (data) {
								Toast.show({
									type: 'success',
									text1: 'Đăng nhập thành công',
								  });
								  router.replace('/');
								  SecureStore.setItemAsync("token", data.token)
								  signIn(data.token);
								}
							else{
								Toast.show({
									type: 'error',
									text1: 'Đăng nhập thất bại',
								});
							}
						}
						

					}
				} catch (error) {
					Alert.alert('Error', 'Failed to parse server response');
				}
			})
			.catch((error) => {
				Alert.alert('Error', error.message);
			});
	};

	type Errors = {
		email?: string;
		password?: string;
	};
	const [errors, setErrors] = useState<Errors>({});

	const validateForm = () => {
		let errors: Errors = {};
		// Validate email field
		if (!email) {
			errors.email = 'Email là bắt buộc.';
		} else if (!/\S+@\S+\.\S+/.test(email)) {
			errors.email = 'Email không hợp lệ.';
		}

		// Validate password field
		if (!password) {
			errors.password = 'Mật khẩu là bắt buộc.';
		} else if (password.length < 3) {
			errors.password = 'Mật khẩu phải có ít nhất 3 ký tự.';
		}
		if (Object.keys(errors).length != 0) {
			setErrors(errors);
			return false;
		}
		setErrors({});
		return true;
	};
	useEffect(() => {
		const checkFirstLogin = async () => {
			try {
				const firstLogin = await AsyncStorage.getItem('firstLogin');
				if (firstLogin === null) {
					// Navigate to OnBoarding screen
				}
			} catch (error) {
				console.error('Failed to load first login status.', error);
			}
		};
		checkFirstLogin();
	}, [router]);

	return (
		<View
			style={{
				flex: 1,
				justifyContent: 'center',
				alignItems: 'center',
				backgroundColor: colorTheme.background.secondary,
			}}
		>
			<Image
				style={styles.image}
				source={{
                    uri: 'https://i.pinimg.com/736x/9f/93/ae/9f93ae8f39417cd575e735bf5f1b1505.jpg',
				}}
			/>
			<Text style={{ fontFamily: 'LeagueLight', fontSize: 32, margin: 8 }}>
				Đăng nhập
			</Text>
			<Text
				style={{
					fontFamily: 'LeagueMedium',
					marginBottom: 20,
					fontSize: 16,
				}}
			>
					Wow store
				</Text>

			<SafeAreaView>
				<Text style={{ fontFamily: 'LeagueLight', fontSize: 16 }}>
					Email
				</Text>
				<TextInput
					style={styles.inputDone}
					onChangeText={onChangeText}
					placeholder="Nhập tên đăng nhập"
					value={email}
				/>
				{errors.email && <Text style={styles.error}>{errors.email}</Text>}
				<Text
					style={{ fontFamily: 'LeagueLight', fontSize: 16, marginTop: 12 }}
				>
					Mật khẩu
				</Text>
				<View style={styles.passwordContainer}>
					<TextInput
						style={styles.passwordInput}
						onChangeText={onChangePassword}
						value={password}
						placeholder="Mật khẩu"
						secureTextEntry={secureTextEntry}
					/>
					<TouchableOpacity
						style={styles.toggleButton}
						onPress={() => setSecureTextEntry(!secureTextEntry)}
					>
						<Text>
							{secureTextEntry ? (
								<Entypo name="eye" size={16} color="black" />
							) : (
								<Entypo name="eye-with-line" size={16} color="black" />
							)}
						</Text>
					</TouchableOpacity>
				</View>
				{errors.password && <Text style={styles.error}>{errors.password}</Text>}
				<TouchableOpacity
					style={[
						styles.button,
						{ opacity: email == '' || password == '' ? 0.5 : 1 },
					]}
					disabled={email == '' || password == ''}
					onPress={handleLogin}
				>
					<Text style={styles.textButton}>Đăng nhập</Text>
				</TouchableOpacity>
			</SafeAreaView>
			<Text style={{ fontFamily: 'LeagueLight', marginTop: 20 }}>
				Chưa có tài khoản? <Link href="/register">Đăng ký ngay</Link>
			</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	inputDone: {
		fontFamily: 'LeagueLight',
		marginTop: 10,
		fontSize: 16,
		marginBottom: 10,
		paddingHorizontal: 12,
		paddingVertical: 12,
		elevation: 0,
		borderRadius: 2,
		width: 300,
		borderColor: colorTheme.background.primary,
		backgroundColor: colorTheme.white,
	},

	button: {
		backgroundColor: colorTheme.background.primary,
		padding: 12,
		borderRadius: 36,
		marginTop: 20,
		width: 300,
		textAlign: 'center',
		alignItems: 'center',
	},
	textButton: {
		color: colorTheme.white,
	},
	passwordContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 12,
		marginTop: 12,
		borderRadius: 2,
		backgroundColor: colorTheme.white,
	},
	passwordInput: {
		flex: 1,
		fontFamily: 'LeagueLight',
		fontSize: 16,
		paddingHorizontal: 12,
		paddingVertical: 12,
		elevation: 0,
		borderRadius: 2,
		borderColor: colorTheme.background.primary,
		backgroundColor: colorTheme.white,
	},
	error: {
		color: colorTheme.lightRed,
		fontFamily: 'LeagueLight',
		marginBottom: 10,
		fontSize: 16,
	},
	toggleButton: {
		padding: 10,
	},
	image: {
		width: 80,
		height: 80,
		objectFit: 'cover',
	},
});
