// client/src/pages/ClientLogin.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../services/auth";
import { useAuth } from "../hooks/useAuth";

export default function ClientLogin() {
	const [phone, setPhone] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState("");

	const navigate = useNavigate();
	const { login } = useAuth();

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

			await login(body.token);

			navigate(`/client/${body.client._id}`, { replace: true });
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

			<div className="relative">
				<input
					type={showPassword ? "text" : "password"}
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					className="border p-2 w-full"
					placeholder="Password"
				/>

				<button
					type="button"
					onClick={() => setShowPassword(!showPassword)}
					className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-600">
					{showPassword ? "Hide" : "Show"}
				</button>
			</div>

			<button
				type="submit"
				className="bg-green-700 text-white p-2 w-full rounded">
				Login
			</button>

			{error && <p className="text-red-600">{error}</p>}
		</form>
	);
}
