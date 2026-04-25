import { NextResponse } from "next/server";
import { prisma } from "@/src/libs/prisma";

/**
 * @swagger
 * tags:
 *   name: Details
 *   description: API untuk mengelola data detail resep obat
 */

/**
 * @swagger
 * /api/details:
 *   get:
 *     summary: Mendapatkan semua data detail resep obat
 *     description: Mengambil seluruh data dari tabel `details` beserta relasi ke `drugs`, `recipes`, dan `users`.
 *     tags: [Details]
 *     responses:
 *       200:
 *         description: Berhasil mengambil data detail resep
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
 *                     type: integer
 *                   jumlah_hari:
 *                     type: integer
 *                   waktu_minum:
 *                     type: string
 *                   nama_drug:
 *                     type: string
 *                   jumlah:
 *                     type: integer
 *                   nm_pasien:
 *                     type: string
 *                   nm_dokter:
 *                     type: string
 *                   created_at:
 *                     type: string
 *                   updated_at:
 *                     type: string
 *       500:
 *         description: Kesalahan server
 */
export async function GET() {
  try {
    const data = await prisma.details.findMany({
      include: {
        drugs: true,
        recipes: {
          include: {
            users: true,
            doctor: {
              include: {
                users: true,
              },
            },
          },
        },
      },
    });

    const result = data.map((d) => ({
      id: d.id,
      jumlah_minum: d.jumlah_minum,
      jumlah_hari: d.jumlah_hari,
      waktu_minum: d.waktu_minum,
      nama_drug: d.drugs.name,
      jumlah: d.jumlah,
      nm_pasien: d.recipes.users.name,
      nm_dokter: d.recipes.doctor.users.name,
      created_at: d.created_at,
      updated_at: d.updated_at,
    }));

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/details:
 *   post:
 *     summary: Menambahkan data detail resep obat
 *     description: Menyimpan data detail resep baru ke dalam tabel `details`.
 *     tags: [Details]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - recipes_id
 *               - drugs_id
 *               - jumlah
 *               - jumlah_minum
 *               - jumlah_hari
 *               - waktu_minum
 *             properties:
 *               recipes_id:
 *                 type: integer
 *               drugs_id:
 *                 type: integer
 *               jumlah:
 *                 type: integer
 *               jumlah_minum:
 *                 type: integer
 *               jumlah_hari:
 *                 type: integer
 *               waktu_minum:
 *                 type: string
 *     responses:
 *       201:
 *         description: Data berhasil ditambahkan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *       400:
 *         description: Request tidak valid
 *       404:
 *         description: Relasi tidak ditemukan
 *       500:
 *         description: Kesalahan server
 */
export async function POST(request) {
  try {
    const data = await request.json();

    const drug = await prisma.drugs.findUnique({
      where: { id: data.drugs_id },
    });

    if (!drug) {
      return NextResponse.json(
        { error: `Drug tidak ditemukan` },
        { status: 404 },
      );
    }

    const recipe = await prisma.recipes.findUnique({
      where: { id: data.recipes_id },
    });

    if (!recipe) {
      return NextResponse.json(
        { error: `Recipe tidak ditemukan` },
        { status: 404 },
      );
    }

    const newData = await prisma.details.create({
      data: {
        jumlah: data.jumlah,
        jumlah_minum: data.jumlah_minum,
        jumlah_hari: data.jumlah_hari,
        waktu_minum: data.waktu_minum,
        recipes: { connect: { id: data.recipes_id } },
        drugs: { connect: { id: data.drugs_id } },
      },
    });

    return NextResponse.json({ id: newData.id }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/details:
 *   put:
 *     summary: Memperbarui data detail resep obat
 *     description: Mengubah data pada tabel `details` berdasarkan ID.
 *     tags: [Details]
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
 *               recipes_id:
 *                 type: integer
 *               drugs_id:
 *                 type: integer
 *               jumlah:
 *                 type: integer
 *               jumlah_minum:
 *                 type: integer
 *               jumlah_hari:
 *                 type: integer
 *               waktu_minum:
 *                 type: string
 *     responses:
 *       200:
 *         description: Data berhasil diperbarui
 *       404:
 *         description: Data tidak ditemukan
 *       500:
 *         description: Kesalahan server
 */
export async function PUT(request) {
  try {
    const data = await request.json();

    const updated = await prisma.details.updateMany({
      where: { id: data.id },
      data: {
        jumlah: data.jumlah,
        jumlah_minum: data.jumlah_minum,
        jumlah_hari: data.jumlah_hari,
        waktu_minum: data.waktu_minum,
        recipes_id: data.recipes_id,
        drugs_id: data.drugs_id,
      },
    });

    if (updated.count === 0) {
      return NextResponse.json(
        { error: "Data tidak ditemukan" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: "details updated successfully",
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/details:
 *   delete:
 *     summary: Menghapus data detail resep obat
 *     description: Menghapus data berdasarkan ID dari tabel `details`.
 *     tags: [Details]
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
 *         description: Data berhasil dihapus
 *       404:
 *         description: Data tidak ditemukan
 *       500:
 *         description: Kesalahan server
 */
export async function DELETE(request) {
  try {
    const data = await request.json();

    const deleted = await prisma.details.deleteMany({
      where: { id: data.id },
    });

    if (deleted.count === 0) {
      return NextResponse.json(
        { error: "Data tidak ditemukan" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: "details deleted successfully",
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
