import { useEffect, useState } from "react";
import { API_BASE, authHeader } from "../services/auth";

interface Reward {
	_id: string;
	name: string;
	minPoints: number;
	maxPoints: number;
}

export default function Rewards() {
	const [rewards, setRewards] = useState<Reward[]>([]);

	useEffect(() => {
		fetch(`${API_BASE}/api/rewards`, { headers: authHeader() })
			.then((res) => res.json())
			.then(setRewards);
	}, []);

	return (
		<div className="mt-6">
			<h2 className="text-xl font-bold mb-2">🎁 Rewards</h2>
			{rewards.map((r) => (
				<div key={r._id} className="border p-2 mb-2">
					<strong>{r.name}</strong>
					<p>
						{r.minPoints} – {r.maxPoints} points
					</p>
				</div>
			))}
		</div>
	);
}
