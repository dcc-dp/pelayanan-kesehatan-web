import { NextResponse } from "next/server";
import pool from "@/src/libs/mysql";

/**
 * @swagger
 * tags:
 *   - name: Consultations
 *     description: API untuk mengelola data konsultasi antara pasien dan dokter
 */

/**
 * @swagger
 * /api/consultations:
 *   get:
 *     summary: Mendapatkan semua data konsultasi
 *     description: Mengambil seluruh data konsultasi, termasuk informasi pasien dan dokter terkait.
 *     tags: [Consultations]
 *     responses:
 *       200:
 *         description: Data konsultasi berhasil diambil
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
 *                     example: "Andi Pratama"
 *                   gender:
 *                     type: string
 *                     example: "Laki-laki"
 *                   email:
 *                     type: string
 *                     example: "andi@gmail.com"
 *                   tgl_lahir:
 *                     type: string
 *                     example: "1998-07-14"
 *                   alamat:
 *                     type: string
 *                     example: "Jl. Melati No. 23"
 *                   nomor_wa:
 *                     type: string
 *                     example: "+628123456789"
 *                   foto:
 *                     type: string
 *                     example: "https://example.com/foto.jpg"
 *                   role:
 *                     type: string
 *                     example: "user"
 *                   dokter:
 *                     type: string
 *                     example: "Dr. Budi Santoso"
 *                   deskripsi:
 *                     type: string
 *                     example: "Spesialis Penyakit Dalam"
 *                   lisensi:
 *                     type: string
 *                     example: "MED-12345"
 *                   sertifikat:
 *                     type: string
 *                     example: "https://example.com/sertifikat.pdf"
 *       500:
 *         description: Terjadi kesalahan pada server
 */
export async function GET() {
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
        d.certificate AS sertifikat,
        c.created_at,
        c.updated_at
      FROM consultations c
      INNER JOIN users u1 ON c.users_id = u1.id
      INNER JOIN doctor d ON c.doctors_id = d.id
      INNER JOIN users u2 ON d.users_id = u2.id
    `;
    const [rows] = await db.execute(query);
    db.release();
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/consultations:
 *   post:
 *     summary: Menambahkan data konsultasi baru
 *     description: Menyimpan data konsultasi baru antara pasien dan dokter ke dalam database.
 *     tags: [Consultations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - users_id
 *               - doctors_id
 *             properties:
 *               users_id:
 *                 type: integer
 *                 example: 1
 *               doctors_id:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: Konsultasi berhasil ditambahkan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 5
 *       400:
 *         description: Permintaan tidak valid
 *       500:
 *         description: Terjadi kesalahan pada server
 */
export async function POST(request) {
  try {
    const data = await request.json();
    const db = await pool.getConnection();

    const query =
      "INSERT INTO consultations(users_id, doctors_id) VALUES (?, ?)";
    const [result] = await db.execute(query, [data.users_id, data.doctors_id]);
    db.release();

    return NextResponse.json({ id: result.insertId }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/consultations:
 *   put:
 *     summary: Memperbarui data konsultasi
 *     description: Mengubah data konsultasi berdasarkan ID.
 *     tags: [Consultations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - users_id
 *               - doctors_id
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 3
 *               users_id:
 *                 type: integer
 *                 example: 1
 *               doctors_id:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Data konsultasi berhasil diperbarui
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "consultations updated successfully"
 *       404:
 *         description: Data tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan pada server
 */
export async function PUT(request) {
  try {
    const data = await request.json();
    const consultationsId = data.id;
    const db = await pool.getConnection();

    const query =
      "UPDATE consultations SET users_id = ?, doctors_id = ? WHERE id = ?";
    await db.execute(query, [data.users_id, data.doctors_id, consultationsId]);
    db.release();

    return NextResponse.json({
      message: "consultations updated successfully",
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/consultations:
 *   delete:
 *     summary: Menghapus data konsultasi
 *     description: Menghapus data konsultasi berdasarkan ID.
 *     tags: [Consultations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       200:
 *         description: Data konsultasi berhasil dihapus
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "consultations deleted successfully"
 *       404:
 *         description: Data tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan pada server
 */
export async function DELETE(request) {
  try {
    const db = await pool.getConnection();
    const data = await request.json();
    const consultationsId = data.id;
    const query = "DELETE FROM consultations WHERE id = ?";
    await db.execute(query, [consultationsId]);
    db.release();

    return NextResponse.json({
      message: "consultations deleted successfully",
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
