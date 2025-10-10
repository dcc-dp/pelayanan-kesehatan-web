import { NextResponse } from "next/server";
import pool from "@/src/libs/mysql";

/**
 * @swagger
 * /api/consultations/{id}:
 *   get:
 *     summary: Mendapatkan detail konsultasi berdasarkan ID
 *     description: Mengambil data detail konsultasi pasien tertentu berdasarkan **ID konsultasi**. Data mencakup informasi pasien dan dokter.
 *     tags: [Consultations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID dari konsultasi yang ingin diambil.
 *         schema:
 *           type: integer
 *           example: 3
 *     responses:
 *       200:
 *         description: Data konsultasi berhasil diambil.
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
 *                   pasien:
 *                     type: string
 *                     example: "Budi Santoso"
 *                     description: Nama pasien
 *                   gender:
 *                     type: string
 *                     example: "Laki-laki"
 *                     description: Jenis kelamin pasien
 *                   email:
 *                     type: string
 *                     example: "budi@example.com"
 *                     description: Email pasien
 *                   tgl_lahir:
 *                     type: string
 *                     format: date
 *                     example: "1990-01-01"
 *                     description: Tanggal lahir pasien
 *                   alamat:
 *                     type: string
 *                     example: "Jl. Merdeka No.10"
 *                     description: Alamat pasien
 *                   nomor_wa:
 *                     type: string
 *                     example: "08123456789"
 *                     description: Nomor WhatsApp pasien
 *                   foto:
 *                     type: string
 *                     example: "https://example.com/images/budi.jpg"
 *                     description: Foto pasien
 *                   role:
 *                     type: string
 *                     example: "pasien"
 *                     description: Role pengguna
 *                   dokter:
 *                     type: string
 *                     example: "Dr. Siti Aminah"
 *                     description: Nama dokter
 *                   deskripsi:
 *                     type: string
 *                     example: "Dokter spesialis penyakit dalam"
 *                     description: Deskripsi dokter
 *                   lisensi:
 *                     type: string
 *                     example: "ID123456789"
 *                     description: Nomor lisensi dokter
 *                   sertifikat:
 *                     type: string
 *                     example: "https://example.com/certificates/drsiti.pdf"
 *                     description: Sertifikat dokter
 *       404:
 *         description: Data konsultasi tidak ditemukan.
 *       500:
 *         description: Terjadi kesalahan pada server.
 */

export async function GET(request, { params }) {
  const consultationId = params.id;

  try {
    const db = await pool.getConnection();

    const query = `
      SELECT 
        c.id,
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
      WHERE c.id = ?;
    `;

    const [rows] = await db.execute(query, [consultationId]);
    db.release();

    if (rows.length === 0) {
      return NextResponse.json(
        { message: "Data konsultasi tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
