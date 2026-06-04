import { NextResponse } from "next/server";
import { prisma } from "@/src/libs/prisma";

/**
 * @swagger
 * tags:
 *   name: Drugs
 *   description: API untuk mengelola data obat
 */

/**
 * @swagger
 * /api/drugs:
 *   get:
 *     summary: Mendapatkan semua data obat
 *     description: Mengambil seluruh data obat dari database.
 *     tags: [Drugs]
 *     responses:
 *       200:
 *         description: Berhasil mengambil data obat
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: "Paracetamol"
 *                   type:
 *                     type: string
 *                     example: "Tablet"
 *                   price:
 *                     type: number
 *                     example: 5000
 *       500:
 *         description: Terjadi kesalahan server
 */
export async function GET() {
  try {
    const drugs = await prisma.drugs.findMany();
    return NextResponse.json(drugs);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/drugs:
 *   post:
 *     summary: Menambahkan data obat baru
 *     description: Menyimpan data obat baru ke database.
 *     tags: [Drugs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - type
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Amoxicillin"
 *               type:
 *                 type: string
 *                 example: "Kapsul"
 *               price:
 *                 type: number
 *                 example: 15000
 *     responses:
 *       201:
 *         description: Obat berhasil ditambahkan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 10
 *       400:
 *         description: Data tidak valid
 *       500:
 *         description: Terjadi kesalahan server
 */
export async function POST(request) {
  try {
    const data = await request.json();

    if (!data.name || !data.type || !data.price) {
      return NextResponse.json(
        { error: "name, type, dan price wajib diisi" },
        { status: 400 },
      );
    }

    const newDrug = await prisma.drugs.create({
      data: {
        name: data.name,
        type: data.type,
        price: data.price,
      },
    });

    return NextResponse.json({ id: newDrug.id }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/drugs:
 *   put:
 *     summary: Memperbarui data obat
 *     description: Mengubah data obat berdasarkan ID.
 *     tags: [Drugs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - name
 *               - type
 *               - price
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 3
 *               name:
 *                 type: string
 *                 example: "Ibuprofen"
 *               type:
 *                 type: string
 *                 example: "Tablet"
 *               price:
 *                 type: number
 *                 example: 12000
 *     responses:
 *       200:
 *         description: Data obat berhasil diperbarui
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "drugs updated successfully"
 *       404:
 *         description: Data tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan server
 */
export async function PUT(request) {
  try {
    const data = await request.json();

    if (!data.id) {
      return NextResponse.json({ error: "id wajib diisi" }, { status: 400 });
    }

    const existing = await prisma.drugs.findUnique({
      where: { id: data.id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Data obat tidak ditemukan" },
        { status: 404 },
      );
    }

    await prisma.drugs.update({
      where: { id: data.id },
      data: {
        name: data.name,
        type: data.type,
        price: data.price,
      },
    });

    return NextResponse.json({
      message: "drugs updated successfully",
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/drugs:
 *   delete:
 *     summary: Menghapus data obat
 *     description: Menghapus data obat berdasarkan ID.
 *     tags: [Drugs]
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
 *                 example: 4
 *     responses:
 *       200:
 *         description: Data berhasil dihapus
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "drugs deleted successfully"
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

    const existing = await prisma.drugs.findUnique({
      where: { id: data.id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Data obat tidak ditemukan" },
        { status: 404 },
      );
    }

    await prisma.drugs.delete({
      where: { id: data.id },
    });

    return NextResponse.json({
      message: "drugs deleted successfully",
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
