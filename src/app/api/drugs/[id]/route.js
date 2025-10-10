import { NextResponse } from "next/server";
import pool from "@/src/libs/mysql";

/**
 * @swagger
 * /api/drugs/{id}:
 *   get:
 *     summary: Mendapatkan detail obat berdasarkan ID
 *     tags: [Drugs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID dari obat yang ingin diambil
 *         schema:
 *           type: integer
 *           example: 5
 *     responses:
 *       200:
 *         description: Detail obat berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 5
 *                 name:
 *                   type: string
 *                   example: "Paracetamol 500mg"
 *                 price:
 *                   type: number
 *                   example: 12000
 *                 stock:
 *                   type: integer
 *                   example: 100
 *                 description:
 *                   type: string
 *                   example: "Obat penurun demam dan pereda nyeri"
 *       404:
 *         description: Obat tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan pada server
 */
export async function GET(request, { params }) {
  const drugsId = params.id;

  try {
    const db = await pool.getConnection();

    const query = "SELECT * FROM drugs WHERE id = ?";
    const [rows] = await db.execute(query, [drugsId]);
    db.release();

    if (rows.length === 0) {
      return NextResponse.json(
        { message: "Drug not found" },
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
