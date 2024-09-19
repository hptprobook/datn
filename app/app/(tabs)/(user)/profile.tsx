import { ThemedView } from '@/components/ThemedView';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
	StyleSheet,
	View,
	Text,
	TouchableOpacity,
	FlatList,
	Modal,
	Pressable,
	TextInput,
	Alert,
} from 'react-native';
import { useSession } from '@/auth/ctx';
import { showToast } from '@/utils/toast';
import { colorTheme } from '@/utils/colors';
import { Picker } from '@react-native-picker/picker';

type ItemProps = { title: string; icon: any; style: any };

const Item = ({ title, icon, style }: ItemProps) => (
	<View style={style}>
		<MaterialCommunityIcons name={icon} size={24} color="black" />
		<Text style={styles.label}>{title}</Text>
	</View>
);
const apiUrl = process.env.EXPO_PUBLIC_API_URL;
export default function UserProfileScreen() {
	const [modalVisible, setModalVisible] = useState(false);
	const { session, signIn } = useSession();
	const [name, onChangeName] = useState('');
	const [gender, setSelectedGender] = useState<string>('1');
	const [age, onChangeAge] = useState<string>('1');
	const data = session ? JSON.parse(session) : null;
	const [disabled, setDisabled] = useState(false);
	const renderGender = (id: string) => {
		switch (id) {
			case '1':
				return 'Nam';
			case '2':
				return 'Nữ';
			default:
				return 'Khác';
		}
	};

	useEffect(() => {
		if (data) {
			onChangeName(data.name);
			setSelectedGender(data.gender);
			onChangeAge(data.age ? String(data.age) : '3');
		}
	}, []);

	const validateName = (name: string): boolean => {
		if (!name || name.trim().length < 2) {
			Alert.alert('Lỗi', 'Tên phải có ít nhất 2 ký tự.');
			return false;
		}
		return true;
	};

	const validateAge = (age: string): boolean => {
		const ageNumber = parseInt(age, 10);
		if (isNaN(ageNumber) || ageNumber < 1 || ageNumber > 120) {
			Alert.alert('Lỗi', 'Tuổi phải là số hợp lệ từ 1 đến 120.');
			return false;
		}
		return true;
	};

	const handleSave = () => {
		if (validateName(name) && validateAge(age)) {
			setDisabled(true);
			fetch(`${apiUrl}/users`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${data.token}`,
				},
				body: JSON.stringify({
					name,
					age,
					gender,
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
							if (data.success === true) {
								showToast(data.message);
								signIn(data.data);
								setModalVisible(!modalVisible);
								setDisabled(false);
							} else {
								showToast(data.message);
							}
						}
					} catch (error) {
						Alert.alert('Error', 'Failed to parse server response');
					}
				})
				.catch((error) => {
					Alert.alert('Error', error.message);
				});
			// setModalVisible(!modalVisible);
		}
	};

	const USER_INFO = [
		{
			id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
			title: data.name,
			icon: 'account',
		},
		{
			id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
			title: data.email,
			icon: 'email-outline',
		},
		{
			id: '58694a0f-3da1-471f-bd96-145571e29e72',
			title: renderGender(data.gender),
			icon: 'gender-male-female',
		},
		{
			id: '58694a0f-3da1-471f-bd96-145571e29s72',
			title: data.age ? `${data.age} tuổi` : 'Chưa cập nhật',
			icon: 'account-sync-outline',
		},
	];

	return (
		<ThemedView style={styles.container}>
			<View style={styles.mainInfo}>
				<Text style={styles.name}>{data.name}</Text>
				<Text style={styles.email}>{data.email}</Text>
			</View>
			<View style={styles.secondaryInfo}>
				<Text style={styles.title}>Thông tin cá nhân</Text>
				<FlatList
					data={USER_INFO}
					renderItem={({ item, index }) => (
						<Item
							title={item.title}
							icon={item.icon}
							style={[
								styles.item,
								index === USER_INFO.length - 1 ? styles.lastItem : {},
							]}
						/>
					)}
					keyExtractor={(item) => item.id}
				/>
			</View>
			<View style={styles.buttonContainer}>
				<TouchableOpacity
					style={styles.button}
					onPress={() => setModalVisible(true)}
				>
					<Text style={{ color: '#fff' }}>Chỉnh sửa</Text>
				</TouchableOpacity>
			</View>
			<Modal
				animationType="fade"
				transparent={true}
				visible={modalVisible}
				onRequestClose={() => {
					setModalVisible(!modalVisible);
				}}
			>
				<View style={styles.centeredView}>
					<View style={styles.modalView}>
						<Text style={styles.modalText}>Chỉnh sửa thông tin:</Text>
						<TextInput
							style={styles.input}
							onChangeText={(text) => onChangeName(text)}
							value={name}
							placeholder="Tên"
						/>
						<TextInput
							style={styles.input}
							onChangeText={(text) => onChangeAge(text)}
							value={age}
							placeholder="Tuổi"
						/>
						<Picker
							style={styles.input}
							selectedValue={gender}
							onValueChange={(itemValue) => setSelectedGender(itemValue)}
						>
							<Picker.Item label="Nam" value="1" />
							<Picker.Item label="Nữ" value="2" />
							<Picker.Item label="Khác" value="3" />
						</Picker>
						<Pressable
							style={[styles.button, styles.buttonClose]}
							onPress={handleSave}
							disabled={disabled}
						>
							<Text style={styles.textStyle}>Lưu</Text>
						</Pressable>
					</View>
				</View>
			</Modal>
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 12,
	},
	mainInfo: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		padding: 12,
	},
	name: {
		fontSize: 24,
		marginBottom: 6,
		fontWeight: 'bold',
	},
	email: {
		fontSize: 16,
	},
	secondaryInfo: {
		padding: 16,
		marginVertical: 8,
		marginHorizontal: 16,
		borderRadius: 32,
		borderWidth: 1,
		borderColor: '#e0e0e0',
	},
	buttonContainer: {
		marginVertical: 8,
		marginHorizontal: 16,
	},
	button: {
		backgroundColor: colorTheme.background.primary,
		padding: 12,
		borderRadius: 32,
		display: 'flex',
		alignItems: 'center',
	},
	item: {
		marginVertical: 8,
		marginHorizontal: 12,
		padding: 12,
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		borderBottomWidth: 1,
		borderBottomColor: '#e0e0e0',
	},
	lastItem: {
		borderBottomWidth: 0,
	},
	label: {
		fontSize: 16,
		marginLeft: 16,
	},
	title: {
		fontSize: 16,
		fontWeight: 'bold',
		marginBottom: 16,
		marginLeft: 16,
	},
	centeredView: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 22,
		padding: 16,
	},
	modalView: {
		margin: 20,
		backgroundColor: 'white',
		borderRadius: 20,
		width: '100%',
		shadowColor: '#000',
		padding: 32,
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
	buttonOpen: {
		backgroundColor: '#F194FF',
	},
	buttonClose: {
		margin: 12,
		backgroundColor: colorTheme.background.primary,
	},
	textStyle: {
		color: 'white',
		fontWeight: 'bold',
		textAlign: 'center',
	},
	modalText: {
		marginBottom: 15,
		fontSize: 16,
		fontWeight: 'bold',
	},
	input: {
		margin: 12,
		borderWidth: 2,
		paddingVertical: 8,
		paddingHorizontal: 16,
		borderRadius: 24,
		borderColor: '#e0e0e0',
	},
});
