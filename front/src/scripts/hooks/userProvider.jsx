import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useEnv } from "./useEnv";
import { getHeaders } from "../services/userServices";

export const UserContext = createContext();
export const UserProvider = ({ children }) => {
	const [user, setUser] = useState(undefined);
	const env = useEnv();

	useEffect(() => {
		if (user) return;
		const stored = localStorage.getItem("user");
		
		if (!stored || stored == null)
		{
			setUser(null);
			return;
		}

		const data = JSON.parse(stored);
		setUser(data);

		axios.get(env.api, { headers: getHeaders(data)}).then(res => {
			setUser(res.data);
		}).catch(err => {
			setUser(null);
		})
		
	}, [])

	useEffect(() => {
		if (user === undefined)
			return;

		const json = JSON.stringify(user);		
		localStorage.setItem('user', json);
	}, [user])

	return <UserContext.Provider value={{user, setUser}}>{children}</UserContext.Provider>
}