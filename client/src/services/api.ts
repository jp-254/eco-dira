const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export interface Client {
	_id?: string;
	client_id?: string;
	name?: string;
	houseNumber?: string;
}

export async function fetchClients(): Promise<Client[]> {
	const res = await fetch(`${API_BASE}/api/clients`);

	if (!res.ok) {
		throw new Error(`Failed to fetch clients (${res.status})`);
	}

	const json = await res.json();
	// normalize: if server returns { data: [...] } use it, else assume array
	if (Array.isArray(json)) return json;
	if (Array.isArray(json.data)) return json.data;
	return [];
}



interface WastePayload {
	clientId: string;
	type: string;
	weightKg: number;
	location?: {
		lat: number;
		lon: number;
	};
	operatorId?: string;
}

export async function postWaste(payload: WastePayload) {



	const res = await fetch(`${API_BASE}/api/waste`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(payload),
	});
	return res.json();
}
