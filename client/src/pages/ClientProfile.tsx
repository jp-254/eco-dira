// client/src/pages/ClientProfile.tsx
import { useEffect, useState } from "react";
import { authHeader } from "../services/auth";
import { useAuth } from "../hooks/useAuth";
import Leaderboard from "../components/Leaderboard";
import Rewards from "../components/Rewards";

export type Client = {
	_id: string;
	client_id?: string;
	name?: string;
	houseNumber?: string;
	pointsBalance?: number;
	location?: {
		lat?: number;
		lon?: number;
	};
};

export type PointsHistoryItem = {
	_id: string;
	change: number;
	reason?: string;
	date?: string;
};

export type WasteRecord = {
	_id: string;
	location?: {
		lat?: number;
		lon?: number;
	};
	createdAt?: string;
};

export default function ClientProfile() {
	const { me } = useAuth(); // 🔥 SOURCE OF TRUTH
	const [client, setClient] = useState<Client | null>(null);
	const [history, setHistory] = useState<PointsHistoryItem[]>([]);
	const [latestWaste, setLatestWaste] = useState<WasteRecord | null>(null);
	const [loading, setLoading] = useState(false);
	const [redeemMsg, setRedeemMsg] = useState("");
	const [redeeming, setRedeeming] = useState(false);

	useEffect(() => {
		// 🔐 HARD GUARD (prevents undefined calls)
		if (!me || me.role !== "client" || !me.client?._id) return;

		// ✅ ALWAYS USE Mongo _id
		const clientId = me.client._id;

		async function load() {
			setLoading(true);
			try {
				const base = import.meta.env.VITE_API_BASE;

				// Fetch client
				const cRes = await fetch(`${base}/api/clients/${clientId}`, {
					headers: { ...authHeader() },
				});
				if (!cRes.ok) throw new Error("Client not found");

				const cJson = await cRes.json();
				setClient(cJson.data ?? cJson);

				// Fetch points history
				const hRes = await fetch(
					`${base}/api/clients/${clientId}/points-history`,
					{ headers: authHeader() }
				);
				if (hRes.ok) {
					const hJson = await hRes.json();
					setHistory(hJson.data ?? []);
				}

				// Fetch latest waste record
				const wRes = await fetch(
					`${base}/api/waste?clientId=${clientId}&limit=1&sort=-createdAt`,
					{ headers: authHeader() }
				);
				if (wRes.ok) {
					const wJson = await wRes.json();
					if (Array.isArray(wJson.data) && wJson.data.length > 0) {
						setLatestWaste(wJson.data[0]);
					}
				}
			} catch (err) {
				console.error("Failed to load client profile", err);
				setClient(null);
			} finally {
				setLoading(false);
			}
		}

		load();
	}, [me]);

	const handleRedeem = async (reward: {
		_id: string;
		name: string;
		minPoints: number;
		maxPoints: number;
	}) => {
		if (!client) return;

		if ((client.pointsBalance ?? 0) < reward.minPoints) {
			setRedeemMsg("Not enough points for this reward");
			return;
		}

		if (!confirm(`Redeem "${reward.name}"?`)) return;

		try {
			setRedeeming(true);
			setRedeemMsg("");

			const res = await fetch(
				`${import.meta.env.VITE_API_BASE}/api/points/redeem`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						...authHeader(),
					},
					body: JSON.stringify({
						clientId: client._id, // ✅ Mongo _id
						pointsUsed: reward.minPoints,
						rewardDesc: reward.name,
					}),
				}
			);

			const json = await res.json();
			if (!res.ok) throw new Error(json.error || "Redeem failed");

			setRedeemMsg("✅ Redemption request sent for approval");
		} catch (err) {
			setRedeemMsg(err instanceof Error ? err.message : "Failed to redeem");
		} finally {
			setRedeeming(false);
		}
	};

	if (loading) return <div>Loading...</div>;
	if (!client) return <div>No client found.</div>;

	const location =
		latestWaste?.location?.lat && latestWaste?.location?.lon
			? latestWaste.location
			: client.location;

	return (
		<div className="space-y-4">
			<div className="bg-white p-4 rounded shadow">
				<h2 className="text-xl font-semibold">{client.name ?? "—"}</h2>
				<div className="text-sm text-gray-600">
					House: {client.houseNumber ?? client.client_id ?? "—"}
				</div>
				<div className="mt-2">
					Points: <strong>{client.pointsBalance ?? 0}</strong>
				</div>
			</div>

			<div className="bg-white p-4 rounded shadow">
				<h3 className="font-semibold mb-3">Points History</h3>

				{history.length === 0 ? (
					<div className="text-sm text-gray-500">No history available</div>
				) : (
					history.map((h) => (
						<div key={h._id} className="text-sm border p-2 rounded">
							<div>
								{h.change > 0 ? `+${h.change}` : h.change} pts •{" "}
								{h.reason ?? "—"}
							</div>
							<div className="text-xs text-gray-500">
								{h.date ? new Date(h.date).toLocaleString() : "—"}
							</div>
						</div>
					))
				)}
			</div>

			<Leaderboard />
			<Rewards onRedeem={handleRedeem} />

			{redeemMsg && <p className="text-sm text-gray-700">{redeemMsg}</p>}
			{redeeming && (
				<p className="text-sm text-gray-500">Submitting redemption…</p>
			)}

			{location?.lat && location?.lon && (
				<div className="bg-white p-4 rounded shadow">
					<h4 className="font-semibold mb-2">Collection Location</h4>
					<iframe
						title="client-location"
						width="100%"
						height="260"
						src={`https://www.google.com/maps?q=${location.lat},${location.lon}&z=15&output=embed`}
						className="border rounded"
					/>
				</div>
			)}
		</div>
	);
}
