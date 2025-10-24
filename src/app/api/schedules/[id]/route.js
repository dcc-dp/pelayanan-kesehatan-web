/**
 * @swagger
 * tags:
 *   name: Schedules
 *   description: API untuk mengelola data jadwal konsultasi pasien dan dokter
 */

/**
 * @swagger
 * /api/schedules/{id}:
 *   get:
 *     summary: Mendapatkan detail jadwal konsultasi berdasarkan ID
 *     tags: [Schedules]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID dari jadwal yang ingin ditampilkan
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Detail jadwal konsultasi berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 date:
 *                   type: string
 *                   format: date
 *                   example: "2025-10-24"
 *                 time:
 *                   type: string
 *                   example: "10:00"
 *                 status:
 *                   type: string
 *                   example: "confirmed"
 *                 nama_pasien:
 *                   type: string
 *                   example: "Ranti"
 *                 id_dokter:
 *                   type: integer
 *                   example: 3
 *       404:
 *         description: Jadwal dengan ID tersebut tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan pada server
 */
