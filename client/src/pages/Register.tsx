// client/src/pages/Register.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";
const TOKEN_KEY = "eco_token";

interface ClientResponse {
	token: string;
	client: {
		_id: string;
	};
}

export default function Register() {
	const [form, setForm] = useState({
		name: "",
		phone: "",
		houseNumber: "",
		email: "",
		password: "",
	});
	const [msg, setMsg] = useState("");
	const nav = useNavigate();

	async function submit(e: React.FormEvent) {
		e.preventDefault();
		setMsg("Registering...");
		try {
			const res = await fetch(`${API_BASE}/api/auth/register`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(form),
			});
			const body = (await res.json()) as ClientResponse;
			if (!res.ok)
				throw new Error(
					(body as unknown as { error?: string }).error || "Registration failed"
				);
			// save token & redirect
			localStorage.setItem(TOKEN_KEY, body.token);
			setMsg("Registered — redirecting...");
			setTimeout(() => nav(`/client/${body.client._id}`), 700);
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
					<input
						type="password"
						value={form.password}
						onChange={(e) => setForm({ ...form, password: e.target.value })}
						required
						minLength={6}
						className="w-full p-2 border rounded"
						placeholder="Create password (min 6 chars)"
					/>
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
