import { NextResponse } from "next/server";
import { prisma } from "@/src/libs/prisma";

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
 *                   users_id:
 *                     type: integer
 *                   category_spesialis_id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   specialis_name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   license:
 *                     type: string
 *                   certificate:
 *                     type: string
 *                   created_at:
 *                     type: string
 *                   updated_at:
 *                     type: string
 *       500:
 *         description: Terjadi kesalahan pada server
 */
export async function GET() {
  try {
<<<<<<< HEAD
    const data = await prisma.doctor.findMany({
      include: {
        users: true,
        category_spesialis: true,
      },
    });
=======
    const db = await pool.getConnection();

    const query = `
      SELECT 
        doctor.id,
        users.name,
        category_spesialis.specialis_name,
        doctor.description,
        doctor.license,
        doctor.certificate,
        doctor.created_at,
        doctor.updated_at
      FROM doctor
      INNER JOIN users ON doctor.users_id = users.id
      INNER JOIN category_spesialis ON doctor.category_spesialis_id = category_spesialis.id
    `;

    const [rows] = await db.execute(query);
    db.release();
>>>>>>> 3296d7c76983a4448baeb199edd0ba18bec61877

    // 🔁 samakan dengan output SQL lama
    const result = data.map((d) => ({
      id: d.id,
      users_id: d.users_id,
      category_spesialis_id: d.category_spesialis_id,
      name: d.users?.name,
      specialis_name: d.category_spesialis?.specialis_name,
      description: d.description,
      license: d.license,
      certificate: d.certificate,
      created_at: d.created_at,
      updated_at: d.updated_at,
    }));

    return NextResponse.json(result);
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
 *             required:
 *               - users_id
 *             properties:
 *               users_id:
 *                 type: integer
 *               category_spesialis_id:
 *                 type: integer
 *               description:
 *                 type: string
 *               license:
 *                 type: string
 *               certificate:
 *                 type: string
 *     responses:
 *       201:
 *         description: Dokter berhasil ditambahkan
 *       404:
 *         description: Relasi tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan pada server
 */
export async function POST(request) {
  try {
    const data = await request.json();

    // ✅ validasi FK users
    const user = await prisma.users.findUnique({
      where: { id: data.users_id },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User tidak ditemukan" },
        { status: 404 },
      );
    }

    // ✅ optional validasi kategori
    if (data.category_spesialis_id) {
      const category = await prisma.category_spesialis.findUnique({
        where: { id: data.category_spesialis_id },
      });

      if (!category) {
        return NextResponse.json(
          { error: "Category tidak ditemukan" },
          { status: 404 },
        );
      }
    }

    const newData = await prisma.doctor.create({
      data: {
        description: data.description,
        license: data.license,
        certificate: data.certificate,
        users: {
          connect: { id: data.users_id },
        },
        ...(data.category_spesialis_id && {
          category_spesialis: {
            connect: { id: data.category_spesialis_id },
          },
        }),
      },
    });

    return NextResponse.json({ id: newData.id }, { status: 201 });
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
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: integer
 *               category_spesialis_id:
 *                 type: integer
 *               description:
 *                 type: string
 *               license:
 *                 type: string
 *               certificate:
 *                 type: string
 *     responses:
 *       200:
 *         description: Data dokter berhasil diperbarui
 *       404:
 *         description: Data tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan pada server
 */
export async function PUT(request) {
  try {
    const data = await request.json();

    const updated = await prisma.doctor.updateMany({
      where: { id: data.id },
      data: {
        category_spesialis_id: data.category_spesialis_id,
        description: data.description,
        license: data.license,
        certificate: data.certificate,
      },
    });

    if (updated.count === 0) {
      return NextResponse.json(
        { error: "Data tidak ditemukan" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: "doctor updated successfully",
    });
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
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Data dokter berhasil dihapus
 *       404:
 *         description: Data tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan pada server
 */
export async function DELETE(request) {
  try {
    const data = await request.json();

    const deleted = await prisma.doctor.deleteMany({
      where: { id: data.id },
    });

    if (deleted.count === 0) {
      return NextResponse.json(
        { error: "Data tidak ditemukan" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: "doctor deleted successfully",
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
