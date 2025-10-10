import { NextResponse } from "next/server";
import pool from "@/src/libs/mysql";

/**
 * @swagger
 * /api/doctor/{id}:
 *   get:
 *     summary: Mendapatkan detail dokter berdasarkan ID
 *     tags: [Doctor]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID dari dokter yang ingin diambil
 *         schema:
 *           type: integer
 *           example: 3
 *     responses:
 *       200:
 *         description: Detail dokter berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 3
 *                 users_id:
 *                   type: integer
 *                   example: 2
 *                 category_spesialis_id:
 *                   type: integer
 *                   example: 1
 *                 description:
 *                   type: string
 *                   example: "Dokter spesialis anak dengan pengalaman 8 tahun"
 *                 license:
 *                   type: string
 *                   example: "DOK87654321"
 *                 certificate:
 *                   type: string
 *                   example: "certificate_anak.pdf"
 *                 role:
 *                   type: string
 *                   example: "doctor"
 *       404:
 *         description: Dokter tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan pada server
 */
export async function GET(request, { params }) {
  const doctorId = params.id;

  try {
    const db = await pool.getConnection();

    const query = "SELECT * FROM doctor WHERE id = ?";
    const [rows] = await db.execute(query, [doctorId]);
    db.release();

    if (rows.length === 0) {
      return NextResponse.json(
        { message: "Doctor not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
