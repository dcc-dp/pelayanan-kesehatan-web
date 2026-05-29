import { NextResponse } from "next/server";
<<<<<<< HEAD
import { prisma } from "../../../libs/prisma";
import bcrypt from "bcryptjs";

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: API untuk autentikasi (login)
 */

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Login pengguna
 *     tags: [Auth]
=======
import jwt from "jsonwebtoken";
import mysql from "mysql2/promise";

/**
 * @openapi
 * /api/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Login user
 *     description: Endpoint untuk login user menggunakan email dan password
>>>>>>> 3296d7c76983a4448baeb199edd0ba18bec61877
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
<<<<<<< HEAD
 *                 example: "ranti@example.com"
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Login berhasil
 *       401:
 *         description: Email atau password salah
 *       500:
 *         description: Terjadi kesalahan server
 */

export const runtime = 'nodejs' // 👈 required for Prisma

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    const user = await prisma.users.findFirst({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Email tidak ditemukan" },
        { status: 401 },
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json({ message: "Password salah" }, { status: 401 });
    }

    delete user.password;

    return NextResponse.json({
      message: "Login berhasil",
      user,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
=======
 *                 example: admin@mail.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Login berhasil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *       400:
 *         description: Request tidak valid
 *       401:
 *         description: Email atau password salah
 *       500:
 *         description: Server error
 */

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    // validasi input
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email dan password wajib diisi" },
        { status: 400 }
      );
    }

    // koneksi database
    const db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    // cari user
    const [rows] = await db.execute(
      "SELECT id, email, password, role FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { message: "Email atau password salah" },
        { status: 401 }
      );
    }

    const user = rows[0];

    // cek password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { message: "Email atau password salah" },
        { status: 401 }
      );
    }

    // generate JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return NextResponse.json({
      message: "Login berhasil",
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 }
    );
>>>>>>> 3296d7c76983a4448baeb199edd0ba18bec61877
  }
}
