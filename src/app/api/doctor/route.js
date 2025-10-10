import { NextResponse } from "next/server";
import pool from "@/src/libs/mysql";

/**
 * @swagger
 * tags:
 *   name: Doctor
 *   description: API untuk mengelola data dokter
 */

/**
 * @swagger
 * /api/doctor:
 *   get:
 *     summary: Mendapatkan daftar semua dokter
 *     tags: [Doctor]
 *     responses:
 *       200:
 *         description: Daftar semua dokter berhasil diambil
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
 *                   users_id:
 *                     type: integer
 *                     example: 2
 *                   category_spesialis_id:
 *                     type: integer
 *                     example: 3
 *                   description:
 *                     type: string
 *                     example: "Dokter spesialis jantung dengan pengalaman 10 tahun"
 *                   license:
 *                     type: string
 *                     example: "DOK1234567"
 *                   certificate:
 *                     type: string
 *                     example: "sertifikat_jantung.pdf"
 *                   role:
 *                     type: string
 *                     example: "doctor"
 *       500:
 *         description: Terjadi kesalahan pada server
 */
export async function GET() {
  try {
    const db = await pool.getConnection();
    const query = "SELECT * FROM doctor";
    const [rows] = await db.execute(query);
    db.release();

    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/doctor:
 *   post:
 *     summary: Menambahkan data dokter baru
 *     tags: [Doctor]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               users_id:
 *                 type: integer
 *                 example: 5
 *               category_spesialis_id:
 *                 type: integer
 *                 example: 2
 *               description:
 *                 type: string
 *                 example: "Spesialis kulit dan kelamin"
 *               license:
 *                 type: string
 *                 example: "DOK987654"
 *               certificate:
 *                 type: string
 *                 example: "certificate.pdf"
 *     responses:
 *       201:
 *         description: Dokter berhasil ditambahkan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 10
 *       500:
 *         description: Terjadi kesalahan pada server
 */
export async function POST(request) {
  try {
    const data = await request.json();
    const db = await pool.getConnection();

    const query = `
      INSERT INTO doctor (users_id, category_spesialis_id, description, license, certificate)
      VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await db.execute(query, [
      data.users_id,
      data.category_spesialis_id,
      data.description,
      data.license,
      data.certificate,
    ]);
    db.release();

    return NextResponse.json({ id: result.insertId }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/doctor:
 *   put:
 *     summary: Memperbarui data dokter
 *     tags: [Doctor]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 3
 *               category_spesialis_id:
 *                 type: integer
 *                 example: 5
 *               description:
 *                 type: string
 *                 example: "Dokter gigi dengan pengalaman internasional"
 *               license:
 *                 type: string
 *                 example: "DOK654321"
 *               certificate:
 *                 type: string
 *                 example: "new_certificate.pdf"
 *     responses:
 *       200:
 *         description: Data dokter berhasil diperbarui
 *       500:
 *         description: Terjadi kesalahan pada server
 */
export async function PUT(request) {
  try {
    const data = await request.json();
    const doctorId = data.id;
    const db = await pool.getConnection();

    const query = `
      UPDATE doctor
      SET category_spesialis_id = ?, description = ?, license = ?, certificate = ?
      WHERE id = ?
    `;
    await db.execute(query, [
      data.category_spesialis_id,
      data.description,
      data.license,
      data.certificate,
      doctorId,
    ]);
    db.release();

    return NextResponse.json({ message: "doctor updated successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/doctor:
 *   delete:
 *     summary: Menghapus data dokter berdasarkan ID
 *     tags: [Doctor]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       200:
 *         description: Data dokter berhasil dihapus
 *       500:
 *         description: Terjadi kesalahan pada server
 */
export async function DELETE(request) {
  try {
    const db = await pool.getConnection();
    const data = await request.json();
    const doctorId = data.id;
    const query = "DELETE FROM doctor WHERE id = ?";
    await db.execute(query, [doctorId]);
    db.release();

    return NextResponse.json({ message: "doctor deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
