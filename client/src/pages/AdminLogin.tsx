// src/pages/AdminLogin.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin, saveToken } from "../services/auth";

export default function AdminLogin() {
	const navigate = useNavigate();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError(null);

		try {
			const res = await adminLogin({ username, password });

			// runtime guards for optional fields returned by the service
			if (!res || typeof res.token !== "string") {
				throw new Error("Login did not return a token");
			}
			if (!res.admin) {
				throw new Error("Login did not return admin data");
			}

			saveToken(res.token);
			console.log("Admin logged in:", res.admin.username, res.admin.role);
			navigate("/admin", { replace: true });
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

			<button
				type="submit"
				className="bg-green-600 text-white p-2 rounded w-full">
				Login
			</button>

			{error && <p className="text-red-600 mt-3">{error}</p>}
		</form>
	);
}
