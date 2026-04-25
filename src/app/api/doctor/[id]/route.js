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
 * /api/doctor/{id}:
 *   get:
 *     summary: Mendapatkan data dokter berdasarkan ID
 *     tags: [Doctor]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID dokter yang ingin diambil
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Data dokter berhasil diambil
 *       404:
 *         description: Dokter tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan di server
 */
export async function GET(request, { params }) {
  try {
    const id = parseInt(params.id);

    const doctor = await prisma.doctor.findUnique({
      where: { id },
      include: {
        users: true,
        category_spesialis: true,
      },
    });

    if (!doctor) {
      return NextResponse.json(
        { message: "Doctor not found" },
        { status: 404 },
      );
    }

    // format biar mirip response lama
    const result = {
      id: doctor.id,
      users_id: doctor.users_id,
      category: doctor.category_spesialis?.specialis_name || null,
      description: doctor.description,
      license: doctor.license,
      certificate: doctor.certificate,
    };

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
