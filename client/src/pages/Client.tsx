import { useEffect, useState } from "react";
import { fetchClients } from "../services/api";

interface Client {
	client_id?: string;
	_id?: string;
	name?: string;
	houseNumber?: string;
	pointsBalance?: number;
}

export default function Clients() {
	const [clients, setClients] = useState<Client[]>([]);
	useEffect(() => {
		(async () => {
			const data = await fetchClients();
			setClients(data);
		})();
	}, []);

	return (
		<div>
			<h2 className="text-xl font-semibold mb-4">Clients</h2>
			<div className="grid gap-3">
				{clients.map((c: Client) => (
					<div
						key={c.client_id || c._id}
						className="p-3 bg-white rounded shadow">
						<div className="font-semibold">{c.name || "No name"}</div>
						<div className="text-sm">{c.houseNumber}</div>
						<div className="text-xs text-gray-500">
							Points: {c.pointsBalance ?? 0}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
