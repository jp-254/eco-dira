// src/services/auth.ts
import type {
	AdminLoginResponse,
	OperatorLoginResponse,
	AdminDTO,
	OperatorDTO,
} from "../types/auth";

const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:5000";
const TOKEN_KEY = "eco_token";

/* ----------------- runtime type guards ----------------- */

function isObject(v: unknown): v is Record<string, unknown> {
	return typeof v === "object" && v !== null;
}

function hasStringProp(obj: Record<string, unknown>, key: string): boolean {
	return typeof obj[key] === "string";
}

function isAdminDTO(obj: unknown): obj is AdminDTO {
	if (!isObject(obj)) return false;
	return hasStringProp(obj, "username") && obj.role === "admin";
}

function isAdminLoginResponse(obj: unknown): obj is AdminLoginResponse {
	if (!isObject(obj)) return false;
	if (!hasStringProp(obj, "token")) return false;
	if (!isObject(obj.admin)) return false;
	return isAdminDTO(obj.admin);
}

function isOperatorDTO(obj: unknown): obj is OperatorDTO {
	if (!isObject(obj)) return false;
	return hasStringProp(obj, "email") && obj.role === "operator";
}

function isOperatorLoginResponse(obj: unknown): obj is OperatorLoginResponse {
	if (!isObject(obj)) return false;
	if (!hasStringProp(obj, "token")) return false;
	if (!isObject(obj.operator)) return false;
	return isOperatorDTO(obj.operator);
}

/* ----------------- helpers ----------------- */

async function safeParseJson(res: Response): Promise<unknown> {
	const text = await res.text().catch(() => "");
	if (!text) return undefined;
	try {
		return JSON.parse(text);
	} catch {
		return undefined;
	}
}

/* ----------------- auth requests ----------------- */

export async function adminLogin(payload: {
	username: string;
	password: string;
}): Promise<AdminLoginResponse> {
	const res = await fetch(`${API_BASE}/api/auth/admin-login`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(payload),
	});

	if (!res.ok) {
		const parsed = await safeParseJson(res);
		if (isObject(parsed)) {
			const err = (parsed.error ?? parsed.message) as string | undefined;
			throw new Error(err ?? `Admin login failed (${res.status})`);
		}
		throw new Error(`Admin login failed (${res.status})`);
	}

	const parsed = await safeParseJson(res);

	if (!isAdminLoginResponse(parsed)) {
		throw new Error("Unexpected admin login response shape");
	}

	// persist token
	saveToken(parsed.token);

	return parsed;
}

export async function operatorLogin(payload: {
	email: string;
	password: string;
}): Promise<OperatorLoginResponse> {
	const res = await fetch(`${API_BASE}/api/auth/operator-login`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(payload),
	});

	if (!res.ok) {
		const parsed = await safeParseJson(res);
		if (isObject(parsed)) {
			const err = (parsed.error ?? parsed.message) as string | undefined;
			throw new Error(err ?? `Operator login failed (${res.status})`);
		}
		throw new Error(`Operator login failed (${res.status})`);
	}

	const parsed = await safeParseJson(res);

	if (!isOperatorLoginResponse(parsed)) {
		throw new Error("Unexpected operator login response shape");
	}

	// persist token
	saveToken(parsed.token);

	return parsed;
}

/* ----------------- token helpers ----------------- */

export function saveToken(token: string): void {
	try {
		localStorage.setItem(TOKEN_KEY, token);
	} catch {
		// ignore storage failures
	}
}

export function getToken(): string | null {
	try {
		return localStorage.getItem(TOKEN_KEY);
	} catch {
		return null;
	}
}

export function clearToken(): void {
	try {
		localStorage.removeItem(TOKEN_KEY);
	} catch {
		// ignore
	}
}

/**
 * Returns a HeadersInit object suitable to spread into fetch headers:
 *   headers: { "Content-Type": "application/json", ...authHeader() }
 */
export function authHeader(): HeadersInit {
	const token = getToken();
	return token ? { Authorization: `Bearer ${token}` } : {};
}
