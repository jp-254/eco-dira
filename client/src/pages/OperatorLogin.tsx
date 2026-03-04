// client/src/pages/OperatorLogin.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { operatorLogin } from "../services/auth";
import { useAuth } from "../hooks/useAuth";

export default function OperatorLogin() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState("");

	const navigate = useNavigate();
	const { login } = useAuth();

	async function handleLogin(e: React.FormEvent) {
		e.preventDefault();
		setError("");

		try {
			const res = await operatorLogin({ email, password });

			await login(res.token);

			navigate("/log", { replace: true });
		} catch (err) {
			setError(err instanceof Error ? err.message : "Login failed");
		}
	}

	return (
		<form onSubmit={handleLogin} className="space-y-4 max-w-md mx-auto">
			<h2 className="text-lg font-bold">Operator Login</h2>

			<input
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				className="border p-2 w-full"
				placeholder="Email"
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

			<button className="bg-blue-600 text-white p-2 w-full rounded">
				Login
			</button>

			{error && <p className="text-red-600">{error}</p>}
		</form>
	);
}
