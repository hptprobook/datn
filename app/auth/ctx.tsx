import React from 'react';
import { useStorageState } from './useStorageState';

const AuthContext = React.createContext<{
	signIn: (data: any) => void;
	signOut: () => void;
	session?: string | null;
	isLoading: boolean;
}>({
	signIn: (data) => null,
	signOut: () => null,
	session: null,
	isLoading: false,
});

// This hook can be used to access the user info.
export function useSession() {
	const value = React.useContext(AuthContext);
	if (process.env.NODE_ENV !== 'production') {
		if (!value) {
			throw new Error('useSession must be wrapped in a <SessionProvider />');
		}
	}

	return value;
}

export function SessionProvider(props: React.PropsWithChildren) {
	const [[isLoading, session], setSession] = useStorageState('session');

	return (
		<AuthContext.Provider
			value={{
				signIn: (data) => {
					// Perform sign-in logic here
					const userString = JSON.stringify(data);
					// Perform sign-in logic here with the user string
					setSession(userString);
				},
				signOut: () => {
					setSession(null);
				},
				session,
				isLoading,
			}}
		>
			{props.children}
		</AuthContext.Provider>
	);
}
