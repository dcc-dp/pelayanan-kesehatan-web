import { NextResponse } from "next/server";
import { prisma } from "@/src/libs/prisma";

/**
 * @swagger
 * tags:
 *   - name: Category Spesialis
 *     description: API untuk mengelola data kategori spesialis dokter
 */

/**
 * @swagger
 * /api/category_spesialis:
 *   get:
 *     summary: Mendapatkan semua kategori spesialis
 *     description: Mengambil seluruh data kategori spesialis dari database.
 *     tags: [Category Spesialis]
 *     responses:
 *       200:
 *         description: Data kategori spesialis berhasil diambil
 *       500:
 *         description: Terjadi kesalahan pada server
 */
export async function GET() {
  try {
    const data = await prisma.category_spesialis.findMany();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/category_spesialis:
 *   post:
 *     summary: Menambahkan kategori spesialis baru
 *     description: Menyimpan data kategori spesialis baru ke dalam database.
 *     tags: [Category Spesialis]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - specialis_name
 *               - description
 *             properties:
 *               specialis_name:
 *                 type: string
 *                 example: "Pediatri"
 *               description:
 *                 type: string
 *                 example: "Spesialis anak dan tumbuh kembang"
 *     responses:
 *       201:
 *         description: Kategori spesialis berhasil ditambahkan
 *       400:
 *         description: Permintaan tidak valid
 *       500:
 *         description: Terjadi kesalahan pada server
 */
export async function POST(request) {
  try {
    const data = await request.json();

    if (!data.specialis_name || !data.description) {
      return NextResponse.json(
        { error: "specialis_name dan description wajib diisi" },
        { status: 400 },
      );
    }

    const newData = await prisma.category_spesialis.create({
      data: {
        specialis_name: data.specialis_name,
        description: data.description,
      },
    });

    return NextResponse.json({ id: newData.id }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/category_spesialis:
 *   put:
 *     summary: Memperbarui data kategori spesialis
 *     description: Mengubah data kategori spesialis berdasarkan ID.
 *     tags: [Category Spesialis]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - specialis_name
 *               - description
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 3
 *               specialis_name:
 *                 type: string
 *                 example: "Kardiologi"
 *               description:
 *                 type: string
 *                 example: "Spesialis penyakit jantung"
 *     responses:
 *       200:
 *         description: Data berhasil diperbarui
 *       404:
 *         description: Data tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan server
 */
export async function PUT(request) {
  try {
    const data = await request.json();

    if (!data.id || !data.specialis_name || !data.description) {
      return NextResponse.json(
        { error: "id, specialis_name, dan description wajib diisi" },
        { status: 400 },
      );
    }

    const updated = await prisma.category_spesialis.updateMany({
      where: { id: data.id },
      data: {
        specialis_name: data.specialis_name,
        description: data.description,
      },
    });

    if (updated.count === 0) {
      return NextResponse.json(
        { error: "Data tidak ditemukan" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: "category_spesialis updated successfully",
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/category_spesialis:
 *   delete:
 *     summary: Menghapus data kategori spesialis
 *     description: Menghapus data kategori spesialis berdasarkan ID.
 *     tags: [Category Spesialis]
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
 *                 example: 3
 *     responses:
 *       200:
 *         description: Data berhasil dihapus
 *       404:
 *         description: Data tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan server
 */
export async function DELETE(request) {
  try {
    const data = await request.json();

    if (!data.id) {
      return NextResponse.json({ error: "id wajib diisi" }, { status: 400 });
    }

    const deleted = await prisma.category_spesialis.deleteMany({
      where: { id: data.id },
    });

    if (deleted.count === 0) {
      return NextResponse.json(
        { error: "Data tidak ditemukan" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: "category_spesialis deleted successfully",
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
