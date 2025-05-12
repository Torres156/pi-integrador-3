export function useEnv() {
	const { VITE_API_URL } = import.meta.env;

	if (!VITE_API_URL) {		
		throw new Error("VITE_API_URL não está definida no .env");		
	}
	
	return	{
		api: VITE_API_URL
	}
}