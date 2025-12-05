import { NextResponse } from "next/server";
import pool from "@/src/libs/mysql";

/**
 * @swagger
 * /api/overview/consultations/{id}:
 *   get:
 *     summary: Mendapatkan detail konsultasi berdasarkan ID
 *     description: Endpoint ini digunakan untuk mengambil detail data konsultasi berdasarkan ID konsultasi, termasuk informasi pasien dan dokter yang terlibat.
 *     tags:
 *       - Overview - Consultations
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID konsultasi yang ingin diambil
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan data konsultasi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   pasien:
 *                     type: string
 *                     example: Syah
 *                     description: Nama pasien yang melakukan konsultasi
 *                   gender:
 *                     type: string
 *                     example: Laki-laki
 *                   email:
 *                     type: string
 *                     example: syah@example.com
 *                   tgl_lahir:
 *                     type: string
 *                     format: date
 *                     example: 2001-05-21
 *                   alamat:
 *                     type: string
 *                     example: Jl. Melati No. 10, Makassar
 *                   nomor_wa:
 *                     type: string
 *                     example: "081234567890"
 *                   foto:
 *                     type: string
 *                     example: https://example.com/profile.jpg
 *                   role:
 *                     type: string
 *                     example: user
 *                   dokter:
 *                     type: string
 *                     example: dr. Andi Wijaya
 *                     description: Nama dokter yang melakukan konsultasi
 *                   deskripsi:
 *                     type: string
 *                     example: Spesialis penyakit dalam
 *                   lisensi:
 *                     type: string
 *                     example: SIP-123456
 *                   sertifikat:
 *                     type: string
 *                     example: https://example.com/certificate.pdf
 *       404:
 *         description: Konsultasi tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan di server
 */


export async function GET(request, { params }) {
  const consultations = params.id; // user id

  try {
    const db = await pool.getConnection();

    const query = `
  SELECT 
    u1.name AS pasien,
    u1.gender,
    u1.email,
    u1.birth as tgl_lahir,
    u1.address as alamat,
    u1.whatsapp as nomor_wa,
    u1.image as foto,
    u1.role as role,
    u2.name AS dokter,
    d.description AS deskripsi,
    d.license AS lisensi,
    d.certificate AS sertifikat
  FROM consultations c
  INNER JOIN users u1 ON c.users_id = u1.id
  INNER JOIN doctor d ON c.doctors_id = d.id
  INNER JOIN users u2 ON d.users_id = u2.id
  where c.id = ? order by DATE(c.created_at) DESC
`;  
    const [rows] = await db.execute(query, [consultations]);
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
