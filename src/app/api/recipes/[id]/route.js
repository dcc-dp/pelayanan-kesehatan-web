import { NextResponse } from "next/server";
import pool from "@/src/libs/mysql";

/**
 * @swagger
 * tags:
 *   name: Recipes
 *   description: API untuk mendapatkan detail resep berdasarkan ID
 */

/**
 * @swagger
 * /api/recipes/{id}:
 *   get:
 *     summary: Mendapatkan detail resep berdasarkan ID
 *     description: Mengambil data lengkap resep termasuk informasi pasien dan dokter berdasarkan `id` resep.
 *     tags: [Recipes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID resep yang ingin diambil
 *         example: 1
 *     responses:
 *       200:
 *         description: Data resep berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   pasien:
 *                     type: string
 *                     example: "Ahmad Fauzi"
 *                   gender:
 *                     type: string
 *                     example: "Laki-laki"
 *                   email:
 *                     type: string
 *                     example: "ahmad.fauzi@example.com"
 *                   tgl_lahir:
 *                     type: string
 *                     format: date
 *                     example: "1995-06-21"
 *                   alamat:
 *                     type: string
 *                     example: "Jl. Merpati No. 7, Jakarta"
 *                   nomor_wa:
 *                     type: string
 *                     example: "081234567890"
 *                   foto:
 *                     type: string
 *                     example: "/uploads/ahmad.jpg"
 *                   role:
 *                     type: string
 *                     example: "user"
 *                   dokter:
 *                     type: string
 *                     example: "dr. Sinta Rahma"
 *                   deskripsi:
 *                     type: string
 *                     example: "Dokter umum berpengalaman 5 tahun"
 *                   lisensi:
 *                     type: string
 *                     example: "12345/MED/2023"
 *                   sertifikat:
 *                     type: string
 *                     example: "/certs/sinta.pdf"
 *       404:
 *         description: Resep tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Data resep tidak ditemukan"
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
  const recipesId = params.id; // ambil ID dari URL

  try {
    const db = await pool.getConnection();

    const query = `
      SELECT 
        u1.name AS pasien,
        u1.gender,
        u1.email,
        u1.birth AS tgl_lahir,
        u1.address AS alamat,
        u1.whatsapp AS nomor_wa,
        u1.image AS foto,
        u1.role AS role,
        u2.name AS dokter,
        d.description AS deskripsi,
        d.license AS lisensi,
        d.certificate AS sertifikat
      FROM recipes c
      INNER JOIN users u1 ON c.users_id = u1.id
      INNER JOIN doctor d ON c.doctors_id = d.id
      INNER JOIN users u2 ON d.users_id = u2.id
      WHERE c.id = ?
    `;

    const [rows] = await db.execute(query, [recipesId]);
    db.release();

    if (rows.length === 0) {
      return NextResponse.json(
        { message: "Data resep tidak ditemukan" },
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
