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
 * /api/drugs/{id}:
 *   get:
 *     summary: Mendapatkan data obat berdasarkan ID
 *     description: Mengambil data obat dari database berdasarkan ID yang diberikan.
 *     tags: [Drugs]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID obat yang ingin diambil
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Data obat berhasil diambil
 *       404:
 *         description: Data obat tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan pada server
 */
export async function GET(request, { params }) {
  try {
    const id = parseInt(params.id); // penting!

    const drug = await prisma.drugs.findUnique({
      where: { id },
    });

    if (!drug) {
      return NextResponse.json({ message: "Drugs not found" }, { status: 404 });
    }

    return NextResponse.json(drug);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
