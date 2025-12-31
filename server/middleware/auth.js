import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

const JWT_SECRET = process.env.JWT_SECRET || "change_this_secret";

export function requireAuth(requiredRole) {
	return (req, res, next) => {
		const raw = req.headers.authorization || "";
		const token = raw.startsWith("Bearer ") ? raw.slice(7) : raw;

		if (!token) return res.status(401).json({ error: "No token" });

		try {
			const payload = jwt.verify(token, JWT_SECRET);
			req.user = payload; // { sub, role }

			if (requiredRole && payload.role !== requiredRole) {
				return res.status(403).json({ error: "Forbidden" });
			}

			next();
		} catch {
			return res.status(401).json({ error: "Invalid token" });
		}
	};
}

