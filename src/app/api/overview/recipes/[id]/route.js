import { NextResponse } from "next/server";
import { prisma } from "@/src/libs/prisma";

/**
 * @swagger
 * tags:
 *   - name: Overview - Recipes
 *     description: API untuk melihat ringkasan resep berdasarkan user
 */

/**
 * @swagger
 * /api/overview/recipes/{id}:
 *   get:
 *     summary: Mendapatkan daftar resep berdasarkan ID user
 *     description: |
 *       Endpoint ini digunakan untuk mengambil seluruh data resep milik seorang user (pasien),
 *       termasuk informasi lengkap pasien dan dokter yang memberikan resep.
 *     tags: [Overview - Recipes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID recipes
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
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-01-01T10:00:00.000Z"
 *       404:
 *         description: Tidak ada resep ditemukan untuk user tersebut
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Recipes not found"
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
  const userId = Number(params.id);

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
      orderBy: {
        created_at: "desc",
      },
    });

    if (!data.length) {
      return NextResponse.json(
        { message: "Recipes not found" },
        { status: 404 },
      );
    }

    // Mapping biar hasilnya sama kayak query SQL kamu
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
      created_at: item.created_at,
    }));

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
