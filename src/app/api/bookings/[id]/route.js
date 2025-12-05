import { NextResponse } from "next/server";
import pool from "../../../../../lib/mysql";


/**
 * @swagger
 * /api/bookings/{id}:
 *   get:
 *     summary: Mendapatkan detail booking berdasarkan ID
 *     description: Mengambil data detail pemesanan (booking) tertentu berdasarkan **ID booking**. Data mencakup nama pembeli, nama dokter, dan total biaya resep.
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID dari booking yang ingin diambil.
 *         schema:
 *           type: integer
 *           example: 5
 *     responses:
 *       200:
 *         description: Data booking berhasil diambil.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   nm_pembeli:
 *                     type: string
 *                     example: "John Doe"
 *                     description: Nama pasien atau pembeli resep.
 *                   nm_dokter:
 *                     type: string
 *                     example: "Dr. Sarah Amelia"
 *                     description: Nama dokter yang menangani pasien.
 *                   total:
 *                     type: number
 *                     example: 250000
 *                     description: Total biaya resep yang dibayar.
 *       404:
 *         description: Data booking tidak ditemukan.
 *       500:
 *         description: Terjadi kesalahan pada server.
 */

export async function GET(request, { params }) {
  const bookingsId = params.id; 

  try {
    const db = await pool.getConnection();

    const query = `
    SELECT 
        pembeli.name AS nm_pembeli,
        dokter.name AS nm_dokter,
        b.total
      FROM bookings b
      INNER JOIN recipes r ON b.recipes_id = r.id
      INNER JOIN users pembeli ON r.users_id = pembeli.id
      INNER JOIN doctor dr ON r.doctors_id = dr.id
      INNER JOIN users dokter ON dr.users_id = dokter.id
      WHERE b.id = ?;
    `;  
    const [rows] = await db.execute(query, [bookings]);
    db.release();

    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

