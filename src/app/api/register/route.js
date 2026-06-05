import { NextResponse } from "next/server";
import { prisma } from "../../../libs/prisma";
import bcrypt from "bcryptjs";

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: API untuk autentikasi
 */

/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Register pengguna baru
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - confirmPassword
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Budi Santoso"
 *               email:
 *                 type: string
 *                 example: "budi@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *               confirmPassword:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       201:
 *         description: Register berhasil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Register berhasil"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "Budi Santoso"
 *                     email:
 *                       type: string
 *                       example: "budi@example.com"
 *                     role:
 *                       type: string
 *                       example: "pasien"
 *       400:
 *         description: Validasi gagal
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Semua field wajib diisi"
 *       500:
 *         description: Terjadi kesalahan server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Terjadi kesalahan"
 *                 error:
 *                   type: string
 */

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, password, confirmPassword, gender, birth, address, whatsapp } = body;

    if (!name || !email || !password || !confirmPassword) {
      return NextResponse.json(
        { message: "Semua field wajib diisi" },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { message: "Password tidak sama" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.users.findFirst({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Email sudah terdaftar" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Mapping format gender frontend (Laki-laki / Perempuan) ke Enum database (laki_laki / perempuan)
    let dbGender = null;
    if (gender === "Laki-laki") dbGender = "laki_laki";
    if (gender === "Perempuan") dbGender = "perempuan";

    // Format birth (jika ada isian dari frontend misal YYYY-MM-DD)
    let dbBirth = null;
    if (birth) {
      dbBirth = new Date(birth);
    }

    const newUser = await prisma.users.create({
      data: {
        name,
        email,
        password: hashedPassword,
        gender: dbGender,
        birth: dbBirth,
        address: address || null,
        whatsapp: whatsapp || null,
        role: "user", // Otomatis role user
        created_at: new Date(),
        updated_at: new Date(),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return NextResponse.json(
      {
        message: "Register berhasil",
        user: newUser,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Terjadi kesalahan", error: error.message },
      { status: 500 }
    );
  }
}