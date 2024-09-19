import { ThemedView } from '@/components/ThemedView';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text } from 'react-native';

const apiUrl = process.env.EXPO_PUBLIC_API_URL;
export default function TermsAndServicesScreen() {
	return (
		<ThemedView style={styles.container}>
			<Text>
				Điều khoản Dịch vụ cho Ứng dụng Chăm sóc Sức khỏe 1. Mục đích: Mục đích
				của Điều khoản Dịch vụ này ("Điều khoản") là quy định các điều khoản và
				điều kiện sử dụng ứng dụng chăm sóc sức khỏe [Tên ứng dụng] ("Ứng
				dụng"). Ứng dụng được cung cấp bởi Voi Tây Nguyên 2. Chấp nhận Điều
				khoản: Bằng cách truy cập và sử dụng Ứng dụng, bạn đồng ý tuân thủ tất
				cả các điều khoản và điều kiện của Điều khoản này. Nếu bạn không đồng ý
				với bất kỳ điều khoản nào trong Điều khoản này, bạn không được phép truy
				cập hoặc sử dụng Ứng dụng. 3. Quyền truy cập và Sử dụng: Đăng ký: Để sử
				dụng một số tính năng của Ứng dụng, bạn có thể cần tạo tài khoản. Bạn
				phải cung cấp thông tin chính xác và đầy đủ khi đăng ký tài khoản. Bảo
				mật: Bạn chịu trách nhiệm bảo mật thông tin đăng nhập tài khoản của
				mình. Bạn không được phép chia sẻ thông tin đăng nhập của mình với bất
				kỳ ai khác. Quyền truy cập: Công ty có quyền truy cập và sử dụng thông
				tin cá nhân của bạn để cung cấp Ứng dụng, cải thiện Ứng dụng và tuân thủ
				pháp luật. Sử dụng hợp lý: Bạn chỉ được phép sử dụng Ứng dụng cho các
				mục đích hợp pháp và đạo đức. Bạn không được phép sử dụng Ứng dụng để vi
				phạm pháp luật hoặc xâm hại quyền của người khác. 4. Nội dung: Nội dung
				của người dùng: Bạn có thể tải lên, chia sẻ và lưu trữ nội dung trong
				Ứng dụng. Bạn chịu trách nhiệm hoàn toàn về nội dung mà bạn tải lên hoặc
				chia sẻ. Quyền sở hữu trí tuệ: Công ty sở hữu tất cả quyền sở hữu trí
				tuệ đối với Ứng dụng. Bạn không được phép sao chép, sửa đổi, phân phối
				hoặc sử dụng Ứng dụng mà không có sự đồng ý bằng văn bản của Công ty. 5.
				Loại trừ trách nhiệm: Đảm bảo: Công ty không đảm bảo rằng Ứng dụng sẽ
				hoạt động không ngừng nghỉ hoặc không có lỗi. Hại hóc: Công ty không
				chịu trách nhiệm cho bất kỳ thiệt hại nào phát sinh từ việc sử dụng Ứng
				dụng, bao gồm nhưng không giới hạn ở mất dữ liệu, mất lợi nhuận hoặc tổn
				hại tinh thần. 6. Chấm dứt: Công ty có quyền chấm dứt quyền truy cập của
				bạn vào Ứng dụng bất kỳ lúc nào, với hoặc không có lý do. 7. Thay đổi:
				Công ty có thể thay đổi Điều khoản này bất kỳ lúc nào. Thay đổi sẽ có
				hiệu lực ngay khi được đăng trên Ứng dụng. 8. Luật pháp chi phối: Điều
				khoản này được chi phối và diễn giải theo luật pháp Việt Nam. 9. Liên
				hệ: Nếu bạn có bất kỳ câu hỏi nào về Điều khoản này, vui lòng liên hệ
				với Công ty tại [Địa chỉ email hoặc số điện thoại].
			</Text>
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 12,
	},
});
