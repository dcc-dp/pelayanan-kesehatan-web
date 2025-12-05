import { NextResponse } from "next/server";
import pool from "@/src/libs/mysql";

/**
 * @swagger
 * tags:
 *   name: Drugs
 *   description: API untuk mengelola data obat
 */

/**
 * @swagger
 * /api/drugs/{id}:
 *   get:
 *     summary: Mendapatkan data obat berdasarkan ID
 *     description: Mengambil data obat dari database berdasarkan ID yang diberikan.
 *     tags: [Drugs]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID obat yang ingin diambil
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Data obat berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: "Paracetamol"
 *                   type:
 *                     type: string
 *                     example: "Tablet"
 *                   price:
 *                     type: number
 *                     example: 15000
 *       404:
 *         description: Data obat tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Drugs not found"
 *       500:
 *         description: Terjadi kesalahan pada server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Database connection failed"
 */

export async function GET(request, { params }) {
  const drugsId = params.id; // ID obat dari path parameter

  try {
    const db = await pool.getConnection();
    const query = "SELECT * FROM drugs WHERE id = ?";
    const [rows] = await db.execute(query, [drugsId]);
    db.release();

    // Jika data tidak ditemukan
    if (rows.length === 0) {
      return NextResponse.json({ message: "Drugs not found" }, { status: 404 });
    }

    return NextResponse.json(rows[0]); // kirim objek tunggal
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
