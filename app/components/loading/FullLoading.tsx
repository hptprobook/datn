import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

const FullLoading = () => (
	<View style={styles.container}>
		<ActivityIndicator size="large" color="#00ff00" />
	</View>
);

const styles = StyleSheet.create({
	container: {
		flex: 1,
		display: 'flex',
		justifyContent: 'center',
		height: 240,
		alignItems: 'center',
	},
});

export default FullLoading;
