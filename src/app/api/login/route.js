import { NextResponse } from "next/server";
import { prisma } from "../../../libs/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const runtime = "nodejs";

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
 *     description: Endpoint login menggunakan email dan password
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
 *                 example: admin@mail.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Login berhasil
 *       400:
 *         description: Email dan password wajib diisi
 *       401:
 *         description: Email atau password salah
 *       500:
 *         description: Terjadi kesalahan server
 */

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    // Validasi input
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Email dan password wajib diisi",
        },
        { status: 400 }
      );
    }

    // Cari user berdasarkan email
    const user = await prisma.users.findFirst({
      where: {
        email,
      },
    });

    // Jika user tidak ditemukan
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Email atau password salah",
        },
        { status: 401 }
      );
    }

    // ==========================
    // CEK PASSWORD
    // ==========================

    let isValid = false;

    // Jika password database masih plaintext
    if (
      !user.password.startsWith("$2a$") &&
      !user.password.startsWith("$2b$")
    ) {
      isValid = password === user.password;
    } else {
      // Jika password sudah bcrypt hash
      isValid = await bcrypt.compare(
        password,
        user.password
      );
    }

    if (!isValid) {
      return NextResponse.json(
        {
          success: false,
          message: "Email atau password salah",
        },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    // Hilangkan password dari response
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      {
        success: true,
        message: "Login berhasil",
        token,
        user: userWithoutPassword,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan server",
        error: error.message,
      },
      { status: 500 }
    );
  }
}