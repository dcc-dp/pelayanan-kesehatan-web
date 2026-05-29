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

<<<<<<< HEAD
    if (data.length === 0) {
=======
    const query = `
      SELECT 
        d.id,
        d.jumlah_minum,
        d.jumlah_hari,
        d.waktu_minum,
        dr.name AS nama_drug,
        pasien.name AS nm_pasien,
        dokter.name AS nm_dokter
      FROM details AS d
      LEFT JOIN drugs AS dr ON d.drugs_id = dr.id
      LEFT JOIN recipes AS re ON d.recipes_id = re.id
      LEFT JOIN users pasien ON re.users_id = pasien.id
      LEFT JOIN doctor drs ON re.doctors_id = drs.id
      LEFT JOIN users dokter ON drs.users_id = dokter.id
      WHERE d.id = ?

    `;
    const [rows] = await db.execute(query, [details]);
    db.release();

    if (rows.length === 0) {
>>>>>>> 3296d7c76983a4448baeb199edd0ba18bec61877
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
