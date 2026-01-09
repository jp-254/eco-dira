// client/src/components/WasteForm.tsx
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { fetchClients } from "../services/api";
import { authHeader } from "../services/auth";

interface Client {
	_id?: string;
	client_id?: string;
	name?: string;
	houseNumber?: string;
}

interface WastePayload {
	clientId: string;
	type: string;
	weightKg: number;
	location?: { lat: number; lon: number };
	operatorId?: string;
}

export default function WasteForm() {
	const [clients, setClients] = useState<Client[]>([]);
	const [authError, setAuthError] = useState("");
	const [form, setForm] = useState({
		clientId: "",
		type: "plastic",
		weightKg: 0,
		lat: "",
		lon: "",
		operatorId: "",
	});
	const [message, setMessage] = useState<string>("");

	useEffect(() => {
		// Check authentication and operator role
		const token = localStorage.getItem("token");
		if (!token) {
			setAuthError("...");
			return;
		}

		fetch("http://localhost:5000/api/auth/me", {
			headers: { Authorization: `Bearer ${token}` },
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.role !== "operator") {
					setAuthError("Only operators can log waste");
				}
			})
			.catch(() => setAuthError("Auth check failed"));
	}, []);

	// Fetch clients list
	useEffect(() => {
		(async () => {
			try {
				const fetchedClients = await fetchClients();
				setClients(fetchedClients);
			} catch (err) {
				console.error("fetchClients failed:", err);
			}
		})();
	}, []);

	async function submit(e: FormEvent) {
		e.preventDefault();
		setMessage("Submitting...");

		const payload: WastePayload = {
			clientId: form.clientId,
			type: form.type,
			weightKg: Number(form.weightKg),
			location:
				form.lat && form.lon
					? { lat: Number(form.lat), lon: Number(form.lon) }
					: undefined,
			operatorId: form.operatorId || undefined,
		};

		try {
			const base = import.meta.env.VITE_API_BASE;
			const res = await fetch(`${base}/api/waste`, {
				method: "POST",
				headers: { "Content-Type": "application/json", ...authHeader() },
				body: JSON.stringify(payload),
			});

			// parse response (defensive)
			const json = await (async () => {
				try {
					return await res.json();
				} catch {
					return {};
				}
			})();

			if (!res.ok) {
				const errMsg =
					(json && (json.error || json.message)) || `Failed (${res.status})`;
				throw new Error(errMsg);
			}

			setMessage(`Saved! Points awarded: ${json.pointsAwarded ?? 0}`);
			setForm({ ...form, weightKg: 0 });
		} catch (err) {
			const msg = err instanceof Error ? err.message : "Unknown error";
			setMessage(msg);
			 
			console.error("submit waste error:", err);
		}
	}

	return (
		<div className="max-w-lg mx-auto p-4 bg-white rounded shadow">
			<h3 className="text-lg font-semibold mb-2">Log Waste Collection</h3>

			{authError && <p className="text-red-600">{authError}</p>}

			<form onSubmit={submit} className="space-y-3">
				<select
					className="w-full p-2 border rounded"
					value={form.clientId}
					onChange={(e) => setForm({ ...form, clientId: e.target.value })}
					aria-label="Select client"
					required>
					<option value="">Select client</option>
					{clients.map((c) => (
						<option key={c._id ?? c.client_id} value={c._id ?? c.client_id}>
							{c.name ?? "—"} — {c.houseNumber ?? ""}
						</option>
					))}
				</select>

				<select
					className="w-full p-2 border rounded"
					value={form.type}
					aria-label="Waste type"
					onChange={(e) => setForm({ ...form, type: e.target.value })}>
					<option value="plastic">plastic</option>
					<option value="white paper">white paper</option>
					<option value="brown paper">brown paper</option>
					<option value="metal">metal</option>
					<option value="glass">glass</option>
				</select>

				<label className="block">
					<span className="text-gray-700">Weight (kg)</span>
					<input
						className="w-full p-2 border rounded mt-1"
						type="number"
						step="0.1"
						value={form.weightKg}
						onChange={(e) =>
							setForm({ ...form, weightKg: Number(e.target.value) })
						}
						aria-label="Weight in kilograms"
						required
					/>
				</label>

				<div className="flex space-x-2">
					<input
						placeholder="lat"
						className="w-1/2 p-2 border rounded"
						value={form.lat}
						onChange={(e) => setForm({ ...form, lat: e.target.value })}
					/>
					<input
						placeholder="lon"
						className="w-1/2 p-2 border rounded"
						value={form.lon}
						onChange={(e) => setForm({ ...form, lon: e.target.value })}
					/>
				</div>

				<input
					placeholder="operator id (optional)"
					className="w-full p-2 border rounded"
					value={form.operatorId}
					onChange={(e) => setForm({ ...form, operatorId: e.target.value })}
				/>

				<button
					className="w-full bg-green-600 text-white p-2 rounded"
					type="submit">
					Submit
				</button>
			</form>
			{message && <p className="mt-3">{message}</p>}
		</div>
	);
}
