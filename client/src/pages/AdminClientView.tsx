import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { authHeader } from "../services/auth";

export default function AdminClientView() {
	const { id } = useParams();
	const [client, setClient] = useState<{ name: string; pointsBalance: number } | null>(null);
	const [history, setHistory] = useState<{ _id: string; change: number; reason: string }[]>([]);

	useEffect(() => {
		if (!id) return;

		(async () => {
			const base = import.meta.env.VITE_API_BASE;

			const cRes = await fetch(`${base}/api/clients/${id}`, {
				headers: authHeader(),
			});
			setClient(await cRes.json());

			const hRes = await fetch(`${base}/api/clients/${id}/points-history`, {
				headers: authHeader(),
			});
			setHistory((await hRes.json()).data || []);
		})();
	}, [id]);

	if (!client) return <div>Loading...</div>;

	return (
		<div className="space-y-4">
			<h2 className="text-xl font-bold">{client.name}</h2>
			<p>Points: {client.pointsBalance}</p>

			<h3 className="font-semibold">Points History</h3>
			{history.map((h) => (
				<div key={h._id} className="text-sm border p-2">
					{h.change} pts • {h.reason}
				</div>
			))}
		</div>
	);
}
