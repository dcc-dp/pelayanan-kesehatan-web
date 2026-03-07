/**
 * @swagger
 * tags:
 *   name: Doctor
 *   description: API untuk mengelola data dokter
 */

/**
 * @swagger
 * /api/doctor/{id}:
 *   get:
 *     summary: Mendapatkan data dokter berdasarkan ID
 *     tags: [Doctor]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID dokter yang ingin diambil
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Data dokter berhasil diambil
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
 *                   category:
 *                     type: string
 *                     example: "Dokter Umum"
 *                   description:
 *                     type: string
 *                     example: "Dokter berpengalaman di bidang kesehatan umum."
 *                   license:
 *                     type: string
 *                     example: "LIC-2025-001"
 *                   certificate:
 *                     type: string
 *                     example: "sertifikat_dokter.pdf"
 *                   users_id:
 *                     type: integer
 *                     example: 3
 *       404:
 *         description: Dokter tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Doctor not found"
 *       500:
 *         description: Terjadi kesalahan di server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Database connection failed"
 */

export async function GET(request, { params }) {
  const bookingsId = params.id;

  try {
    const db = await pool.getConnection();

    const query = `
    SELECT 
      pembeli.name AS nm_pembeli,
      dokter.name AS nm_dokter,
      b.total
      FROM bookings b
      INNER JOIN recipes r ON b.recipes_id = r.id
      INNER JOIN users pembeli ON r.users_id = pembeli.id
      INNER JOIN doctor dr ON r.doctors_id = dr.id
      INNER JOIN users dokter ON dr.users_id = dokter.id
      WHERE b.id = ?;
    `;
    const [rows] = await db.execute(query, [bookingsId]);
    db.release();

    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
