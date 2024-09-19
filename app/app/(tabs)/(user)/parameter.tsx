import { ThemedView } from '@/components/ThemedView';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
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
	ScrollView,
} from 'react-native';
import { useSession } from '@/auth/ctx';
import { showToast } from '@/utils/toast';
import { colorTheme } from '@/utils/colors';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';

type ItemProps = { title: string; icon: any; style: any };

const Item = ({ title, icon, style }: ItemProps) => (
	<View style={style}>
		<MaterialCommunityIcons name={icon} size={24} color="black" />
		<Text style={styles.label}>{title}</Text>
	</View>
);
const apiUrl = process.env.EXPO_PUBLIC_API_URL;
const items = [
	{
		name: 'Bữa ăn',
		id: 0,
		children: [
			{ name: 'Bữa sáng', id: 10 },
			{ name: 'Bữa trưa', id: 11 },
			{ name: 'Bữa tối', id: 12 },
			{ name: 'Đồ ăn vặt', id: 13 },
		],
	},
	{
		name: 'Sở thích ăn uống',
		id: 1,
		children: [
			{ name: 'Ăn chay', id: 20 },
			{ name: 'Ăn chay nguyên liệu', id: 21 },
			{ name: 'Không gluten', id: 22 },
			{ name: 'Ăn kiêng Keto', id: 23 },
			{ name: 'Ăn theo chế độ Paleo', id: 24 },
		],
	},
];

export default function UserProfileScreen() {
	const [modalVisible, setModalVisible] = useState(false);
	const [modal2Visible, setModal2Visible] = useState(false);

	const { session, signIn } = useSession();
	const [name, onChangeName] = useState('');
	const [gender, setSelectedGender] = useState<string>('1');
	const [age, onChangeAge] = useState<string>('1');
	const [weight, onChangeWeight] = useState<string>('');
	const [height, onChangeHeight] = useState<string>('');
	const [selectedItems, setSelectedItems] = useState([]);

	const onSelectedItemsChange = (selectedItems: any) => {
		setSelectedItems(selectedItems);
	};
	const data = session ? JSON.parse(session) : null;
	const [disabled, setDisabled] = useState(false);

	useEffect(() => {
		if (data) {
			onChangeName(data.name);
			setSelectedGender(data.gender);
			onChangeAge(data.age ? String(data.age) : '3');
			onChangeAge(data.weight ? String(data.weight) : '');
			onChangeAge(data.height ? String(data.height) : '');
		}
	}, []);

	const validateHeight = (height: string): boolean => {
		const heightNumber = parseFloat(height);
		if (isNaN(heightNumber) || heightNumber < 50 || heightNumber > 300) {
			Alert.alert('Lỗi', 'Chiều cao phải là số hợp lệ từ 50 đến 300 cm.');
			return false;
		}
		return true;
	};

	const validateWeight = (weight: string): boolean => {
		const weightNumber = parseFloat(weight);
		if (isNaN(weightNumber) || weightNumber < 3 || weightNumber > 500) {
			Alert.alert('Lỗi', 'Cân nặng phải là số hợp lệ từ 3 đến 500 kg.');
			return false;
		}
		return true;
	};

	const handleSave = () => {
		if (validateHeight(height) && validateWeight(weight)) {
			setDisabled(true);
			fetch(`${apiUrl}/users`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${data.token}`,
				},
				body: JSON.stringify({
					height,
					weight: Number(weight),
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
								console.log(data.data);
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
		}
	};
	const handleSaveNutrition = () => {
		const getAllChildren = (items: any[]) => {
			return items.flatMap((item: any) => item.children);
		};

		// Sử dụng hàm để lấy danh sách tất cả các mục con
		const allChildren = getAllChildren(items);
		const nutritionArr = selectedItems.map((item) =>
			allChildren.find((child: any) => child.id === item)
		);
		const filteredData = nutritionArr.filter((item) => item !== undefined);
		const nutrition = filteredData.map((item: any) => item.name).join(', ');
		setDisabled(true);
		fetch(`${apiUrl}/users`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${data.token}`,
			},
			body: JSON.stringify({
				nutrition,
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
							setModal2Visible(!modal2Visible);
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
	};
	const USER_INFO = [
		{
			id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
			title: data.weight ? `${data.weight} kg` : 'Chưa cập nhật',
			icon: 'weight',
		},
		{
			id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
			title: data.height ? `${data.height} cm` : 'Chưa cập nhật',
			icon: 'human-male-height',
		},
		{
			id: '58694a0f-3da1-471f-bd96-145571e29e72',
			title: data.water ? `${data.water} ml` : 'Chưa cập nhật',
			icon: 'water',
		},
		{
			id: '58694a0f-3da1-471f-bd96-1455s1e29e72',
			title: data.sleep ? `${data.sleep} h` : 'Chưa cập nhật',
			icon: 'sleep',
		},
		{
			id: '58694a0f-3da1-471f-bd96-145571e29s72',
			title: data.nutrition ? data.nutrition : 'Chưa cập nhật',
			icon: 'nutrition',
		},

		{
			id: '58694a0f-3da1-471f-bd96-14557de29e72',
			title: data.fitness ? `${data.fitness} phút` : 'Chưa cập nhật',
			icon: 'run-fast',
		},
	];

	return (
		<ThemedView style={styles.container}>
			<View style={styles.secondaryInfo}>
				<Text style={styles.title}>Thông số cá nhân</Text>
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
					<Text style={{ color: '#fff' }}>Chỉnh sửa thông số cơ bản</Text>
				</TouchableOpacity>
			</View>
			<View style={styles.buttonContainer}>
				<TouchableOpacity
					style={styles.button}
					onPress={() => setModal2Visible(true)}
				>
					<Text style={{ color: '#fff' }}>Chỉnh sửa thói quen ăn uống</Text>
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
							onChangeText={(text) => onChangeHeight(text)}
							value={height}
							placeholder="Chiều cao"
						/>
						<TextInput
							style={styles.input}
							onChangeText={(text) => onChangeWeight(text)}
							value={weight}
							placeholder="Cân nặng"
						/>
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
			<Modal
				animationType="fade"
				transparent={true}
				visible={modal2Visible}
				onRequestClose={() => {
					setModal2Visible(!modal2Visible);
				}}
			>
				<View style={styles.centeredView}>
					<View style={styles.modalView}>
						<SectionedMultiSelect
							items={items}
							IconRenderer={MaterialIcons}
							uniqueKey="id"
							subKey="children"
							selectText="Chọn cái gì đó..."
							searchPlaceholderText="Tìm kiếm..."
							confirmText="Chọn"
							showDropDowns={true}
							onSelectedItemsChange={onSelectedItemsChange}
							selectedItems={selectedItems}
						/>
						<Pressable
							style={[styles.button, styles.buttonClose]}
							onPress={handleSaveNutrition}
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
