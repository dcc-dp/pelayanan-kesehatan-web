import { NextResponse } from "next/server";
import pool from "../../../libs/mysql";

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: API untuk autentikasi (login)
 */

/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Register pengguna
 *     tags: [Auth]
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
 *                 example: "ranti@example.com"
 *               password:
 *                 type: string
 *                 example: "123456"
 *               ConfirmPassword:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Akun berhasil dibuat
 *       401:
 *         description: Email atau password salah
 *       500:
 *         description: Terjadi kesalahan server
 */

export async function POST(request) {
  let db;

  try {
    const body = await request.json();
    const { name, email, password } = body;

    // 🔎 Validasi input
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Semua field wajib diisi" },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password minimal 6 karakter" },
        { status: 400 },
      );
    }

    // koneksi DB
    db = await pool.getConnection();

    // 🔎 Cek email sudah ada atau belum
    const [existingUser] = await db.execute(
      "SELECT id FROM users WHERE email = ?",
      [email],
    );

    if (existingUser.length > 0) {
      return NextResponse.json(
        { message: "Email sudah terdaftar" },
        { status: 400 },
      );
    }

    // 🔐 Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 💾 Simpan ke database
    const [result] = await db.execute(
      "INSERT INTO users ( email, password) VALUES ( ?, ?)",
      [email, hashedPassword],
    );

    // 📦 Ambil user yang baru dibuat (tanpa password)
    const [newUser] = await db.execute(
      "SELECT id, name, email FROM users WHERE id = ?",
      [result.insertId],
    );

    return NextResponse.json(
      {
        message: "Register berhasil",
        user: newUser[0],
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Terjadi kesalahan", error: error.message },
      { status: 500 },
    );
  } finally {
    // 🔄 pastikan koneksi ditutup
    if (db) db.release();
  }
}
