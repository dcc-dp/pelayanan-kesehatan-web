import { NextResponse } from "next/server";
import { prisma } from "@/src/libs/prisma";

/**
 * @swagger
 * tags:
 *   - name: Overview - Recipes
 *     description: API untuk melihat daftar resep berdasarkan user
 */

/**
 * @swagger
 * /api/overview/recipes/{id}:
 *   get:
 *     summary: Mendapatkan daftar resep berdasarkan ID user
 *     description: |
 *       Endpoint ini digunakan untuk mengambil seluruh data resep milik user (pasien),
 *       termasuk informasi lengkap pasien dan dokter yang memberikan resep.
 *     tags: [Overview - Recipes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID user (pasien)
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan daftar resep
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   pasien:
 *                     type: string
 *                     example: "Syah"
 *                   gender:
 *                     type: string
 *                     example: "laki-laki"
 *                   email:
 *                     type: string
 *                     example: "syah@example.com"
 *                   tgl_lahir:
 *                     type: string
 *                     format: date
 *                     example: "2001-05-21"
 *                   alamat:
 *                     type: string
 *                     example: "Jl. Melati No. 10"
 *                   nomor_wa:
 *                     type: string
 *                     example: "081234567890"
 *                   foto:
 *                     type: string
 *                     example: "/uploads/profile.jpg"
 *                   role:
 *                     type: string
 *                     example: "user"
 *                   dokter:
 *                     type: string
 *                     example: "dr. Andi Wijaya"
 *                   deskripsi:
 *                     type: string
 *                     example: "Spesialis penyakit dalam"
 *                   lisensi:
 *                     type: string
 *                     example: "SIP-123456"
 *                   sertifikat:
 *                     type: string
 *                     example: "/certs/dokter.pdf"
 *       400:
 *         description: ID tidak valid
 *       404:
 *         description: Data resep tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan pada server
 */

export async function GET(request, { params }) {
  const userId = Number(params.id);

  // ✅ validasi ID
  if (!userId || isNaN(userId)) {
    return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });
  }

  try {
    const data = await prisma.recipes.findMany({
      where: {
        users_id: userId,
      },
      include: {
        users: true,
        doctor: {
          include: {
            users: true,
          },
        },
      },
    });

    if (!data.length) {
      return NextResponse.json(
        { message: "Data resep tidak ditemukan" },
        { status: 404 },
      );
    }

    // 🔥 mapping agar sama seperti SQL lama
    const result = data.map((item) => ({
      pasien: item.users.name,
      gender: item.users.gender,
      email: item.users.email,
      tgl_lahir: item.users.birth,
      alamat: item.users.address,
      nomor_wa: item.users.whatsapp,
      foto: item.users.image,
      role: item.users.role,
      dokter: item.doctor.users.name,
      deskripsi: item.doctor.description,
      lisensi: item.doctor.license,
      sertifikat: item.doctor.certificate,
    }));

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
