import { NextResponse } from "next/server";
import pool from "@/libs/mysql";

/**
 * @swagger
 * /api/category_spesialis/{id}:
 *   get:
 *     summary: Mendapatkan detail kategori spesialis berdasarkan ID
 *     description: Mengambil satu data kategori spesialis dari database menggunakan parameter ID.
 *     tags: [Category Spesialis]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 3
 *         description: ID kategori spesialis yang ingin diambil
 *     responses:
 *       200:
 *         description: Data kategori spesialis berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 3
 *                   specialis_name:
 *                     type: string
 *                     example: "Kardiologi"
 *                   description:
 *                     type: string
 *                     example: "Spesialis penyakit jantung dan pembuluh darah"
 *       404:
 *         description: Data kategori spesialis tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan pada server
 */


export async function GET(request, { params }) {
  const category_spesialisId = params.id; // user id

  try {
    const db = await pool.getConnection();

    const query = "select * from category_spesialis where id = ?";
    const [rows] = await db.execute(query, [category_spesialisId]);
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
