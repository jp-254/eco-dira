// client/src/pages/AdminLogin.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../services/auth";
import { useAuth } from "../hooks/useAuth";

export default function AdminLogin() {
	const navigate = useNavigate();
	const { login } = useAuth();

	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError(null);

		try {
			const res = await adminLogin({ username, password });

			await login(res.token);

			navigate("/admin", { replace: true });
		} catch (err) {
			setError((err as Error).message);
		}
	}

	return (
		<form onSubmit={handleSubmit} className="p-4 max-w-md mx-auto">
			<h1 className="text-2xl mb-4 font-bold">Admin Login</h1>

			<input
				value={username}
				onChange={(e) => setUsername(e.target.value)}
				className="border p-2 w-full mb-3"
				placeholder="Username"
			/>

			<div className="relative mb-3">
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

			<button className="bg-green-600 text-white p-2 rounded w-full">
				Login
			</button>

			{error && <p className="text-red-600 mt-3">{error}</p>}
		</form>
	);
}
