/**
 * @swagger
 * tags:
 *   name: Drugs
 *   description: API untuk mengelola data obat
 */

/**
 * @swagger
 * /api/drugs:
 *   get:
 *     summary: Mendapatkan semua data obat
 *     tags: [Drugs]
 *     responses:
 *       200:
 *         description: Berhasil mengambil daftar obat
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
 *                     example: "Paracetamol"
 *                   type:
 *                     type: string
 *                     example: "Tablet"
 *                   price:
 *                     type: number
 *                     example: 5000
 *       500:
 *         description: Terjadi kesalahan server
 */

/**
 * @swagger
 * /api/drugs:
 *   post:
 *     summary: Menambahkan data obat baru
 *     tags: [Drugs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - type
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Amoxicillin"
 *               type:
 *                 type: string
 *                 example: "Kapsul"
 *               price:
 *                 type: number
 *                 example: 15000
 *     responses:
 *       201:
 *         description: Data obat berhasil ditambahkan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 10
 *       400:
 *         description: Permintaan tidak valid
 *       500:
 *         description: Terjadi kesalahan server
 */

/**
 * @swagger
 * /api/drugs:
 *   put:
 *     summary: Memperbarui data obat berdasarkan ID
 *     tags: [Drugs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - name
 *               - type
 *               - price
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 3
 *               name:
 *                 type: string
 *                 example: "Ibuprofen"
 *               type:
 *                 type: string
 *                 example: "Tablet"
 *               price:
 *                 type: number
 *                 example: 12000
 *     responses:
 *       200:
 *         description: Data obat berhasil diperbarui
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: drugs updated successfully
 *       404:
 *         description: Data obat tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan server
 */

/**
 * @swagger
 * /api/drugs:
 *   delete:
 *     summary: Menghapus data obat berdasarkan ID
 *     tags: [Drugs]
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
 *                 example: 4
 *     responses:
 *       200:
 *         description: Data obat berhasil dihapus
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: drugs deleted successfully
 *       404:
 *         description: Data obat tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan server
 */

import { NextResponse } from "next/server";
import pool from "@/src/libs/mysql";

/**
 * @swagger
 * /api/drugs:
 *   get:
 *     summary: Mendapatkan daftar semua obat
 *     description: Endpoint ini mengembalikan seluruh data obat yang tersimpan dalam database.
 *     tags:
 *       - Drugs
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan daftar obat
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
 *                     example: Paracetamol
 *                   type:
 *                     type: string
 *                     example: Tablet
 *                   price:
 *                     type: number
 *                     example: 5000
 *       500:
 *         description: Terjadi kesalahan di server
 */

export async function GET() {
  try {
    const db = await pool.getConnection();
    const query = "SELECT * FROM drugs";
    const [rows] = await db.execute(query);
    db.release();

    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/drugs:
 *   post:
 *     summary: Menambahkan obat baru
 *     description: Endpoint ini digunakan untuk menambahkan data obat baru ke dalam database.
 *     tags:
 *       - Drugs
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - type
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *                 example: Amoxicillin
 *               type:
 *                 type: string
 *                 example: Kapsul
 *               price:
 *                 type: number
 *                 example: 8000
 *     responses:
 *       201:
 *         description: Obat berhasil ditambahkan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 5
 *       400:
 *         description: Data tidak valid
 *       500:
 *         description: Terjadi kesalahan di server
 */

export async function POST(request) {
  try {
    const data = await request.json();
    const db = await pool.getConnection();

    const query = "INSERT INTO drugs (name, type, price) VALUES (?, ?, ?)";
    const [result] = await db.execute(query, [
      data.name,
      data.type,
      data.price,
    ]);
    db.release();

    return NextResponse.json({ id: result.insertId }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/drugs:
 *   put:
 *     summary: Memperbarui data obat
 *     description: Endpoint ini digunakan untuk memperbarui informasi obat berdasarkan ID.
 *     tags:
 *       - Drugs
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - name
 *               - type
 *               - price
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 3
 *               name:
 *                 type: string
 *                 example: Ibuprofen
 *               type:
 *                 type: string
 *                 example: Tablet
 *               price:
 *                 type: number
 *                 example: 10000
 *     responses:
 *       200:
 *         description: Data obat berhasil diperbarui
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: drugs updated successfully
 *       404:
 *         description: Obat tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan di server
 */

export async function PUT(request) {
  try {
    const data = await request.json();
    const drugsId = data.id;
    const db = await pool.getConnection();

    const query = "UPDATE drugs SET name = ?, type = ?, price = ? WHERE id = ?";
    await db.execute(query, [data.name, data.type, data.price, drugsId]);
    db.release();

    return NextResponse.json({ message: "drugs updated successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/drugs:
 *   delete:
 *     summary: Menghapus data obat
 *     description: Endpoint ini digunakan untuk menghapus obat berdasarkan ID.
 *     tags:
 *       - Drugs
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
 *                 example: 4
 *     responses:
 *       200:
 *         description: Obat berhasil dihapus
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: drugs deleted successfully
 *       404:
 *         description: Obat tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan di server
 */

export async function DELETE(request) {
  try {
    const db = await pool.getConnection();
    const data = await request.json();
    const drugsId = data.id;

    const query = "DELETE FROM drugs WHERE id = ?";
    await db.execute(query, [drugsId]);
    db.release();

    return NextResponse.json({ message: "drugs deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
