import { NextResponse } from "next/server";
import pool from "@/src/libs/mysql";

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Mendapatkan semua user
 *     description: Endpoint ini mengembalikan daftar semua user dari database.
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan daftar user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   gender:
 *                     type: string
 *                   birth:
 *                     type: string
 *                   address:
 *                     type: string
 *                   whatsapp:
 *                     type: string
 *                   email:
 *                     type: string
 *                   image:
 *                     type: string
 */
export async function GET() {
  try {
    const db = await pool.getConnection();
    const query = "SELECT * FROM users";
    const [rows] = await db.execute(query);
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
 *     summary: Menambahkan user baru
 *     description: Endpoint ini digunakan untuk menambahkan data user baru ke dalam database.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - gender
 *               - birth
 *               - address
 *               - whatsapp
 *               - password
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *                 example: Syah
 *               gender:
 *                 type: string
 *                 example: Perempuan
 *               birth:
 *                 type: string
 *                 example: 2002-05-12
 *               address:
 *                 type: string
 *                 example: Jl. Melati No. 45, Makassar
 *               whatsapp:
 *                 type: string
 *                 example: 08123456789
 *               password:
 *                 type: string
 *                 example: rahasia123
 *               email:
 *                 type: string
 *                 example: syah@example.com
 *               image:
 *                 type: string
 *                 example: https://example.com/avatar.jpg
 *     responses:
 *       201:
 *         description: User berhasil ditambahkan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *       500:
 *         description: Terjadi kesalahan pada server
 */
export async function POST(request) {
  try {
    const data = await request.json();
    const db = await pool.getConnection();

    const query = `
      INSERT INTO users (name, gender, birth, address, whatsapp, password, email, image)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.execute(query, [
      data.name,
      data.gender,
      data.birth,
      data.address,
      data.whatsapp,
      data.password,
      data.email,
      data.image ?? null,
    ]);
    db.release();

    return NextResponse.json({ id: result.insertId }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/users:
 *   put:
 *     summary: Memperbarui data user
 *     description: Endpoint ini digunakan untuk memperbarui data user berdasarkan ID.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - name
 *               - gender
 *               - birth
 *               - address
 *               - whatsapp
 *               - password
 *               - email
 *             properties:
 *               id:
 *                 type: integer
 *                 description: ID user yang ingin diperbarui
 *                 example: 1
 *               name:
 *                 type: string
 *                 example: Syah Updated
 *               gender:
 *                 type: string
 *                 example: Perempuan
 *               birth:
 *                 type: string
 *                 example: 2002-05-12
 *               address:
 *                 type: string
 *                 example: Jl. Kenanga No. 23, Makassar
 *               whatsapp:
 *                 type: string
 *                 example: 08123456789
 *               password:
 *                 type: string
 *                 example: rahasiaBaru123
 *               email:
 *                 type: string
 *                 example: syah.updated@example.com
 *               image:
 *                 type: string
 *                 example: https://example.com/new-avatar.jpg
 *     responses:
 *       200:
 *         description: User berhasil diperbarui
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User updated successfully
 *       404:
 *         description: User tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan di server
 */
export async function PUT(request) {
  try {
    const data = await request.json();
    const db = await pool.getConnection();

    const query = `
      UPDATE users
      SET name = ?, gender = ?, birth = ?, address = ?, whatsapp = ?, password = ?, email = ?, image = ?
      WHERE id = ?
    `;
    const [result] = await db.execute(query, [
      data.name,
      data.gender,
      data.birth,
      data.address,
      data.whatsapp,
      data.password,
      data.email,
      data.image ?? null,
      data.id,
    ]);
    db.release();

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "User updated successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/users:
 *   delete:
 *     summary: Menghapus user
 *     description: Endpoint ini digunakan untuk menghapus user berdasarkan ID.
 *     tags:
 *       - Users
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
 *                 description: ID user yang ingin dihapus
 *                 example: 1
 *     responses:
 *       200:
 *         description: User berhasil dihapus
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User deleted successfully
 *       404:
 *         description: User tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan di server
 */
export async function DELETE(request) {
  try {
    const data = await request.json();
    const db = await pool.getConnection();

    const [result] = await db.execute("DELETE FROM users WHERE id = ?", [
      data.id,
    ]);
    db.release();

    if (result.affectedRows === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
