// client/src/pages/Register.tsx
// client/src/pages/Register.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

interface ClientResponse {
	token: string;
	client: {
		_id: string;
	};
	error?: string;
}

export default function Register() {
	const { login } = useAuth(); // ✅ single source of truth
	const nav = useNavigate();

	const [form, setForm] = useState({
		name: "",
		phone: "",
		houseNumber: "",
		email: "",
		password: "",
	});
	const [msg, setMsg] = useState("");
	const [showPassword, setShowPassword] = useState(false);

	async function submit(e: React.FormEvent) {
		e.preventDefault();
		setMsg("Registering...");

		try {
			const res = await fetch(`${API_BASE}/api/auth/register`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(form),
			});

			const body: ClientResponse = await res.json();

			if (!res.ok) {
				throw new Error(body.error || "Registration failed");
			}

			// 🔥 update auth state immediately
			await login(body.token);

			setMsg("Registered — redirecting...");
			nav(`/client/${body.client._id}`);
		} catch (err) {
			setMsg(err instanceof Error ? err.message : "Registration failed");
		}
	}

	return (
		<div className="flex justify-center py-10">
			<div className="w-full max-w-lg bg-white shadow p-6 rounded">
				<h1 className="text-2xl font-bold mb-4">Register — ECO DIRA ♻️</h1>

				<form onSubmit={submit} className="space-y-3">
					<input
						value={form.name}
						onChange={(e) => setForm({ ...form, name: e.target.value })}
						required
						className="w-full p-2 border rounded"
						placeholder="Full name"
					/>

					<input
						value={form.phone}
						onChange={(e) => setForm({ ...form, phone: e.target.value })}
						required
						className="w-full p-2 border rounded"
						placeholder="Phone (e.g. +2547...)"
					/>

					<input
						value={form.houseNumber}
						onChange={(e) => setForm({ ...form, houseNumber: e.target.value })}
						required
						className="w-full p-2 border rounded"
						placeholder="House / Plot number"
					/>

					<input
						value={form.email}
						onChange={(e) => setForm({ ...form, email: e.target.value })}
						className="w-full p-2 border rounded"
						placeholder="Email (optional)"
					/>

					<div className="relative">
						<input
							type={showPassword ? "text" : "password"}
							value={form.password}
							onChange={(e) => setForm({ ...form, password: e.target.value })}
							required
							minLength={6}
							className="w-full p-2 border rounded"
							placeholder="Create password (min 6 chars)"
						/>
						<button
							type="button"
							onClick={() => setShowPassword(!showPassword)}
							className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800">
							{showPassword ? "🙈 Hide" : "👁️ Show"}
						</button>
					</div>

					<button
						type="submit"
						className="bg-green-700 text-white w-full p-2 rounded">
						Register
					</button>
				</form>

				{msg && <p className="mt-3 text-sm">{msg}</p>}
			</div>
		</div>
	);
}
