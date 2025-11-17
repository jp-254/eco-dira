import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

const JWT_SECRET = process.env.JWT_SECRET || "change_this_secret";

export function requireAuth(role) {
	return async (req, res, next) => {
		const raw = req.headers.authorization || "";
		const token = raw.replace("Bearer ", "");
		if (!token) return res.status(401).json({ error: "No token" });
		try {
			const payload = jwt.verify(token, JWT_SECRET);
			req.user = payload;
			if (role && payload.role !== role && payload.role !== "admin") {
				return res.status(403).json({ error: "Forbidden" });
			}
			next();
		} catch (err) {
			return res.status(401).json({ error: "Invalid token" });
		}
	};
}
