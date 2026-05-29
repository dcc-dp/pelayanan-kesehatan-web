import { NextResponse } from "next/server";
import pool from "@/src/libs/mysql";

/**
 * @swagger
 * tags:
 *   name: Details
 *   description: API untuk mengelola data detail resep obat
 */

/**
 * @swagger
 * /api/details:
 *   get:
 *     summary: Mendapatkan semua data detail resep obat
 *     description: Mengambil seluruh data dari tabel `details` beserta relasi ke `drugs`, `recipes`, dan `users`.
 *     tags: [Details]
 *     responses:
 *       200:
 *         description: Berhasil mengambil data detail resep
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 5
 *                   jumlah_minum:
 *                     type: integer
 *                     example: 2
 *                   jumlah_hari:
 *                     type: integer
 *                     example: 7
 *                   waktu_minum:
 *                     type: string
 *                     example: "after_eat"
 *                   nama_drug:
 *                     type: string
 *                     example: "Paracetamol"
 *                   jumlah:
 *                     type: integer
 *                     example: 14
 *                   nm_pasien:
 *                     type: string
 *                     example: "Budi Santoso"
 *                   nm_dokter:
 *                     type: string
 *                     example: "Dr. Siti Aminah"
 *       500:
 *         description: Kesalahan server
 */
export async function GET(request, { params }) {
  try {
    const recipes_id = params.id;
    const db = await pool.getConnection();
    const query = `
      SELECT 
        d.id,
        d.recipes_id,
        d.drugs_id,
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
      WHERE d.recipes_id = ?
    `;
    const [rows] = await db.execute(query, [recipes_id]);
    db.release();

    if (rows.length === 0) {
      return NextResponse.json(
        { message: "Tidak ada data detail untuk ID resep ini" },
        { status: 404 }
      );
    }

    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/details:
 *   post:
 *     summary: Menambahkan data detail resep obat
 *     description: Menyimpan data detail resep baru ke dalam tabel `details`.
 *     tags: [Details]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - recipes_id
 *               - drugs_id
 *               - jumlah
 *               - jumlah_minum
 *               - jumlah_hari
 *               - waktu_minum
 *             properties:
 *               recipes_id:
 *                 type: integer
 *                 example: 2
 *               drugs_id:
 *                 type: integer
 *                 example: 4
 *               jumlah:
 *                 type: integer
 *                 example: 10
 *               jumlah_minum:
 *                 type: integer
 *                 example: 2
 *               jumlah_hari:
 *                 type: integer
 *                 example: 5
 *               waktu_minum:
 *                 type: string
 *                 example: "before_eat"
 *     responses:
 *       201:
 *         description: Data berhasil ditambahkan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 12
 *       500:
 *         description: Kesalahan server
 */
export async function POST(request) {
  try {
    const data = await request.json();
    const db = await pool.getConnection();

    const query =
      "INSERT INTO details (recipes_id, drugs_id, jumlah_minum, jumlah_hari, waktu_minum) VALUES (?, ?, ?, ?, ?, ?)";
    const [result] = await db.execute(query, [
      data.recipes_id,
      data.drugs_id,
      data.jumlah_minum,
      data.jumlah_hari,
      data.waktu_minum,
    ]);
    db.release();

    return NextResponse.json({ id: result.insertId }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/details:
 *   put:
 *     summary: Memperbarui data detail resep obat
 *     description: Mengubah data pada tabel `details` berdasarkan ID.
 *     tags: [Details]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - recipes_id
 *               - drugs_id
 *               - jumlah
 *               - jumlah_minum
 *               - jumlah_hari
 *               - waktu_minum
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 5
 *               recipes_id:
 *                 type: integer
 *                 example: 2
 *               drugs_id:
 *                 type: integer
 *                 example: 4
 *               jumlah:
 *                 type: integer
 *                 example: 8
 *               jumlah_minum:
 *                 type: integer
 *                 example: 3
 *               jumlah_hari:
 *                 type: integer
 *                 example: 7
 *               waktu_minum:
 *                 type: string
 *                 example: "after_eat"
 *     responses:
 *       200:
 *         description: Data berhasil diperbarui
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: details updated successfully
 *       500:
 *         description: Kesalahan server
 */
export async function PUT(request) {
  try {
    const data = await request.json();
    const detailsId = data.id;
    const db = await pool.getConnection();

    const query =
      "UPDATE details SET recipes_id = ?, drugs_id = ?, jumlah_minum = ?, jumlah_hari = ?, waktu_minum = ? WHERE id = ?";
    await db.execute(query, [
      data.recipes_id,
      data.drugs_id,
      data.jumlah_minum,
      data.jumlah_hari,
      data.waktu_minum,
      detailsId,
    ]);
    db.release();

    return NextResponse.json({ message: "details updated successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/details:
 *   delete:
 *     summary: Menghapus data detail resep obat
 *     description: Menghapus data berdasarkan ID dari tabel `details`.
 *     tags: [Details]
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
 *                 example: 5
 *     responses:
 *       200:
 *         description: Data berhasil dihapus
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: details deleted successfully
 *       500:
 *         description: Kesalahan server
 */
export async function DELETE(request) {
  try {
    const db = await pool.getConnection();
    const data = await request.json();
    const detailsId = data.id;
    const query = "DELETE FROM details WHERE id = ?";
    await db.execute(query, [detailsId]);
    db.release();

    return NextResponse.json({ message: "details deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
