import { NextResponse } from "next/server";
import { prisma } from "@/src/libs/prisma";

/**
 * @swagger
 * tags:
 *   name: Recipes
 *   description: API untuk mendapatkan detail resep berdasarkan ID
 */

/**
 * @swagger
 * /api/recipes/{id}:
 *   get:
 *     summary: Mendapatkan detail resep berdasarkan ID
 *     description: Mengambil data lengkap resep termasuk informasi pasien dan dokter berdasarkan `id` resep.
 *     tags: [Recipes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID resep yang ingin diambil
 *         example: 1
 *     responses:
 *       200:
 *         description: Data resep berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 pasien:
 *                   type: string
 *                   example: "Ahmad Fauzi"
 *                 gender:
 *                   type: string
 *                   example: "Laki-laki"
 *                 email:
 *                   type: string
 *                   example: "ahmad.fauzi@example.com"
 *                 tgl_lahir:
 *                   type: string
 *                   example: "1995-06-21"
 *                 alamat:
 *                   type: string
 *                   example: "Jl. Merpati No. 7, Jakarta"
 *                 nomor_wa:
 *                   type: string
 *                   example: "081234567890"
 *                 foto:
 *                   type: string
 *                   example: "/uploads/ahmad.jpg"
 *                 role:
 *                   type: string
 *                   example: "user"
 *                 dokter:
 *                   type: string
 *                   example: "dr. Sinta Rahma"
 *                 deskripsi:
 *                   type: string
 *                   example: "Dokter umum berpengalaman 5 tahun"
 *                 lisensi:
 *                   type: string
 *                   example: "12345/MED/2023"
 *                 sertifikat:
 *                   type: string
 *                   example: "/certs/sinta.pdf"
 *                 created_at:
 *                   type: string
 *                 updated_at:
 *                   type: string
 *       404:
 *         description: Resep tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Data resep tidak ditemukan"
 *       500:
 *         description: Terjadi kesalahan pada server
 */

export async function GET(request, { params }) {
  const recipesId = Number(params.id);

  try {
    const data = await prisma.recipes.findUnique({
      where: { id: recipesId },
      include: {
        users: true,
        doctor: {
          include: {
            users: true,
          },
        },
      },
    });

    if (!data) {
      return NextResponse.json(
        { message: "Data resep tidak ditemukan" },
        { status: 404 },
      );
    }

    const result = {
      id: data.id,
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
      created_at: data.created_at,
      updated_at: data.updated_at,
    };

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
