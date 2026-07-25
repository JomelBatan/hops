import bcrypt from "bcrypt";
import { query } from "../config/db.js";
import { signToken } from "../utils/jwt.js";
import { ApiError } from "../utils/ApiError.js";
import type { User } from "../type/index.js";
import type { Request, Response } from "express";

const EMAIL_RE = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const publicUser = (u: User) => ({
  id: u.id,
  name: u.name,
  email: u.email,
  avatar_url: u.avatar_url,
  created_at: u.created_at,
});

export async function register(req: Request, res: Response) {
  try {
    const name = (req.body.name || "").trim();
    const email = (req.body.email || "").trim().toLowerCase();
    const { password } = req.body;

    if (!name) throw ApiError.badRequest("Name is required");
    if (!EMAIL_RE.test(email))
      throw ApiError.badRequest("A valid email is required");
    if (!password || password.length < 6)
      throw ApiError.badRequest("Password must be at least 6 characters");

    const existing = await query("SELECT id FROM users WHERE email = $1", [
      email,
    ]);

    if (existing.rows.length)
      throw ApiError.conflict("Email is already registered");

    const password_hash = await bcrypt.hash(password, 10);
    const { rows } = await query(
      `INSERT INTO users (name, email, password_hash)
        VALUES ($1, $2, $3)
        RETURNING  id, name, email, avatar_url, created_at`,
      [name, email, password_hash],
    );

    const user = rows[0];
    const token = signToken({
      id: user.id,
      email: user.email,
      name: user.name,
    });

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
      path: "/",
    });
    res.status(201).json({ user: publicUser(user) });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Erorr on Auth Controller: [Register Function]" });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const email = (req.body.email || "").trim().toLowerCase();
    const { password } = req.body;

    if (!email || !password)
      throw ApiError.badRequest("Email and Password are required");

    const { rows } = await query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    const user = rows[0];
    if (!user) throw ApiError.unauthorized("Invalid credentials");

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) throw ApiError.unauthorized("Invalid credentials");

    const token = signToken({
      id: user.id,
      email: user.email,
      name: user.name,
    });
    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7,
      path: "/",
    });

    return res.json({ user: publicUser(user) });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Erorr on Auth Controller: [Login Function]" });
  }
}

export async function logout(req: Request, res: Response) {
  try {
    res.clearCookie("access_token");

    return res.status(200);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Erorr on Auth Controller: [Logout Function]" });
  }
}
export async function me(req: Request, res: Response) {
  try {
    const userId = req.user!.id;

    const { rows } = await query(
      "SELECT id, name, email, avatar_url, created_at FROM users WHERE id = $1",
      [userId],
    );
    if (!rows.length) throw ApiError.notFound("User not found");
    res.json({ user: rows[0] });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Erorr on Auth Controller: [Register Function]" });
  }
}
