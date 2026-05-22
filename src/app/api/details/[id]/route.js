import { NextResponse } from "next/server";
import pool from "@/src/libs/mysql";

/**
 * @swagger
 * /api/details/{id}:
 *   get:
 *     summary: Mendapatkan semua detail resep berdasarkan ID pasien
 *     description: Mengambil data detail resep (obat, jumlah minum, waktu minum) untuk pasien tertentu berdasarkan user_id.
 *     tags: [Details]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID user (pasien)
 *         schema:
 *           type: integer
 *           example: 2
 *     responses:
 *       200:
 *         description: Data detail resep pasien berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 12
 *                   jumlah_minum:
 *                     type: string
 *                     example: "2 tablet"
 *                   jumlah_hari:
 *                     type: string
 *                     example: "5 hari"
 *                   waktu_minum:
 *                     type: string
 *                     example: "Setiap pagi dan malam"
 *                   nama_drug:
 *                     type: string
 *                     example: "Amoxicillin"
 *                   nm_pasien:
 *                     type: string
 *                     example: "John Doe"
 *                   nm_dokter:
 *                     type: string
 *                     example: "Dr. Sarah"
 *       404:
 *         description: Data tidak ditemukan untuk ID tersebut
 *       500:
 *         description: Terjadi kesalahan pada server
 */
export async function GET(request, { params }) {
  const details = params.id; // user_id dari path parameter

  try {
    const db = await pool.getConnection();

    const query = `
      SELECT 
        d.id,
        d.jumlah_minum,
        d.jumlah_hari,
        d.waktu_minum,
        dr.name AS nama_drug,
        pasien.name AS nm_pasien,
        dokter.name AS nm_dokter
      FROM details AS d
      LEFT JOIN drugs AS dr ON d.drugs_id = dr.id
      LEFT JOIN recipes AS re ON d.recipes_id = re.id
      LEFT JOIN users pasien ON re.users_id = pasien.id
      LEFT JOIN doctor drs ON re.doctors_id = drs.id
      LEFT JOIN users dokter ON drs.users_id = dokter.id
      WHERE d.id = ?

    `;
    const [rows] = await db.execute(query, [details]);
    db.release();

    if (rows.length === 0) {
      return NextResponse.json(
        { message: "Tidak ada data detail untuk ID pasien ini" },
        { status: 404 }
      );
    }

    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
