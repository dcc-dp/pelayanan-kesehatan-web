import { NextResponse } from "next/server";
import { prisma } from "@/src/libs/prisma";

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API untuk mengelola data pengguna (users)
 */

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Mendapatkan data pengguna berdasarkan ID
 *     description: Mengambil satu data pengguna berdasarkan ID tanpa menampilkan password.
 *     tags: [Users]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID pengguna yang ingin diambil
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Data pengguna berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: "Ranti"
 *                 email:
 *                   type: string
 *                   example: "ranti@example.com"
 *                 gender:
 *                   type: string
 *                   example: "perempuan"
 *                 birth:
 *                   type: string
 *                   format: date
 *                   example: "2000-01-01"
 *                 address:
 *                   type: string
 *                   example: "Makassar"
 *                 whatsapp:
 *                   type: string
 *                   example: "08123456789"
 *                 image:
 *                   type: string
 *                   example: "/uploads/user.jpg"
 *                 role:
 *                   type: string
 *                   example: "user"
 *       404:
 *         description: Pengguna tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found"
 *       500:
 *         description: Terjadi kesalahan pada server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 */

export async function GET(request, { params }) {
  try {
    const id = parseInt(params.id);

    const user = await prisma.users.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        gender: true,
        birth: true,
        address: true,
        whatsapp: true,
        image: true,
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
