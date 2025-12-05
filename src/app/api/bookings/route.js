import { NextResponse } from "next/server";
import pool from "../../../libs/mysql";

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
 *     description: |
 *       Mengambil data bookings lengkap yang berisi:
 *       - Informasi pasien (pembeli)
 *       - Informasi dokter
 *       - Detail obat
 *       - Total biaya
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
 *                   obat:
 *                     type: string
 *                     example: "Paracetamol"
 *                   harga:
 *                     type: number
 *                     example: 15000
 *                   jumlah_minum:
 *                     type: number
 *                     example: 3
 *                   jumlah_hari:
 *                     type: number
 *                     example: 5
 *                   waktu_minum:
 *                     type: string
 *                     example: "Pagi, Siang, Malam"
 *                   nm_pembeli:
 *                     type: string
 *                     example: "John Doe"
 *                   nm_dokter:
 *                     type: string
 *                     example: "Dr. Amelia"
 *                   total:
 *                     type: number
 *                     example: 75000
 *       500:
 *         description: Terjadi kesalahan pada server.
 */
export async function GET() {
  try {
    const db = await pool.getConnection();

    const query = `
      SELECT 
        d.name AS obat, 
        d.price AS harga,
        dt.jumlah_minum, 
        dt.jumlah_hari, 
        dt.waktu_minum,
        pembeli.name AS nm_pembeli,
        dokter.name AS nm_dokter,
        b.total
      FROM bookings b
      INNER JOIN recipes r ON b.recipes_id = r.id
      INNER JOIN details dt ON dt.recipes_id = r.id
      INNER JOIN drugs d ON dt.drugs_id = d.id
      INNER JOIN users pembeli ON r.users_id = pembeli.id
      INNER JOIN doctor dr ON r.doctors_id = dr.id
      INNER JOIN users dokter ON dr.users_id = dokter.id
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
 *     summary: Membuat data booking baru berdasarkan recipes_id
 *     description: |
 *       Total dihitung otomatis dari tabel `details`:
 *       - total = jumlah * harga obat
 *     tags: [Bookings]
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
 *                 example: 3
 *     responses:
 *       201:
 *         description: Booking berhasil dibuat.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: number
 *                 total:
 *                   type: number
 *       500:
 *         description: Terjadi kesalahan server.
 */
export async function POST(request) {
  try {
    const data = await request.json();
    const db = await pool.getConnection();

    const totalQuery = `
      SELECT SUM(drugs.price * details.jumlah) AS total
      FROM details
      INNER JOIN drugs ON details.drugs_id = drugs.id
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

    return NextResponse.json({ id: result.insertId, total }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/bookings:
 *   put:
 *     summary: Memperbarui booking & menghitung ulang total
 *     description: |
 *       Total dihitung ulang otomatis dari tabel details.
 *     tags: [Bookings]
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
 *                 example: 10
 *               recipes_id:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       200:
 *         description: Data booking berhasil diperbarui.
 *       404:
 *         description: Booking tidak ditemukan.
 *       500:
 *         description: Kesalahan server.
 */
export async function PUT(request) {
  try {
    const data = await request.json();
    const db = await pool.getConnection();

    const totalQuery = `
      SELECT SUM(drugs.price * details.jumlah) AS total
      FROM details
      INNER JOIN drugs ON details.drugs_id = drugs.id
      WHERE details.recipes_id = ?
    `;
    const [rows] = await db.execute(totalQuery, [data.recipes_id]);
    const total = rows[0]?.total || 0;

    const query = `
      UPDATE bookings 
      SET recipes_id = ?, total = ?
      WHERE id = ?
    `;
    const [result] = await db.execute(query, [data.recipes_id, total, data.id]);

    db.release();

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
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
 *     summary: Menghapus booking berdasarkan ID
 *     tags: [Bookings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 7
 *     responses:
 *       200:
 *         description: Booking berhasil dihapus.
 *       500:
 *         description: Kesalahan server.
 */
export async function DELETE(request) {
  try {
    const data = await request.json();
    const db = await pool.getConnection();

    const query = "DELETE FROM bookings WHERE id = ?";
    await db.execute(query, [data.id]);

    db.release();

    return NextResponse.json({ message: "bookings deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
