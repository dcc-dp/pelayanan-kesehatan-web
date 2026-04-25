import { NextResponse } from "next/server";
import { prisma } from "@/src/libs/prisma";

/**
 * @swagger
 * tags:
 *   name: Schedules
 *   description: API untuk mengelola jadwal konsultasi antara pasien dan dokter
 */

/**
 * @swagger
 * /api/schedules:
 *   get:
 *     summary: Menampilkan semua data jadwal konsultasi
 *     description: Mengambil seluruh data jadwal konsultasi beserta informasi pasien dan dokter.
 *     tags: [Schedules]
 *     responses:
 *       200:
 *         description: Berhasil mengambil data jadwal
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   date:
 *                     type: string
 *                     format: date
 *                   time:
 *                     type: string
 *                   status:
 *                     type: string
 *                   nama_pasien:
 *                     type: string
 *                   nama_dokter:
 *                     type: string
 *       500:
 *         description: Terjadi kesalahan server
 */
export async function GET() {
  try {
    const data = await prisma.schedules.findMany({
      include: {
        users: true,
        doctor: {
          include: {
            users: true,
          },
        },
      },
    });

    const result = data.map((item) => ({
      id: item.id,
      date: item.date,
      time: item.time,
      status: item.status,
      nama_pasien: item.user?.name,
      nama_dokter: item.doctor?.user?.name,
    }));

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/schedules:
 *   post:
 *     summary: Menambahkan jadwal konsultasi baru
 *     description: Menyimpan jadwal konsultasi baru antara pasien dan dokter.
 *     tags: [Schedules]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - users_id
 *               - doctors_id
 *               - date
 *               - time
 *               - status
 *             properties:
 *               users_id:
 *                 type: integer
 *               doctors_id:
 *                 type: integer
 *               date:
 *                 type: string
 *                 format: date
 *               time:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       201:
 *         description: Jadwal berhasil ditambahkan
 *       400:
 *         description: Data tidak valid / foreign key tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan server
 */
export async function POST(request) {
  try {
    const data = await request.json();

    const newData = await prisma.schedules.create({
      data: {
        users_id: data.users_id,
        doctors_id: data.doctors_id,
        date: data.date,
        time: data.time,
        status: data.status,
      },
    });

    return NextResponse.json({ id: newData.id }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

/**
 * @swagger
 * /api/schedules:
 *   put:
 *     summary: Memperbarui jadwal konsultasi
 *     description: Mengupdate jadwal konsultasi berdasarkan ID dengan data terbaru.
 *     tags: [Schedules]
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
 *               - date
 *               - time
 *               - status
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 5
 *               users_id:
 *                 type: integer
 *                 example: 2
 *               doctors_id:
 *                 type: integer
 *                 example: 4
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2026-04-25"
 *                 description: Format tanggal (YYYY-MM-DD)
 *               time:
 *                 type: string
 *                 example: "10:30:00"
 *                 description: Format waktu (HH:mm:ss)
 *               status:
 *                 type: string
 *                 enum: [proses, tolak, terima]
 *                 example: "proses"
 *     responses:
 *       200:
 *         description: Jadwal berhasil diperbarui
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "schedules updated successfully"
 *                 data:
 *                   type: object
 *       400:
 *         description: Data tidak lengkap / tidak valid
 *       404:
 *         description: Data tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan server
 */
export async function PUT(request) {
  try {
    const data = await request.json();

    // validasi sederhana
    if (!data.id) {
      return NextResponse.json({ error: "ID wajib diisi" }, { status: 400 });
    }

    const updated = await prisma.schedules.update({
      where: { id: data.id },
      data: {
        users_id: data.users_id,
        doctors_id: data.doctors_id,
        date: new Date(data.date), // ✅ FIX
        time: new Date(`1970-01-01T${data.time}`), // ✅ FIX
        status: data.status,
      },
    });

    return NextResponse.json({
      message: "schedules updated successfully",
      data: updated,
    });
  } catch (error) {
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Data tidak ditemukan" },
        { status: 404 },
      );
    }

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/schedules:
 *   delete:
 *     summary: Menghapus jadwal konsultasi
 *     description: Menghapus data jadwal berdasarkan ID.
 *     tags: [Schedules]
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
 *         description: Jadwal berhasil dihapus
 *       404:
 *         description: Data tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan server
 */
export async function DELETE(request) {
  try {
    const data = await request.json();

    await prisma.schedules.delete({
      where: { id: data.id },
    });

    return NextResponse.json({
      message: "schedules deleted successfully",
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
