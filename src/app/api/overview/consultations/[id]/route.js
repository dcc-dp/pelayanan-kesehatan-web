import { NextResponse } from "next/server";
import { prisma } from "@/src/libs/prisma";

/**
 * @swagger
 * tags:
 *   name: Overview - Consultations
 *   description: API untuk melihat detail konsultasi pasien dan dokter
 */

/**
 * @swagger
 * /api/overview/consultations/{id}:
 *   get:
 *     summary: Mendapatkan detail konsultasi berdasarkan ID
 *     description: Mengambil data lengkap konsultasi berdasarkan ID, termasuk informasi pasien dan dokter.
 *     tags:
 *       - Overview - Consultations
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID konsultasi
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan data konsultasi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 pasien:
 *                   type: string
 *                   example: "Syah"
 *                 gender:
 *                   type: string
 *                   example: "laki-laki"
 *                 email:
 *                   type: string
 *                   example: "syah@example.com"
 *                 tgl_lahir:
 *                   type: string
 *                   format: date
 *                   example: "2001-05-21"
 *                 alamat:
 *                   type: string
 *                   example: "Jl. Melati No. 10, Makassar"
 *                 nomor_wa:
 *                   type: string
 *                   example: "081234567890"
 *                 foto:
 *                   type: string
 *                   example: "https://example.com/profile.jpg"
 *                 role:
 *                   type: string
 *                   example: "user"
 *                 dokter:
 *                   type: string
 *                   example: "dr. Andi Wijaya"
 *                 deskripsi:
 *                   type: string
 *                   example: "Spesialis penyakit dalam"
 *                 lisensi:
 *                   type: string
 *                   example: "SIP-123456"
 *                 sertifikat:
 *                   type: string
 *                   example: "https://example.com/certificate.pdf"
 *       404:
 *         description: Konsultasi tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Consultation not found"
 *       500:
 *         description: Terjadi kesalahan di server
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

    const data = await prisma.consultations.findUnique({
      where: { id },
      include: {
        users: true, // pasien
        doctor: {
          include: {
            users: true, // user dari dokter
          },
        },
      },
    });

    if (!data) {
      return NextResponse.json(
        { message: "Consultation not found" },
        { status: 404 },
      );
    }

    // format response seperti SQL kamu sebelumnya
    const result = {
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
    };

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
