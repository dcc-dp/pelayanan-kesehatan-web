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
 * /api/login:
 *   post:
 *     summary: Login pengguna
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
 *     responses:
 *       200:
 *         description: Login berhasil
 *       401:
 *         description: Email atau password salah
 *       500:
 *         description: Terjadi kesalahan server
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const db = await pool.getConnection();

    const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    db.release();

    // cek user ada atau tidak
    if (rows.length === 0) {
      return NextResponse.json(
        { message: "Email tidak ditemukan" },
        { status: 401 },
      );
    }

    const user = rows[0];

    // cek password (pakai bcrypt)
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json({ message: "Password salah" }, { status: 401 });
    }

    // hapus password dari response
    delete user.password;

    return NextResponse.json({
      message: "Login berhasil",
      user,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
