// client/src/hooks/useAuth.ts
import { useEffect, useState } from "react";
import { API_BASE, getToken } from "../services/auth";

export type Admin = {
	id: string;
	username: string;
	role?: string;
};

export type Operator = {
	id: string;
	email: string;
	name?: string;
};

export type ClientUser = {
	id: string;
	client_id?: string;
	name?: string;
	pointsBalance?: number;
};

export type Me = {
	role: "admin" | "operator" | "client";
	admin?: Admin;
	operator?: Operator;
	client?: ClientUser;
} | null;

export function useAuth() {
	const [me, setMe] = useState<Me>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		(async () => {
			const token = getToken();
			if (!token) {
				setLoading(false);
				setMe(null);
				return;
			}
			try {
				const res = await fetch(`${API_BASE}/api/auth/me`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				if (!res.ok) {
					setMe(null);
					setLoading(false);
					return;
				}
				const body = await res.json();
				setMe(body);
			} catch (err) {
				console.error("Failed to fetch auth user:", err);
				setMe(null);
			} finally {
				setLoading(false);
			}
		})();
	}, []);

	return { me, loading, refresh: () => window.location.reload() };
}
