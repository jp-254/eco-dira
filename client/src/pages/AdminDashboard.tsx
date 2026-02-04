// client/src/pages/AdminDashboard.tsx
import { useEffect, useState } from "react";
import { authHeader, clearToken } from "../services/auth";
import { Link } from "react-router-dom";
import Leaderboard from "../components/Leaderboard";
import Rewards from "../components/Rewards";
import PointConfigEditor from "../components/PointConfigEditor";
import WasteSummary from "../components/WasteSummary";

type Client = {
	_id: string;
	client_id?: string;
	name?: string;
	houseNumber?: string;
	pointsBalance?: number;
};

type Redemption = {
	_id: string;
	clientId: string;
	pointsUsed: number;
	rewardDesc: string;
	status: string;
};

export default function AdminDashboard() {
	const [clients, setClients] = useState<Client[]>([]);
	const [redemptions, setRedemptions] = useState<Redemption[]>([]);
	const [loading, setLoading] = useState(false);

	// 🔍 Helper: map clientId → name + houseNumber
	function getClientLabel(clientId: string) {
		const client = clients.find((c) => c._id === clientId);
		if (!client) return "Unknown client";
		return `${client.name ?? "—"} — ${client.houseNumber ?? "—"}`;
	}

	async function loadData() {
		setLoading(true);
		try {
			// clients
			const cRes = await fetch(`${import.meta.env.VITE_API_BASE}/api/clients`, {
				headers: { "Content-Type": "application/json", ...authHeader() },
			});
			const cJson = await cRes.json();
			setClients(cJson.data || cJson);

			// pending redemptions
			const rRes = await fetch(
				`${import.meta.env.VITE_API_BASE}/api/points/pending/all`,
				{
					headers: { "Content-Type": "application/json", ...authHeader() },
				},
			);
			const rJson = await rRes.json();
			setRedemptions(rJson || []);
		} catch (err) {
			console.error(err);
			alert("Failed to load data");
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		loadData();
	}, []);

	async function approve(redId: string) {
		if (!confirm("Approve this redemption?")) return;
		try {
			const res = await fetch(
				`${import.meta.env.VITE_API_BASE}/api/points/redeem/${redId}/approve`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json", ...authHeader() },
				},
			);
			if (!res.ok) {
				const b = await res.json().catch(() => ({}));
				throw new Error(b.error || "Approve failed");
			}
			alert("Approved");
			loadData();
		} catch (err) {
			alert((err as Error).message);
		}
	}

	const logout = () => {
		clearToken();
		window.location.href = "/admin-login";
	};

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<h1 className="text-2xl font-bold">Admin Dashboard</h1>
				<div>
					<button
						onClick={logout}
						className="px-3 py-1 bg-red-500 text-white rounded">
						Logout
					</button>
				</div>
			</div>

			<section className="bg-white p-4 rounded shadow">
				<h2 className="font-semibold mb-3">Clients</h2>
				{loading ? (
					<div>Loading...</div>
				) : (
					<div className="grid gap-2">
						{clients.map((c) => (
							<div
								key={c._id}
								className="flex justify-between p-2 border rounded">
								<div>
									<div className="font-medium">{c.name ?? "—"}</div>
									<div className="text-sm text-gray-500">
										{c.houseNumber ?? c.client_id}
									</div>
								</div>
								<div className="flex items-center gap-3">
									<div className="text-sm">
										Points: <strong>{c.pointsBalance ?? 0}</strong>
									</div>
									<Link to={`/admin/client/${c._id}`} className="text-blue-600">
										View
									</Link>
								</div>
							</div>
						))}
					</div>
				)}
			</section>

			<section className="bg-white p-4 rounded shadow">
				<PointConfigEditor />
			</section>

			<section className="bg-white p-4 rounded shadow">
				<h2 className="font-semibold mb-3">Pending Redemptions</h2>
				{redemptions.length === 0 ? (
					<div>No pending redemptions</div>
				) : (
					<div className="grid gap-2">
						{redemptions.map((r) => (
							<div
								key={r._id}
								className="p-2 border rounded flex justify-between items-center">
								<div>
									<div className="font-medium">{r.rewardDesc}</div>
									<div className="text-sm text-gray-500">
										Client: {getClientLabel(r.clientId)} • Points:{" "}
										{r.pointsUsed}
									</div>
								</div>
								<div>
									<button
										onClick={() => approve(r._id)}
										className="px-3 py-1 bg-green-600 text-white rounded">
										Approve
									</button>
								</div>
							</div>
						))}
					</div>
				)}
			</section>

			<section className="bg-white p-4 rounded shadow">
				<Leaderboard />
			</section>

			<section className="bg-white p-4 rounded shadow">
				<Rewards />
			</section>

			<section className="bg-white p-4 rounded shadow">
				<WasteSummary />
			</section>
		</div>
	);
}
