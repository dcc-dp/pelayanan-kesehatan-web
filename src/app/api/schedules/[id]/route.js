import { NextResponse } from "next/server";
import { prisma } from "@/src/libs/prisma";

/**
 * @swagger
 * tags:
 *   name: Schedules
 *   description: API untuk mengelola data jadwal konsultasi pasien dan dokter
 */

/**
 * @swagger
 * /api/schedules/{id}:
 *   get:
 *     summary: Mendapatkan detail jadwal konsultasi berdasarkan ID
 *     description: Mengambil satu data jadwal konsultasi beserta informasi pasien dan dokter berdasarkan ID.
 *     tags: [Schedules]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID dari jadwal yang ingin ditampilkan
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Detail jadwal konsultasi berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 date:
 *                   type: string
 *                   format: date
 *                   example: "2025-10-24"
 *                 time:
 *                   type: string
 *                   example: "10:00"
 *                 status:
 *                   type: string
 *                   example: "proses"
 *                 nama_pasien:
 *                   type: string
 *                   example: "Ranti"
 *                 nama_dokter:
 *                   type: string
 *                   example: "dr. Andi"
 *       404:
 *         description: Jadwal dengan ID tersebut tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Schedule not found"
 *       500:
 *         description: Terjadi kesalahan pada server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 */

export async function GET(request, { params }) {
  try {
    const id = parseInt(params.id);

    const data = await prisma.schedules.findUnique({
      where: { id },
      include: {
        users: true, // ✅ sesuai schema
        doctor: {
          include: {
            users: true, // ambil nama dokter dari tabel users
          },
        },
      },
    });

    if (!data) {
      return NextResponse.json(
        { message: "Schedule not found" },
        { status: 404 },
      );
    }

    // format response biar mirip query SQL kamu sebelumnya
    const result = {
      id: data.id,
      date: data.date,
      time: data.time,
      status: data.status,
      nama_pasien: data.users.name,
      nama_dokter: data.doctor.users.name,
    };

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
