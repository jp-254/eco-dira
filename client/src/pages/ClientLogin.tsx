import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE, TOKEN_KEY } from "../services/auth";

export default function ClientLogin() {
	const [phone, setPhone] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const nav = useNavigate();

	async function submit(e: React.FormEvent) {
		e.preventDefault();
		setError("");

		try {
			const res = await fetch(`${API_BASE}/api/auth/client-login`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ phone, password }),
			});
			const body = await res.json();

			if (!res.ok) throw new Error(body.error || "Login failed");

			localStorage.setItem(TOKEN_KEY, body.token);
			nav(`/client/${body.client._id}`, { replace: true });
		} catch (err) {
			setError(err instanceof Error ? err.message : "Login failed");
		}
	}

	return (
		<form onSubmit={submit} className="space-y-4 max-w-md mx-auto">
			<h2 className="text-xl font-bold">Client Login</h2>

			<input
				value={phone}
				onChange={(e) => setPhone(e.target.value)}
				className="border p-2 w-full"
				placeholder="Phone"
			/>

			<input
				type="password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				className="border p-2 w-full"
				placeholder="Password"
			/>

			<button
				type="submit"
				className="bg-green-700 text-white p-2 w-full rounded">
				Login
			</button>

			{error && <p className="text-red-600">{error}</p>}
		</form>
	);
}
