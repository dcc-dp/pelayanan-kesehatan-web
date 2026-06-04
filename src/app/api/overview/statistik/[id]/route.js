import { NextResponse } from "next/server";
import { prisma } from "@/src/libs/prisma";

/**
 * @swagger
 * tags:
 *   - name: Overview - Statistik
 *     description: API untuk melihat statistik aktivitas user
 */

/**
 * @swagger
 * /api/overview/statistik/{id}:
 *   get:
 *     summary: Mendapatkan statistik aktivitas user
 *     description: |
 *       Endpoint ini digunakan untuk mengambil jumlah total aktivitas user,
 *       meliputi:
 *       - Total konsultasi
 *       - Total jadwal konsultasi
 *       - Total resep
 *     tags: [Overview - Statistik]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID user
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan statistik user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total_konsultasi:
 *                   type: integer
 *                   example: 5
 *                 total_jadwal:
 *                   type: integer
 *                   example: 3
 *                 total_resep:
 *                   type: integer
 *                   example: 10
 *       400:
 *         description: ID tidak valid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid user ID"
 *       404:
 *         description: User tidak ditemukan
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
  const userId = Number(params.id);

  // ✅ validasi ID
  if (!userId || isNaN(userId)) {
    return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });
  }

  try {
    // ✅ cek user ada atau tidak
    const user = await prisma.users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // ✅ ambil statistik secara paralel (lebih cepat)
    const [totalKonsultasi, totalJadwal, totalResep] = await Promise.all([
      prisma.consultations.count({
        where: { users_id: userId },
      }),
      prisma.schedules.count({
        where: { users_id: userId },
      }),
      prisma.recipes.count({
        where: { users_id: userId },
      }),
    ]);

    return NextResponse.json({
      total_konsultasi: totalKonsultasi,
      total_jadwal: totalJadwal,
      total_resep: totalResep,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
