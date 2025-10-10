import { NextResponse } from "next/server";
import pool from "@/src/libs/mysql";

/**
 * @swagger
 * tags:
 *   name: Bookings
 *   description: API untuk mengelola data pemesanan obat (bookings)
 */

/**
 * @swagger
 * /api/bookings:
 *   get:
 *     summary: Mendapatkan daftar data pemesanan (bookings)
 *     description: Mengambil data pemesanan yang berisi informasi pembeli, dokter, dan total biaya dari tabel **bookings** beserta relasi ke tabel **recipes**, **users**, dan **doctor**.
 *     tags: [Bookings]
 *     responses:
 *       200:
 *         description: Data bookings berhasil diambil.
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
 *                     description: Nama pasien/pembeli resep.
 *                   nm_dokter:
 *                     type: string
 *                     example: "Dr. Sarah Amelia"
 *                     description: Nama dokter yang menangani pasien.
 *                   total:
 *                     type: number
 *                     example: 250000
 *                     description: Total harga resep yang dipesan.
 *       500:
 *         description: Terjadi kesalahan pada server.
 */

export async function GET() {
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
      INNER JOIN users dokter ON dr.users_id = dokter.id;
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
 * /api/bookings:
 *   post:
 *     summary: Membuat data booking baru berdasarkan resep (recipes_id)
 *     description: |
 *       Endpoint ini akan menghitung total secara otomatis dari tabel `details`
 *       berdasarkan `recipes_id` yang dikirim. Nilai total dihitung dari hasil
 *       penjumlahan `(jumlah obat * harga obat)` untuk semua detail resep terkait.
 *     tags:
 *       - Bookings
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - recipes_id
 *             properties:
 *               recipes_id:
 *                 type: integer
 *                 description: ID resep yang akan dihitung totalnya
 *                 example: 3
 *     responses:
 *       201:
 *         description: Data booking berhasil dibuat
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID booking yang baru dibuat
 *                   example: 15
 *                 total:
 *                   type: number
 *                   description: Total hasil perhitungan dari tabel details
 *                   example: 24
 *       500:
 *         description: Terjadi kesalahan di server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Database connection failed
 */
export async function POST(request) {
  try {
    const data = await request.json();
    const db = await pool.getConnection();

    const totalQuery = `
      SELECT sum(drugs.price * details.jumlah) AS total
      FROM details
      INNER JOIN drugs on details.drugs_id = drugs.id
      WHERE details.recipes_id = ?
    `;
    const [rows] = await db.execute(totalQuery, [data.recipes_id]);
    const total = rows[0]?.total || 0;

    const insertQuery = `
      INSERT INTO bookings (recipes_id, total)
      VALUES (?, ?)
    `;
    const [result] = await db.execute(insertQuery, [data.recipes_id, total]);
    db.release();

    return NextResponse.json(
      { id: result.insertId, total },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/bookings:
 *   put:
 *     summary: Memperbarui data booking dan menghitung ulang total otomatis
 *     description: |
 *       Endpoint ini digunakan untuk memperbarui data booking berdasarkan ID.
 *       Total akan **dihitung ulang otomatis** dari tabel `details` berdasarkan `recipes_id`
 *       (hasil dari `SUM(jumlah oat * harga obat)`).
 *     tags:
 *       - Bookings
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - recipes_id
 *             properties:
 *               id:
 *                 type: integer
 *                 description: ID booking yang akan diperbarui
 *                 example: 10
 *               recipes_id:
 *                 type: integer
 *                 description: ID resep yang akan dihitung totalnya
 *                 example: 3
 *     responses:
 *       200:
 *         description: Data booking berhasil diperbarui
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: bookings updated successfully
 *                 total:
 *                   type: number
 *                   example: 24
 *       404:
 *         description: Data booking tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Booking not found
 *       500:
 *         description: Terjadi kesalahan server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Database error
 */
export async function PUT(request) {
  try {
    const data = await request.json();
    const bookingsId = data.id;
    const db = await pool.getConnection();

    const totalQuery = `
      SELECT sum(drugs.price * details.jumlah) AS total
      FROM details
      INNER JOIN drugs on details.drugs_id = drugs.id
      WHERE details.recipes_id = ?
    `;
    const [rows] = await db.execute(totalQuery, [data.recipes_id]);
    const total = rows[0]?.total || 0;

    const query = `
      UPDATE bookings 
      SET recipes_id = ?, total = ? 
      WHERE id = ?
    `;
    const [result] = await db.execute(query, [data.recipes_id, total, bookingsId]);
    db.release();

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "bookings updated successfully",
      total,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


/**
 * @swagger
 * /api/bookings:
 *   delete:
 *     summary: Hapus data booking berdasarkan ID
 *     tags: [Bookings]
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
 *                 example: 8
 *     responses:
 *       200:
 *         description: Data booking berhasil dihapus.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: bookings deleted successfully
 *       500:
 *         description: Terjadi kesalahan pada server.
 */
export async function DELETE(request) {
  try {
    const db = await pool.getConnection();
    const data = await request.json();
    const bookingsId = data.id;
    const query = "DELETE FROM bookings WHERE id = ?";
    await db.execute(query, [bookingsId]);
    db.release();

    return NextResponse.json({ message: "bookings deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
