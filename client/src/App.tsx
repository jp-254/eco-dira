import { Routes, Route, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import PublicHome from "./pages/PublicHome";
import RegisterPage from "./pages/Register";
import Clients from "./pages/Client";
import WasteForm from "./components/Wasteform";
import AdminLogin from "./pages/AdminLogin";
import ClientLogin from "./pages/ClientLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ClientProfile from "./pages/ClientProfile";
import ProtectedRoute from "./components/ProtectedRoute";
import { API_BASE, getToken } from "./services/auth";

interface AuthUser {
	role: string;
	client?: { _id: string };
	operator?: { _id: string };
}

export default function App() {
	const [me, setMe] = useState<AuthUser | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		(async () => {
			const token = getToken();
			if (!token) {
				setMe(null);
				setLoading(false);
				return;
			}
			try {
				const res = await fetch(`${API_BASE}/api/auth/me`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				if (!res.ok) {
					setMe(null);
					setLoading(false);
					return;
				}
				const body = (await res.json()) as AuthUser;
				setMe(body);
			} catch (err) {
				console.error("Failed to fetch user:", err);
				setMe(null);
			} finally {
				setLoading(false);
			}
		})();
	}, []);

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div>Loading…</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<header className="bg-green-700 text-white p-4">
				<div className="container mx-auto flex justify-between items-center">
					<div className="flex items-center">
						<img
							src="/images/recycling-symbol-svgrepo-com.svg"
							alt="ECO DIRA logo"
							className="h-8 w-8 mr-3"
						/>
						<Link to="/" className="font-bold text-lg">
							ECO DIRA
						</Link>
					</div>

					<nav className="flex items-center space-x-4">
						<Link to="/" className="hover:underline">
							Home
						</Link>

						{!me && (
							<>
								<Link to="/register" className="hover:underline">
									Register
								</Link>
								<Link to="/client-login" className="hover:underline">
									Client Login
								</Link>
							</>
						)}

						{me?.role === "client" && me.client && (
							<Link to={`/client/${me.client._id}`} className="hover:underline">
								My Profile
							</Link>
						)}
						{me?.role === "operator" && (
							<Link to="/log" className="hover:underline">
								Log Waste
							</Link>
						)}
						{me?.role === "admin" && (
							<Link to="/admin" className="hover:underline">
								Admin
							</Link>
						)}
					</nav>
				</div>
			</header>

			<main className="container mx-auto p-4">
				<Routes>
					<Route path="/" element={<PublicHome />} />
					<Route path="/register" element={<RegisterPage />} />
					<Route path="/client-login" element={<ClientLogin />} />
					<Route path="/clients" element={<Clients />} />
					<Route path="/log" element={<WasteForm />} />
					<Route path="/admin-login" element={<AdminLogin />} />
					<Route
						path="/admin"
						element={
							<ProtectedRoute>
								<AdminDashboard />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/client/:id"
						element={
							<ProtectedRoute>
								<ClientProfile />
							</ProtectedRoute>
						}
					/>
				</Routes>
			</main>
		</div>
	);
}
