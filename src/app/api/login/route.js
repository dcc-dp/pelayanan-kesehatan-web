import { NextResponse } from "next/server";
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
  }
}
