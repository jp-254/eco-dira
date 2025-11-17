// client/src/pages/ClientProfile.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { authHeader } from "../services/auth";

export type Client = {
	_id: string;
	client_id?: string;
	name?: string;
	houseNumber?: string;
	pointsBalance?: number;
};

export type PointsHistoryItem = {
	_id: string;
	change: number;
	reason?: string;
	date?: string;
};

export default function ClientProfile() {
	const { id } = useParams<{ id: string }>();

	const [client, setClient] = useState<Client | null>(null);
	const [history, setHistory] = useState<PointsHistoryItem[]>([]);
	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		if (!id) return;

		async function load() {
			setLoading(true);
			try {
				const base = import.meta.env.VITE_API_BASE;

				// Fetch client
				const cRes = await fetch(`${base}/api/clients/${id}`, {
					headers: { "Content-Type": "application/json", ...authHeader() },
				});

				if (cRes.ok) {
					const json = await cRes.json();
					const clientData: Client = json.data ?? json;
					setClient(clientData);
				}

				// Fetch points history
				const hRes = await fetch(`${base}/api/points/${id}`, {
					headers: { "Content-Type": "application/json", ...authHeader() },
				});

				if (hRes.ok) {
					const json = await hRes.json();
					const historyData: PointsHistoryItem[] =
						json.history ?? json.data ?? [];
					setHistory(historyData);
				}
			} catch (err) {
				console.error(err);
			} finally {
				setLoading(false);
			}
		}

		load();
	}, [id]);

	if (!id) return <div>No client selected</div>;
	if (loading && !client) return <div>Loading client...</div>;
	if (!client) return <div>Client not found</div>;

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
					<div className="space-y-2">
						{history.map((h) => (
							<div key={h._id} className="text-sm border p-2 rounded">
								<div>
									{h.change > 0 ? `+${h.change}` : h.change} pts •{" "}
									{h.reason ?? "—"}
								</div>
								<div className="text-xs text-gray-500">
									{h.date ? new Date(h.date).toLocaleString() : "—"}
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
