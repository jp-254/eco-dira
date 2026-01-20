// client/src/auth/AuthContext.ts
import { createContext } from "react";

export type Me = {
	role: "admin" | "operator" | "client";
	admin?: { id: string; username: string };
	operator?: { id: string; email: string };
	client?: { _id: string; name?: string };
} | null;

export type AuthContextType = {
	me: Me;
	loading: boolean;
	login: (token: string) => Promise<void>;
	logout: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);
