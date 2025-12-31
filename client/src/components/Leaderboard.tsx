import { useEffect, useState } from "react";
import { API_BASE, authHeader } from "../services/auth";

type LeaderboardEntry = {
	name: string;
	pointsBalance: number;
};

export default function Leaderboard() {
	const [data, setData] = useState<LeaderboardEntry[]>([]);

	useEffect(() => {
		fetch(`${API_BASE}/api/leaderboard`, { headers: authHeader() })
			.then((res) => res.json())
			.then(setData);
	}, []);

	return (
		<div className="mt-6">
			<h2 className="text-xl font-bold mb-2">🏆 Top Recyclers</h2>
			<ul>
				{data.map((c, i) => (
					<li key={i} className="flex justify-between border-b py-1">
						<span>
							{i + 1}. {c.name}
						</span>
						<span>{c.pointsBalance} pts</span>
					</li>
				))}
			</ul>
		</div>
	);
}
