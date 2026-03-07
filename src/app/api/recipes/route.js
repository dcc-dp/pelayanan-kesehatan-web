import { NextResponse } from "next/server";
import pool from "@/src/libs/mysql";

/**
 * @swagger
 * tags:
 *   name: Recipes
 *   description: API untuk mengelola data resep pasien dan dokter
 */

/**
 * @swagger
 * /api/recipes:
 *   get:
 *     summary: Mendapatkan semua data resep beserta informasi pasien dan dokter
 *     description: Mengambil seluruh data resep dari tabel `recipes` beserta relasi user (pasien) dan doctor.
 *     tags: [Recipes]
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
 *                     example: "ahmad@gmail.com"
 *                   tgl_lahir:
 *                     type: string
 *                     format: date
 *                     example: "1995-06-21"
 *                   alamat:
 *                     type: string
 *                     example: "Jl. Merpati No. 7"
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
 *                     example: "dr. Sinta"
 *                   deskripsi:
 *                     type: string
 *                     example: "Dokter umum dengan pengalaman 5 tahun"
 *                   lisensi:
 *                     type: string
 *                     example: "12345/MED/2022"
 *                   sertifikat:
 *                     type: string
 *                     example: "/certs/sinta.pdf"
 *       500:
 *         description: Terjadi kesalahan pada server
 *
 *   post:
 *     summary: Menambahkan data resep baru
 *     description: Menyimpan relasi baru antara pasien dan dokter ke tabel `recipes`.
 *     tags: [Recipes]
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
 *                 example: 3
 *               doctors_id:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: Resep berhasil ditambahkan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 12
 *       500:
 *         description: Terjadi kesalahan pada server
 *
 *   put:
 *     summary: Memperbarui data resep berdasarkan ID
 *     description: Mengupdate relasi pasien dan dokter dalam tabel `recipes`.
 *     tags: [Recipes]
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
 *                 example: 5
 *               users_id:
 *                 type: integer
 *                 example: 3
 *               doctors_id:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Data resep berhasil diperbarui
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "recipes updated successfully"
 *       500:
 *         description: Terjadi kesalahan pada server
 *
 *   delete:
 *     summary: Menghapus data resep berdasarkan ID
 *     description: Menghapus data dari tabel `recipes` berdasarkan ID.
 *     tags: [Recipes]
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
 *         description: Data resep berhasil dihapus
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "recipes deleted successfully"
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
    `;
    const [rows] = await db.execute(query);
    db.release();

    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const db = await pool.getConnection();
    const query = "INSERT INTO recipes(users_id, doctors_id) VALUES (?, ?)";
    const [result] = await db.execute(query, [data.users_id, data.doctors_id]);
    db.release();

    return NextResponse.json({ id: result.insertId }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const data = await request.json();
    const db = await pool.getConnection();
    const query =
      "UPDATE recipes SET users_id = ?, doctors_id = ? WHERE id = ?";
    await db.execute(query, [data.users_id, data.doctors_id, data.id]);
    db.release();

    return NextResponse.json({ message: "recipes updated successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const data = await request.json();
    const db = await pool.getConnection();
    const query = "DELETE FROM recipes WHERE id = ?";
    await db.execute(query, [data.id]);
    db.release();

    return NextResponse.json({ message: "recipes deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
