import { NextResponse } from "next/server";
import pool from "@/src/libs/mysql";

/**
 * @swagger
 * /api/category_spesialis/{id}:
 *   get:
 *     summary: Mendapatkan detail kategori spesialis berdasarkan ID
 *     description: Mengambil satu data kategori spesialis dari database berdasarkan ID.
 *     tags: [Category Spesialis]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID kategori spesialis
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
 *                 specialis_name:
 *                   type: string
 *                 description:
 *                   type: string
 *       404:
 *         description: Data tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan pada server
 */
export async function GET(request, { params }) {
  const id = params.id;

  try {
    const db = await pool.getConnection();
    const [rows] = await db.execute(
      "SELECT * FROM category_spesialis WHERE id = ?",
      [id]
    );
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
