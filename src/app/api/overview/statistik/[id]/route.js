import { NextResponse } from "next/server";
import pool from "@/src/libs/mysql";


/**
 * @swagger
 * /api/overview/statistik/{id}:
 *   get:
 *     summary: Mendapatkan statistik aktivitas user
 *     description: Endpoint ini digunakan untuk mengambil jumlah total konsultasi, jadwal, dan resep yang dimiliki oleh user berdasarkan ID.
 *     tags:
 *     - Overview - Statistik
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID user yang ingin diambil datanya
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
 *                   description: Jumlah total konsultasi user
 *                 total_jadwal:
 *                   type: integer
 *                   example: 3
 *                   description: Jumlah total jadwal user
 *                 total_resep:
 *                   type: integer
 *                   example: 12
 *                   description: Jumlah total resep yang dibuat user
 *       400:
 *         description: ID user tidak valid atau tidak diberikan
 *       404:
 *         description: User tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan di server
 */

export async function GET(request, {params}) {
  const userId = params.id; // user id

  try {
    const db = await pool.getConnection();
    const query = `SELECT 
    (SELECT COUNT(*) FROM consultations WHERE users_id = ?) AS total_konsultasi,
    (SELECT COUNT(*) FROM schedules WHERE users_id = ?) AS total_jadwal,
    (SELECT COUNT(*) FROM recipes WHERE users_id = ?) AS total_resep
`;

const [rows] = await db.execute(query, [userId, userId, userId]);
    db.release();

    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json(
      {
        error: error.message,
      },
      { status: 500 }
    );
  }
}