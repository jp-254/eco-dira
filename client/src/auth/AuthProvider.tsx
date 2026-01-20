import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import type { Me } from "./AuthContext";
import { API_BASE, getToken, saveToken, clearToken } from "../services/auth";

export default function AuthProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [me, setMe] = useState<Me>(null);
	const [loading, setLoading] = useState(true);

	async function fetchMe(token: string) {
		const res = await fetch(`${API_BASE}/api/auth/me`, {
			headers: { Authorization: `Bearer ${token}` },
		});
		if (!res.ok) throw new Error("Invalid token");
		return res.json();
	}

	async function login(token: string) {
		saveToken(token);
		const data = await fetchMe(token);
		setMe(data);
	}

	function logout() {
		clearToken();
		setMe(null);
	}

	useEffect(() => {
		const token = getToken();
		if (!token) {
			setLoading(false);
			return;
		}

		fetchMe(token)
			.then(setMe)
			.catch(() => {
				clearToken();
				setMe(null);
			})
			.finally(() => setLoading(false));
	}, []);

	return (
		<AuthContext.Provider value={{ me, loading, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
}
