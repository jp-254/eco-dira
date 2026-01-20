import { Navigate } from "react-router-dom";
import type { ReactElement } from "react";
import { useAuth } from "../hooks/useAuth";

export default function RequireAuth({
	role,
	children,
}: {
	role: "admin" | "operator" | "client";
	children: ReactElement;
}) {
	const { me, loading } = useAuth();

	if (loading) return <div>Loading...</div>;
	if (!me) return <Navigate to="/" replace />;
	if (me.role !== role) return <Navigate to="/" replace />;

	return children;
}
