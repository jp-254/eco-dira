// client/src/components/ProtectedRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { getToken } from "../services/auth";

type Props = { children: React.ReactNode };

export default function ProtectedRoute({ children }: Props) {
	const token = getToken();
	if (!token) return <Navigate to="/admin-login" replace />;
	return children;
}
