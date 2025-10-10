import { NextResponse } from "next/server";
import pool from "@/src/libs/mysql";

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Mendapatkan data user berdasarkan ID
 *     description: Endpoint ini mengembalikan detail data user berdasarkan ID yang diberikan.
 *     tags:
 *       - Users
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
 *         description: Berhasil mendapatkan data user
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
 *                   example: Syah
 *                 gender:
 *                   type: string
 *                   example: Male
 *                 birth:
 *                   type: string
 *                   format: date
 *                   example: 2003-05-15
 *                 address:
 *                   type: string
 *                   example: Makassar, Sulawesi Selatan
 *                 whatsapp:
 *                   type: string
 *                   example: "081234567890"
 *                 email:
 *                   type: string
 *                   example: syah@example.com
 *                 image:
 *                   type: string
 *                   example: https://example.com/profile.jpg
 *       400:
 *         description: ID tidak valid atau tidak diberikan
 *       404:
 *         description: User tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan di server
 */

export async function GET(request, { params }) {
  const userId = params.id; // user id

  try {
    const db = await pool.getConnection();

    const query = "select * from users where id = ?";
    const [rows] = await db.execute(query, [userId]);
    db.release();

    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json(
      {
        error: error. message,
      },
      { error: error.message, status: 500 }
    );
  }
}
