// client/src/App.tsx
import { Routes, Route, Link } from "react-router-dom";
import PublicHome from "./pages/PublicHome";
import RegisterPage from "./pages/Register";
import Clients from "./pages/Client";
import WasteForm from "./components/Wasteform";
import AdminLogin from "./pages/AdminLogin";
import ClientLogin from "./pages/ClientLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ClientProfile from "./pages/ClientProfile";
import OperatorLogin from "./pages/OperatorLogin";
import AdminClientView from "./pages/AdminClientView";
import RequireAuth from "./components/RequireAuth";
import { useAuth } from "./hooks/useAuth";

export default function App() {
	// 🔥 AUTH NOW COMES FROM CONTEXT (NO FETCHING HERE)
	const { me, loading } = useAuth();

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
							src="/images/ecologo.jpeg"
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

						{/* NOT LOGGED IN */}
						{!me && (
							<>
								<Link to="/register" className="hover:underline">
									Register
								</Link>
								<Link to="/client-login" className="hover:underline">
									Client Login
								</Link>
								<Link to="/operator-login" className="hover:underline">
									Operator
								</Link>
							</>
						)}

						{/* CLIENT */}
						{me?.role === "client" && me.client && (
							<Link to={`/client/${me.client._id}`} className="hover:underline">
								My Profile
							</Link>
						)}

						{/* OPERATOR */}
						{me?.role === "operator" && (
							<Link to="/log" className="hover:underline">
								Log Waste
							</Link>
						)}

						{/* ADMIN */}
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

					<Route path="/admin-login" element={<AdminLogin />} />
					<Route path="/operator-login" element={<OperatorLogin />} />
					<Route path="/admin/client/:id" element={<AdminClientView />} />

					<Route
						path="/admin"
						element={
							<RequireAuth role="admin">
								<AdminDashboard />
							</RequireAuth>
						}
					/>

					<Route
						path="/log"
						element={
							<RequireAuth role="operator">
								<WasteForm />
							</RequireAuth>
						}
					/>

					<Route
						path="/client/:id"
						element={
							<RequireAuth role="client">
								<ClientProfile />
							</RequireAuth>
						}
					/>
				</Routes>
			</main>
		</div>
	);
}
