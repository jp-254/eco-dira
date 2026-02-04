import { useEffect, useState } from "react";
import { authHeader } from "../services/auth";

type WasteSummaryItem = {
	type: string;
	totalWeight: number;
	count: number;
};

export default function WasteSummary() {
	const [data, setData] = useState<WasteSummaryItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		(async () => {
			try {
				const res = await fetch(
					`${import.meta.env.VITE_API_BASE}/api/waste/summary/by-type`,
					{
						headers: { "Content-Type": "application/json", ...authHeader() },
					},
				);

				if (!res.ok) throw new Error("Failed to load waste summary");

				const json = await res.json();
				setData(json);
			} catch (err) {
				setError("Could not load waste summary");
				console.error(err);
			} finally {
				setLoading(false);
			}
		})();
	}, []);

	if (loading) return <div>Loading waste summary...</div>;
	if (error) return <div className="text-red-600">{error}</div>;

	return (
		<div>
			<h2 className="font-semibold mb-3">Total Waste Collected (kg)</h2>

			{data.length === 0 ? (
				<div>No waste records yet</div>
			) : (
				<div className="grid gap-2">
					{data.map((w) => (
						<div
							key={w.type}
							className="flex justify-between border p-2 rounded">
							<div className="capitalize">{w.type}</div>
							<div className="text-sm text-gray-700">
								<strong>{w.totalWeight.toFixed(2)} kg</strong>
								<span className="text-gray-500 ml-2">({w.count} entries)</span>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
