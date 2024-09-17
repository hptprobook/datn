import { ToastAndroid } from 'react-native';

export const showToast = (mess: string) => {
	ToastAndroid.showWithGravity(mess, ToastAndroid.SHORT, ToastAndroid.CENTER);
};
