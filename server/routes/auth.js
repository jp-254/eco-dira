import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import Operator from "../models/Operator.js";
import Client from "../models/Client.js";
import { body, validationResult } from "express-validator";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "change_this_secret";

/**
 * Register client (public)
 * POST /api/auth/register (body: name, phone, houseNumber, email)
 */
router.post(
	"/register",
	body("name").notEmpty(),
	body("phone").notEmpty(),
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty())
			return res.status(400).json({ errors: errors.array() });
		const { name, phone, houseNumber, email } = req.body;
		const clientId = `c_${Date.now()}`;
		try {
			const existing = await Client.findOne({ phone });
			if (existing)
				return res.status(400).json({ error: "Client with phone exists" });
			const client = await Client.create({
				client_id: clientId,
				name,
				phone,
				houseNumber,
				email,
			});
			const token = jwt.sign({ sub: client._id, role: "client" }, JWT_SECRET, {
				expiresIn: "30d",
			});
			res.json({ token, client });
		} catch (err) {
			console.error(err);
			res.status(500).json({ error: "Registration failed" });
		}
	}
);

/**
 * Admin login (admin account should be seeded)
 * POST /api/auth/admin-login  (username, password)
 */
router.post(
	"/admin-login",
	body("username").notEmpty(),
	body("password").notEmpty(),
	async (req, res) => {
		try {
			const { username, password } = req.body;
			const admin = await Admin.findOne({ username });
			if (!admin) return res.status(401).json({ error: "Invalid credentials" });
			const ok = await bcrypt.compare(password, admin.passwordHash);
			if (!ok) return res.status(401).json({ error: "Invalid credentials" });
			const token = jwt.sign({ sub: admin._id, role: admin.role }, JWT_SECRET, {
				expiresIn: "7d",
			});
			res.json({
				token,
				admin: { username: admin.username, role: admin.role },
			});
		} catch (err) {
			console.error(err);
			res.status(500).json({ error: "Login failed" });
		}
	}
);

/**
 * Operator login (optional)
 * POST /api/auth/operator-login (email or phone + password)
 */
router.post(
	"/operator-login",
	body("email").notEmpty(),
	body("password").notEmpty(),
	async (req, res) => {
		try {
			const { email, password } = req.body;
			const op = await Operator.findOne({ email });
			if (!op || !op.passwordHash)
				return res.status(401).json({ error: "Invalid credentials" });
			const ok = await bcrypt.compare(password, op.passwordHash);
			if (!ok) return res.status(401).json({ error: "Invalid credentials" });
			const token = jwt.sign({ sub: op._id, role: "operator" }, JWT_SECRET, {
				expiresIn: "7d",
			});
			res.json({ token, operator: op });
		} catch (err) {
			console.error(err);
			res.status(500).json({ error: "Operator login failed" });
		}
	}
);

export default router;
