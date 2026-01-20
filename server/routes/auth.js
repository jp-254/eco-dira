import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import Operator from "../models/Operator.js";
import Client from "../models/Client.js";
import { body, validationResult } from "express-validator";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "change_this_secret";

function parseToken(authorization) {
	if (!authorization) return null;
	const token = authorization.replace("Bearer ", "");
	try {
		return jwt.verify(token, JWT_SECRET);
	} catch (e) {
		return null;
	}
}

// GET /api/auth/me
router.get("/me", async (req, res) => {
	try {
		const auth = req.headers.authorization;
		const payload = parseToken(auth);
		if (!payload) return res.status(401).json({ error: "Not authenticated" });

		const { sub, role } = payload;
		// return minimal info depending on role
		if (role === "admin") {
			const admin = await Admin.findById(sub).select("username role");
			return res.json({ role, admin });
		}
		if (role === "operator") {
			const op = await Operator.findById(sub).select("email role");
			return res.json({
				role,
				operator: {
					id: op._id.toString(),
					email: op.email,
				},
			});
		}

		// client
		const client = await Client.findById(sub).select(
			"name phone client_id houseNumber pointsBalance"
		);
		return res.json({
			role: "client",
			client: {
				_id: client._id.toString(),
			},
		});

	} catch (err) {
		console.error("GET /auth/me error", err);
		res.status(500).json({ error: "Server error" });
	}
});

// server/routes/auth.js (register handler)
// Client registration
// POST /api/auth/register

router.post(
  "/register",
  body("name").notEmpty(),
  body("phone").notEmpty(),
  body("password").isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const name = String(req.body.name || "").trim();
    const phone = String(req.body.phone || "").trim();
    const houseNumber = String(req.body.houseNumber || "").trim();
    const email = req.body.email ? String(req.body.email).trim() : "";
    const password = String(req.body.password || "");

    try {
      const existing = await Client.findOne({ phone });
      if (existing) return res.status(400).json({ error: "Client with phone exists" });

      const hash = await bcrypt.hash(password, 10);

      const client = await Client.create({
        client_id: `c_${Date.now()}`,
        name,
        phone,
        houseNumber,
        email,
        passwordHash: hash,
        pointsBalance: 0,
      });

      const token = jwt.sign({ sub: client._id.toString(), role: "client" }, JWT_SECRET, {
        expiresIn: "30d",
      });

      return res.json({ token, client });
    } catch (err) {
      console.error("Register error:", err);
      return res.status(500).json({ error: "Registration failed" });
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
			res.json({
				token,
				operator: {
					id: op._id.toString(),
					email: op.email,
					role: "operator",
				},
			});


		} catch (err) {
			console.error(err);
			res.status(500).json({ error: "Operator login failed" });
		}
	}
);

// client login
router.post("/client-login",
  body("phone").notEmpty(),
  body("password").notEmpty(),
  async (req, res) => {
    try {
      const { phone, password } = req.body;
      const client = await Client.findOne({ phone });
      if (!client || !client.passwordHash) return res.status(401).json({ error: "Invalid credentials" });
      const ok = await bcrypt.compare(password, client.passwordHash);
      if (!ok) return res.status(401).json({ error: "Invalid credentials" });
      const token = jwt.sign({ sub: client._id.toString(), role: "client" }, JWT_SECRET, { expiresIn: "30d" });
      return res.json({ token, client });
    } catch (err) {
      console.error("client-login error:", err);
      return res.status(500).json({ error: "Login failed" });
    }
  }
);


export default router;
