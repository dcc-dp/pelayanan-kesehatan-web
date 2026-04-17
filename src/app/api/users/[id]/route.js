import { NextResponse } from "next/server";
import pool from "@/src/libs/mysql";

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
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: "Ranti"
 *                   email:
 *                     type: string
 *                     example: "ranti@example.com"
 *                   password:
 *                     type: string
 *                     example: "hashed_password"
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
 *                   example: "Database connection failed"
 */

export async function GET(request, { params }) {
  const id = params.id;

  try {
    const db = await pool.getConnection();
    const [rows] = await db.execute("SELECT * FROM users WHERE id = ?", [id]);
    db.release();

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "user tidak ditemukan" },
        { status: 404 },
      );
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
