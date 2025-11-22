import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE, TOKEN_KEY } from "../services/auth";

interface LoginResponse {
	token: string;
	client: {
		_id: string;
	};
}

export default function ClientLogin() {
	const [form, setForm] = useState({ phone: "", password: "" });
	const [err, setErr] = useState("");
	const nav = useNavigate();

	async function submit(e: React.FormEvent) {
		e.preventDefault();
		setErr("");
		try {
			const res = await fetch(`${API_BASE}/api/auth/client-login`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(form),
			});
			const body = (await res.json()) as LoginResponse;
			if (!res.ok)
				throw new Error(
					(body as unknown as { error?: string }).error || "Login failed"
				);
			localStorage.setItem(TOKEN_KEY, body.token);
			// redirect to client profile
			nav(`/client/${body.client._id}`);
		} catch (e) {
			setErr(e instanceof Error ? e.message : "Login failed");
		}
	}

	return (
		<div className="flex justify-center py-10">
			<div className="w-full max-w-md bg-white p-6 rounded shadow">
				<h2 className="text-xl font-semibold mb-3">Client Login</h2>
				<form onSubmit={submit} className="space-y-3">
					<input
						value={form.phone}
						onChange={(e) => setForm({ ...form, phone: e.target.value })}
						required
						className="w-full p-2 border rounded"
						placeholder="Phone (e.g. +2547...)"
					/>
					<input
						type="password"
						value={form.password}
						onChange={(e) => setForm({ ...form, password: e.target.value })}
						required
						className="w-full p-2 border rounded"
						placeholder="Password"
					/>
					<button
						type="submit"
						className="w-full bg-green-700 text-white p-2 rounded">
						Login
					</button>
				</form>
				{err && <div className="text-red-600 mt-2">{err}</div>}
			</div>
		</div>
	);
}
