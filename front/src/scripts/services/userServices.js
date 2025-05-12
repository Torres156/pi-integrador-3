import { useContext } from "react"
import { UserContext } from "../hooks/userProvider"

export function getHeaders(user, ...headers)
{
	const header = {
		...headers,
		'Authorization' : user?.token ?? "",
		'Content-Type' : 'application/json'
	}

	return header;
}

export function getConfigHeaders(user, ...headers)
{	
	const header = { headers:{
		...headers,
		'Authorization' : user?.token ?? "",
		'Content-Type' : 'application/json'
	}}

	return header;
}
