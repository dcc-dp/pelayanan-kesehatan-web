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
 *       500:
 *         description: Kesalahan server
 */
export async function GET(request, { params }) {
  try {
    const recipes_id = parseInt(params.id);
    
    const data = await prisma.details.findMany({
      where: { recipes_id: recipes_id },
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

    if (data.length === 0) {
      return NextResponse.json(
        { message: "Tidak ada data detail untuk ID resep ini" },
        { status: 404 }
      );
    }

    const result = data.map((d) => ({
      id: d.id,
      recipes_id: d.recipes_id,
      drugs_id: d.drugs_id,
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

export async function POST(request) {
  try {
    const data = await request.json();

    const newData = await prisma.details.create({
      data: {
        jumlah: data.jumlah || 1, // Default to 1 if not provided
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

export async function PUT(request) {
  try {
    const data = await request.json();

    const updated = await prisma.details.updateMany({
      where: { id: data.id },
      data: {
        jumlah: data.jumlah, // Can be undefined, Prisma ignores undefined
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
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "details updated successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const data = await request.json();

    const deleted = await prisma.details.deleteMany({
      where: { id: data.id },
    });

    if (deleted.count === 0) {
      return NextResponse.json(
        { error: "Data tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "details deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
