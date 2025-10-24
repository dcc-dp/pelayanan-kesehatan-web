import { NextResponse } from "next/server";
import pool from "@/libs/mysql";

/**
 * @swagger
 * /api/category_spesialis/{id}:
 *   get:
 *     summary: Mendapatkan detail kategori spesialis berdasarkan ID
 *     description: Mengambil satu data kategori spesialis dari database berdasarkan ID yang diberikan.
 *     tags: [Category Spesialis]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID kategori spesialis yang ingin diambil
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Data kategori spesialis berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 specialis_name:
 *                   type: string
 *                   example: "Psikologi"
 *                 description:
 *                   type: string
 *                   example: "Spesialis kesehatan mental dan perilaku"
 *       404:
 *         description: Data kategori spesialis tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan pada server
 */

export async function GET(request, { params }) {
  const category_spesialisId = params.id;

  try {
    const db = await pool.getConnection();
    const query = "SELECT * FROM category_spesialis WHERE id = ?";
    const [rows] = await db.execute(query, [category_spesialisId]);
    db.release();

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Kategori spesialis tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
