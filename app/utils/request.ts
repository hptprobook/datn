const apiUrl = process.env.EXPO_PUBLIC_API_URL;
type RequestParams = {
	url: string;
	token: string;
	method: string;
	dataRequest?: any;
	setData: (data: any) => void;
	setLoading: (loading: boolean) => void;
	setError: (error: any) => void;
};
export const request = async ({
	url,
	token,
	method,
	dataRequest,
	setData,
	setLoading,
	setError,
}: RequestParams) => {
	setLoading(true);
	try {
		let options: any = {
			method,
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		};

		if (dataRequest) {
			options.body = dataRequest;
		}

		const response = await fetch(`${apiUrl}/${url}`, options);

		if (!response.ok) {
			throw new Error('Network response was not ok');
		}

		const json = await response.json();
		setData(json);
	} catch (error) {
		setError(error);
	} finally {
		setLoading(false);
	}
};
