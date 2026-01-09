import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { operatorLogin } from "../services/auth";

export default function OperatorLogin() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const navigate = useNavigate();
    

	async function handleLogin(e: React.FormEvent) {
		e.preventDefault();
		setError("");

		try {
			await operatorLogin({ email, password });
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

			<input
				type="password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				className="border p-2 w-full"
				placeholder="Password"
			/>

			<button
				type="submit"
				className="bg-blue-600 text-white p-2 w-full rounded">
				Login
			</button>

			{error && <p className="text-red-600">{error}</p>}
		</form>
	);
}
