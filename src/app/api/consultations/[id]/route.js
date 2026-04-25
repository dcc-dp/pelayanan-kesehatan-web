import { NextResponse } from "next/server";
import { prisma } from "@/src/libs/prisma";

/**
 * @swagger
 * /api/consultations/{id}:
 *   get:
 *     summary: Mendapatkan detail konsultasi berdasarkan ID
 *     description: Mengambil data detail konsultasi pasien tertentu berdasarkan **ID konsultasi**. Data mencakup informasi pasien dan dokter.
 *     tags: [Consultations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID dari konsultasi yang ingin diambil.
 *         schema:
 *           type: integer
 *           example: 3
 *     responses:
 *       200:
 *         description: Data konsultasi berhasil diambil.
 *       404:
 *         description: Data konsultasi tidak ditemukan.
 *       500:
 *         description: Terjadi kesalahan pada server.
 */

export async function GET(request, { params }) {
  const consultationId = parseInt(params.id);

  try {
    const data = await prisma.consultations.findUnique({
      where: { id: consultationId },
      include: {
        users: true, // pasien
        doctor: {
          include: {
            users: true, // user dokter
          },
        },
      },
    });

    if (!data) {
      return NextResponse.json(
        { message: "Data konsultasi tidak ditemukan" },
        { status: 404 },
      );
    }

    // 🔁 samakan format dengan SQL lama (array)
    const result = [
      {
        id: data.id,
        users_id: data.users_id,
        doctors_id: data.doctors_id,
        pasien: data.users.name,
        gender: data.users.gender,
        email: data.users.email,
        tgl_lahir: data.users.birth,
        alamat: data.users.address,
        nomor_wa: data.users.whatsapp,
        foto: data.users.image,
        role: data.users.role,
        dokter: data.doctor.users.name,
        deskripsi: data.doctor.description,
        lisensi: data.doctor.license,
        sertifikat: data.doctor.certificate,
      },
    ];

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
