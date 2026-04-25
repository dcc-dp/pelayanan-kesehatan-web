import { NextResponse } from "next/server";
import { prisma } from "@/src/libs/prisma";

/**
 * @swagger
 * tags:
 *   - name: Consultations
 *     description: API untuk mengelola data konsultasi antara pasien dan dokter
 */

/**
 * @swagger
 * /api/consultations:
 *   get:
 *     summary: Mendapatkan semua data konsultasi
 *     description: Mengambil seluruh data konsultasi, termasuk informasi pasien dan dokter terkait.
 *     tags: [Consultations]
 *     responses:
 *       200:
 *         description: Data konsultasi berhasil diambil
 *       500:
 *         description: Terjadi kesalahan pada server
 */
export async function GET() {
  try {
    const data = await prisma.consultations.findMany({
      include: {
        users: true, // pasien
        doctor: {
          include: {
            users: true, // user dokter
          },
        },
      },
    });

    // 🔁 format ulang seperti hasil SQL kamu
    const result = data.map((c) => ({
      id: c.id,
      pasien: c.users.name,
      gender: c.users.gender,
      email: c.users.email,
      tgl_lahir: c.users.birth,
      alamat: c.users.address,
      nomor_wa: c.users.whatsapp,
      foto: c.users.image,
      role: c.users.role,
      dokter: c.doctor.users.name,
      deskripsi: c.doctor.description,
      lisensi: c.doctor.license,
      sertifikat: c.doctor.certificate,
      created_at: c.created_at,
      updated_at: c.updated_at,
    }));

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/consultations:
 *   post:
 *     summary: Menambahkan data konsultasi baru
 *     description: Menyimpan data konsultasi baru antara pasien dan dokter ke dalam database.
 *     tags: [Consultations]
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
 *                 example: 1
 *               doctors_id:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: Konsultasi berhasil ditambahkan
 *       400:
 *         description: Permintaan tidak valid
 *       500:
 *         description: Terjadi kesalahan pada server
 */
export async function POST(request) {
  try {
    const data = await request.json();

    if (!data.users_id || !data.doctors_id) {
      return NextResponse.json(
        { error: "users_id dan doctors_id wajib diisi" },
        { status: 400 },
      );
    }

    const newData = await prisma.consultations.create({
      data: {
        users: {
          connect: { id: data.users_id },
        },
        doctor: {
          connect: { id: data.doctors_id },
        },
      },
    });

    return NextResponse.json({ id: newData.id }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/consultations:
 *   put:
 *     summary: Memperbarui data konsultasi
 *     description: Mengubah data konsultasi berdasarkan ID.
 *     tags: [Consultations]
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
 *                 example: 3
 *               users_id:
 *                 type: integer
 *                 example: 1
 *               doctors_id:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Data konsultasi berhasil diperbarui
 *       404:
 *         description: Data tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan pada server
 */
export async function PUT(request) {
  try {
    const data = await request.json();

    if (!data.id || !data.users_id || !data.doctors_id) {
      return NextResponse.json(
        { error: "id, users_id, dan doctors_id wajib diisi" },
        { status: 400 },
      );
    }

    const updated = await prisma.consultations.updateMany({
      where: { id: data.id },
      data: {
        users_id: data.users_id,
        doctors_id: data.doctors_id,
      },
    });

    if (updated.count === 0) {
      return NextResponse.json(
        { error: "Data tidak ditemukan" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: "consultations updated successfully",
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/consultations:
 *   delete:
 *     summary: Menghapus data konsultasi
 *     description: Menghapus data konsultasi berdasarkan ID.
 *     tags: [Consultations]
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
 *         description: Data konsultasi berhasil dihapus
 *       404:
 *         description: Data tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan pada server
 */
export async function DELETE(request) {
  try {
    const data = await request.json();

    if (!data.id) {
      return NextResponse.json({ error: "id wajib diisi" }, { status: 400 });
    }

    const deleted = await prisma.consultations.deleteMany({
      where: { id: data.id },
    });

    if (deleted.count === 0) {
      return NextResponse.json(
        { error: "Data tidak ditemukan" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: "consultations deleted successfully",
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
