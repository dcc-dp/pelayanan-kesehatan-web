import { NextResponse } from "next/server";
import { prisma } from "@/src/libs/prisma";

/**
 * @swagger
 * /api/bookings/{id}:
 *   get:
 *     summary: Mendapatkan detail booking berdasarkan ID
 *     description: Mengambil data detail pemesanan (booking) tertentu berdasarkan **ID booking**. Data mencakup nama pembeli, nama dokter, dan total biaya resep.
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID dari booking yang ingin diambil.
 *         schema:
 *           type: integer
 *           example: 5
 *     responses:
 *       200:
 *         description: Data booking berhasil diambil.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 nm_pembeli:
 *                   type: string
 *                   example: "John Doe"
 *                 nm_dokter:
 *                   type: string
 *                   example: "Dr. Sarah Amelia"
 *                 total:
 *                   type: number
 *                   example: 250000
 *       404:
 *         description: Data booking tidak ditemukan.
 *       500:
 *         description: Terjadi kesalahan pada server.
 */
export async function GET(request, { params }) {
  const bookingsId = parseInt(params.id);

  try {
    const booking = await prisma.bookings.findUnique({
      where: { id: bookingsId },
      include: {
        recipes: {
          include: {
            users: true, // pembeli
            doctor: {
              include: {
                users: true, // dokter
              },
            },
          },
        },
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const result = {
      nm_pembeli: booking.recipes.users.name,
      nm_dokter: booking.recipes.doctor.users.name,
      total: booking.total,
    };

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
