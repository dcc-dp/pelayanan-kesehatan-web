import { NextResponse } from "next/server";
import pool from "@/src/libs/mysql";

/**
 * @swagger
 * tags:
 *   - name: Category Spesialis
 *     description: API untuk mengelola data kategori spesialis dokter
 */

/**
 * @swagger
 * /api/category_spesialis:
 *   get:
 *     summary: Mendapatkan semua kategori spesialis
 *     description: Mengambil seluruh data kategori spesialis dari database.
 *     tags: [Category Spesialis]
 *     responses:
 *       200:
 *         description: Data kategori spesialis berhasil diambil
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
 *                   specialis_name:
 *                     type: string
 *                     example: "Psikologi"
 *                   description:
 *                     type: string
 *                     example: "Spesialis kesehatan mental dan perilaku"
 *       500:
 *         description: Terjadi kesalahan pada server
 */

export async function GET() {
  try {
    const db = await pool.getConnection();
    const query = "select * from category_spesialis";
    const [rows] = await db.execute(query);
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

/**
 * @swagger
 * /api/category_spesialis:
 *   post:
 *     summary: Menambahkan kategori spesialis baru
 *     description: Menyimpan data kategori spesialis baru ke dalam database.
 *     tags: [Category Spesialis]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - specialis_name
 *               - description
 *             properties:
 *               specialis_name:
 *                 type: string
 *                 example: "Pediatri"
 *               description:
 *                 type: string
 *                 example: "Spesialis anak dan tumbuh kembang"
 *     responses:
 *       201:
 *         description: Kategori spesialis berhasil ditambahkan
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
      "INSERT INTO  category_spesialis(specialis_name, description) VALUES (?, ?)";
    const [result] = await db.execute(query, [
      data.specialis_name,
      data.description,
    ]);
    db.release();

    return NextResponse.json({ id: result.insertId }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/category_spesialis:
 *   put:
 *     summary: Memperbarui data kategori spesialis
 *     description: Mengubah data kategori spesialis berdasarkan ID.
 *     tags: [Category Spesialis]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - specialis_name
 *               - description
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 3
 *               specialis_name:
 *                 type: string
 *                 example: "Kardiologi"
 *               description:
 *                 type: string
 *                 example: "Spesialis penyakit jantung dan pembuluh darah"
 *     responses:
 *       200:
 *         description: Data kategori spesialis berhasil diperbarui
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "category_spesialis updated successfully"
 *       404:
 *         description: Data tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan pada server
 */


export async function PUT(request) {
  try {
    const data = await request.json();
    const category_spesialisId = data.id; // user id from the request parameters
    const db = await pool.getConnection();

    const query =
      "UPDATE category_spesialis SET specialis_name = ?, description = ? WHERE id = ?";
    await db.execute(query, [
      data.specialis_name,
      data.description,
      category_spesialisId,
    ]);
    db.release();

    return NextResponse.json({
      message: "category_spesialis updated successfully",
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/category_spesialis:
 *   delete:
 *     summary: Menghapus data kategori spesialis
 *     description: Menghapus data kategori spesialis berdasarkan ID.
 *     tags: [Category Spesialis]
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
 *         description: Data kategori spesialis berhasil dihapus
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "category_spesialis deleted successfully"
 *       404:
 *         description: Data tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan pada server
 */

export async function DELETE(request) {
  try {
    const db = await pool.getConnection();
    const data = await request.json();
    const category_spesialisId = data.id; // user id from the request parameters
    const query = "DELETE FROM category_spesialis WHERE id = ?";
    await db.execute(query, [category_spesialisId]);
    db.release();

    return NextResponse.json({
      message: "category_spesialis deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error.message,
      },
      { status: 500 }
    );
  }
}
