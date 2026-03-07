import { NextResponse } from "next/server";
import pool from "../../../libs/mysql";

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API untuk mengelola data pengguna (users)
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Mendapatkan semua data pengguna
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Berhasil mengambil daftar pengguna
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
 *                   name:
 *                     type: string
 *                     example: "Ranti"
 *                   email:
 *                     type: string
 *                     example: "ranti@example.com"
 *                   password:
 *                     type: string
 *                     example: "hashed_password"
 *       500:
 *         description: Terjadi kesalahan pada server
 */
export async function GET() {
  try {
    const db = await pool.getConnection();
    const [rows] = await db.query("SELECT * FROM users");
    db.release();

    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Menambahkan pengguna baru
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Ranti"
 *               email:
 *                 type: string
 *                 example: "ranti@example.com"
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       201:
 *         description: Pengguna berhasil ditambahkan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 10
 *       500:
 *         description: Terjadi kesalahan saat menambahkan pengguna
 */
export async function POST(request) {
  try {
    const body = await request.json();

    const {
      name,
      gender,
      birth,
      address,
      whatsapp,
      password,
      email,
      image,
      role,
    } = body;

    const db = await pool.getConnection();
    const query = `
      INSERT INTO users (name, gender, birth, address, whatsapp, password, email, image, role)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.execute(query, [
      name,
      gender,
      birth,
      address,
      whatsapp,
      password,
      email,
      image,
      role,
    ]);

    db.release();

    return NextResponse.json({
      message: "User berhasil ditambahkan",
      id: result.insertId,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
/**
 * @swagger
 * /api/users:
 *   put:
 *     summary: Memperbarui data pengguna berdasarkan ID
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - name
 *               - email
 *               - password
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 1
 *               name:
 *                 type: string
 *                 example: "Ranti Updated"
 *               email:
 *                 type: string
 *                 example: "ranti_updated@example.com"
 *               password:
 *                 type: string
 *                 example: "newpassword123"
 *     responses:
 *       200:
 *         description: Pengguna berhasil diperbarui
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User updated successfully"
 *       500:
 *         description: Terjadi kesalahan saat memperbarui data pengguna
 */
export async function PUT(request) {
  try {
    const body = await request.json();

    const {
      id,
      name,
      gender,
      birth,
      address,
      whatsapp,
      password,
      email,
      image,
      role,
    } = body;

    const db = await pool.getConnection();

    const query = `
      UPDATE users
      SET name=?, gender=?, birth=?, address=?, whatsapp=?, password=?, email=?, image=?, role=?
      WHERE id=?
    `;

    const [result] = await db.execute(query, [
      name,
      gender,
      birth,
      address,
      whatsapp,
      password,
      email,
      image,
      role,
      id,
    ]);

    db.release();

    return NextResponse.json({
      message: "User updated successfully",
      affectedRows: result.affectedRows,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
/**
 * @swagger
 * /api/users:
 *   delete:
 *     summary: Menghapus data pengguna berdasarkan ID
 *     tags: [Users]
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
 *         description: Pengguna berhasil dihapus
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User deleted successfully"
 *       500:
 *         description: Terjadi kesalahan saat menghapus pengguna
 */
export async function DELETE(request) {
  try {
    const body = await request.json();
    const { id } = body;

    const db = await pool.getConnection();
    const [result] = await db.execute("DELETE FROM users WHERE id = ?", [id]);
    db.release();

    return NextResponse.json({
      message: "User deleted successfully",
      affectedRows: result.affectedRows,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
