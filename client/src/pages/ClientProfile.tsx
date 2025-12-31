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
	const { id } = useParams<{ id: string }>();
	const [client, setClient] = useState<Client | null>(null);
	const [history, setHistory] = useState<PointsHistoryItem[]>([]);
	const [latestWaste, setLatestWaste] = useState<WasteRecord | null>(null);
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

					// Fetch points history
					const historyRes = await fetch(
						`${base}/api/clients/${id}/points-history`,
						{
							headers: { "Content-Type": "application/json", ...authHeader() },
						}
					);

					if (historyRes.ok) {
						const historyJson = await historyRes.json();
						setHistory(historyJson.data ?? []);
					}

					// Fetch latest waste record for location
					const wasteRes = await fetch(
						`${base}/api/waste?clientId=${id}&limit=1&sort=-createdAt`,
						{
							headers: { "Content-Type": "application/json", ...authHeader() },
						}
					);

					if (wasteRes.ok) {
						const wasteJson = await wasteRes.json();
						const wasteData = wasteJson.data ?? wasteJson;
						if (Array.isArray(wasteData) && wasteData.length > 0) {
							setLatestWaste(wasteData[0]);
						}
					}
				}
			} catch (err) {
				console.error("Failed to fetch client:", err);
			} finally {
				setLoading(false);
			}
		}

		load();
	}, [id]);

	// Render loading state or client details
	if (loading) return <div>Loading...</div>;
	if (!client) return <div>No client found.</div>;

	// Prefer latest waste record location if present, otherwise use client location
	const location = (latestWaste?.location?.lat && latestWaste?.location?.lon) 
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

			{/* Render map if location is available */}
			{location?.lat && location?.lon && (
				<div className="mt-4 bg-white p-4 rounded shadow">
					<h4 className="font-semibold mb-2">Collection Location</h4>
					<div className="mt-2">
						{/* Embedded Google Maps iframe */}
						<iframe
							title="client-location"
							width="100%"
							height="260"
							src={`https://www.google.com/maps?q=${location.lat},${location.lon}&z=15&output=embed`}
							className="border rounded"
						></iframe>

						{/* Link to open in Google Maps */}
						<a>
							className="inline-block mt-2 text-sm text-blue-600 hover:underline"
							target="_blank"
							rel="noopener noreferrer"
							href={`https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lon}`}
						
							Open in Google Maps ;.
						</a>
					</div>
				</div>
			)}
		</div>
	);
}