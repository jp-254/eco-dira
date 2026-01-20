import { useEffect, useState } from "react";
import { authHeader } from "../services/auth";

type Config = {
	_id: string;
	type: string;
	pointsPerKg: number;
};

export default function PointConfigEditor() {
	const [configs, setConfigs] = useState<Config[]>([]);
	const [saving, setSaving] = useState(false);

	const load = async () => {
		const res = await fetch(
			`${import.meta.env.VITE_API_BASE}/api/point-config`,
			{ headers: authHeader() }
		);
		setConfigs(await res.json());
	};

	useEffect(() => {
		load();
	}, []);

	const update = async (id: string, value: number) => {
		setSaving(true);
		await fetch(`${import.meta.env.VITE_API_BASE}/api/point-config/${id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				...authHeader(),
			},
			body: JSON.stringify({ pointsPerKg: value }),
		});
		setSaving(false);
		load();
	};

	return (
		<div>
			<h2 className="font-semibold mb-3">♻️ Points Configuration</h2>
			<div className="grid gap-2">
				{configs.map((c) => (
					<div key={c._id} className="flex gap-3 items-center">
						<div className="w-32 capitalize">{c.type}</div>
						<input
							type="number"
							placeholder="Points per kg"
							defaultValue={c.pointsPerKg}
							className="border px-2 py-1 w-24"
							onBlur={(e) => update(c._id, Number(e.target.value))}
						/>
						<span className="text-sm text-gray-500">pts / kg</span>
					</div>
				))}
			</div>
			{saving && <p className="text-sm text-gray-500 mt-2">Saving…</p>}
		</div>
	);
}
