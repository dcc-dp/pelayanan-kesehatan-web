import { NextResponse } from "next/server";
import { prisma } from "@/src/libs/prisma";

/**
 * @swagger
 * /api/details/{id}:
 *   get:
 *     summary: Mendapatkan semua detail resep berdasarkan ID pasien
 *     description: Mengambil data detail resep (obat, jumlah minum, waktu minum) untuk pasien tertentu berdasarkan user_id.
 *     tags: [Details]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID user (pasien)
 *         schema:
 *           type: integer
 *           example: 2
 *     responses:
 *       200:
 *         description: Data detail resep pasien berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   jumlah_minum:
 *                     type: string
 *                   jumlah_hari:
 *                     type: string
 *                   waktu_minum:
 *                     type: string
 *                   nama_drug:
 *                     type: string
 *                   nm_pasien:
 *                     type: string
 *                   nm_dokter:
 *                     type: string
 *       404:
 *         description: Data tidak ditemukan untuk ID tersebut
 *       500:
 *         description: Terjadi kesalahan pada server
 */
export async function GET(request, { params }) {
  const userId = parseInt(params.id);

  try {
    const data = await prisma.details.findMany({
      where: {
        recipes: {
          users_id: userId, // filter berdasarkan pasien
        },
      },
      include: {
        drugs: true,
        recipes: {
          include: {
            users: true, // pasien
            doctor: {
              include: {
                users: true, // dokter
              },
            },
          },
        },
      },
    });

    if (data.length === 0) {
      return NextResponse.json(
        { message: "Tidak ada data detail untuk ID pasien ini" },
        { status: 404 },
      );
    }

    // 🔁 format seperti SQL lama
    const result = data.map((d) => ({
      id: d.id,
      jumlah_minum: d.jumlah_minum,
      jumlah_hari: d.jumlah_hari,
      waktu_minum: d.waktu_minum,
      nama_drug: d.drugs.name,
      nm_pasien: d.recipes.users.name,
      nm_dokter: d.recipes.doctor.users.name,
    }));

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
