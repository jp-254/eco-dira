// src/pages/AdminLogin.tsx
import { useState } from "react";
import { adminLogin, saveToken } from "../services/auth";
import type { AdminLoginResponse } from "../types/auth";

export default function AdminLogin() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError(null);

		try {
			const res: AdminLoginResponse = await adminLogin({
				username,
				password,
			});

			saveToken(res.token);

			console.log("Admin logged in:", res.admin.username, res.admin.role);
			// navigate to admin dashboard here
		} catch (err) {
			setError((err as Error).message);
		}
	}

	return (
		<form onSubmit={handleSubmit} className="p-4">
			<h1 className="text-2xl mb-4 font-bold">Admin Login</h1>

			<input
				value={username}
				onChange={(e) => setUsername(e.target.value)}
				className="border p-2 w-full mb-3"
				placeholder="Username"
			/>

			<input
				type="password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				className="border p-2 w-full mb-3"
				placeholder="Password"
			/>

			<button className="bg-green-600 text-white p-2 rounded w-full">
				Login
			</button>

			{error && <p className="text-red-600 mt-3">{error}</p>}
		</form>
	);
}
