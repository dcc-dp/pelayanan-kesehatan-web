import { NextResponse } from "next/server";
import { prisma } from "../../../libs/prisma";

/**
 * @swagger
 * tags:
 *   name: Bookings
 *   description: API untuk mengelola data pemesanan obat (bookings)
 */

/**
 * @swagger
 * /api/bookings:
 *   get:
 *     summary: Mendapatkan daftar data pemesanan (bookings)
 *     description: |
 *       Mengambil data bookings lengkap yang berisi:
 *       - Informasi pasien (pembeli)
 *       - Informasi dokter
 *       - Detail obat
 *       - Total biaya
 *     tags: [Bookings]
 *     responses:
 *       200:
 *         description: Data bookings berhasil diambil.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   obat:
 *                     type: string
 *                     example: "Paracetamol"
 *                   harga:
 *                     type: number
 *                     example: 15000
 *                   jumlah_minum:
 *                     type: number
 *                     example: 3
 *                   jumlah_hari:
 *                     type: number
 *                     example: 5
 *                   waktu_minum:
 *                     type: string
 *                     example: "Pagi, Siang, Malam"
 *                   nm_pembeli:
 *                     type: string
 *                     example: "John Doe"
 *                   nm_dokter:
 *                     type: string
 *                     example: "Dr. Amelia"
 *                   total:
 *                     type: number
 *                     example: 75000
 *       500:
 *         description: Terjadi kesalahan pada server.
 */
export async function GET() {
  try {
    const bookings = await prisma.bookings.findMany({
      include: {
        recipes: {
          include: {
            users: true, // pembeli
            doctor: {
              include: {
                users: true, // dokter
              },
            },
            details: {
              include: {
                drugs: true, // obat
              },
            },
          },
        },
      },
    });

    // Format response sesuai struktur query SQL lama
    const result = bookings.flatMap((b) => {
      const details = b.recipes.details;

      // kalau tidak ada detail
      if (!details || details.length === 0) {
        return [
          {
            id: b.id,
            recipes_id: b.recipes_id,
            total: b.total,
            nm_pembeli: b.recipes.users.name,
            nm_dokter: b.recipes.doctor.users.name,
            obat: null,
          },
        ];
      }

      // kalau ada detail
      return details.map((dt) => ({
        id: b.id,
        recipes_id: b.recipes_id,
        total: b.total,
        nm_pembeli: b.recipes.users.name,
        nm_dokter: b.recipes.doctor.users.name,
        obat: dt.drugs.name,
      }));
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/bookings:
 *   post:
 *     summary: Membuat data booking baru berdasarkan recipes_id
 *     description: |
 *       Total dihitung otomatis dari tabel `details`:
 *       - total = jumlah * harga obat
 *     tags: [Bookings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - recipes_id
 *             properties:
 *               recipes_id:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       201:
 *         description: Booking berhasil dibuat.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: number
 *                 total:
 *                   type: number
 *       500:
 *         description: Terjadi kesalahan server.
 */
export async function POST(request) {
  try {
    const data = await request.json();

    // ✅ 1. Validasi recipes_id wajib ada
    if (!data.recipes_id) {
      return NextResponse.json(
        { error: "recipes_id is required" },
        { status: 400 },
      );
    }

    // ✅ 2. Cek apakah recipes_id benar-benar ada di tabel recipes
    const recipe = await prisma.recipes.findUnique({
      where: { id: data.recipes_id },
    });

    if (!recipe) {
      return NextResponse.json(
        { error: `Recipe with id ${data.recipes_id} not found` },
        { status: 404 },
      );
    }

    // Hitung total dari details
    const details = await prisma.details.findMany({
      where: { recipes_id: data.recipes_id },
      include: { drugs: true },
    });

    // ✅ 3. Cek apakah details kosong (resep belum punya obat)
    if (details.length === 0) {
      return NextResponse.json(
        { error: "No details found for this recipe" },
        { status: 400 },
      );
    }

    const total = details.reduce((sum, dt) => {
      return sum + dt.drugs.price * dt.jumlah_minum * dt.jumlah_hari;
    }, 0);

    const newBooking = await prisma.bookings.upsert({
      where: {
        recipes_id: data.recipes_id,
      },
      update: {
        total,
        updated_at: new Date(),
      },
      create: {
        recipes_id: data.recipes_id,
        total,
      },
    });

    return NextResponse.json({ id: newBooking.id, total }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/bookings:
 *   put:
 *     summary: Memperbarui booking & menghitung ulang total
 *     description: |
 *       Total dihitung ulang otomatis dari tabel details.
 *     tags: [Bookings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - recipes_id
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 10
 *               recipes_id:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       200:
 *         description: Data booking berhasil diperbarui.
 *       404:
 *         description: Booking tidak ditemukan.
 *       500:
 *         description: Kesalahan server.
 */
export async function PUT(request) {
  try {
    const data = await request.json();

    // Hitung ulang total
    const details = await prisma.details.findMany({
      where: { recipes_id: data.recipes_id },
      include: { drugs: true },
    });

    const total = details.reduce((sum, dt) => {
      return sum + dt.drugs.price * dt.jumlah_minum * dt.jumlah_hari;
    }, 0);

    const updated = await prisma.bookings.updateMany({
      where: { id: data.id },
      data: {
        recipes_id: data.recipes_id,
        total,
      },
    });

    if (updated.count === 0) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "bookings updated successfully",
      total,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/bookings:
 *   delete:
 *     summary: Menghapus booking berdasarkan ID
 *     tags: [Bookings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 7
 *     responses:
 *       200:
 *         description: Booking berhasil dihapus.
 *       500:
 *         description: Kesalahan server.
 */
export async function DELETE(request) {
  try {
    const data = await request.json();

    await prisma.bookings.delete({
      where: { id: data.id },
    });

    return NextResponse.json({ message: "bookings deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
