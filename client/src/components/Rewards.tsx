import { useEffect, useState } from "react";
import { API_BASE, authHeader } from "../services/auth";

interface Reward {
	_id: string;
	name: string;
	minPoints: number;
	maxPoints: number;
}

interface RewardsProps {
	onRedeem?: (reward: Reward) => void;
}

export default function Rewards({ onRedeem }: RewardsProps) {
	const [rewards, setRewards] = useState<Reward[]>([]);

	useEffect(() => {
		fetch(`${API_BASE}/api/rewards`, { headers: authHeader() })
			.then((res) => res.json())
			.then(setRewards)
			.catch((err) => console.error("Failed to fetch rewards", err));
	}, []);

	return (
		<div className="mt-6">
			<h2 className="text-xl font-bold mb-2">🎁 Rewards</h2>

			{rewards.map((r) => (
				<div key={r._id} className="border p-2 mb-2 rounded">
					<strong>{r.name}</strong>
					<p className="text-sm">
						{r.minPoints} – {r.maxPoints} points
					</p>

					{/* ✅ Only show button if handler is provided */}
					{onRedeem && (
						<button
							onClick={() => onRedeem(r)}
							className="mt-2 px-3 py-1 bg-green-600 text-white rounded text-sm">
							Redeem
						</button>
					)}
				</div>
			))}
		</div>
	);
}
