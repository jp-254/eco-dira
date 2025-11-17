import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Clients from "./pages/Client";
import WasteForm from "./components/Wasteform";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ClientProfile from "./pages/ClientProfile";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
	return (
		<div className="min-h-screen bg-gray-50">
			<header className="bg-green-700 text-white p-4">
				<div className="container mx-auto flex justify-between">
					<h1 className="font-bold">ECO DIRA</h1>
					<nav className="space-x-4">
						<Link to="/" className="hover:underline">
							Home
						</Link>
						<Link to="/clients" className="hover:underline">
							Clients
						</Link>
						<Link to="/log" className="hover:underline">
							Log Waste
						</Link>
					</nav>
				</div>
			</header>

			<main className="container mx-auto p-4">
				<Routes>
					<Route path="/" element={<Home />} />
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
