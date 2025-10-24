/**
 * @swagger
 * tags:
 *   name: Schedules
 *   description: API untuk mengelola jadwal konsultasi antara pasien dan dokter
 */

/**
 * @swagger
 * /api/schedules:
 *   get:
 *     summary: Menampilkan semua data jadwal konsultasi
 *     tags: [Schedules]
 *     responses:
 *       200:
 *         description: Daftar semua jadwal konsultasi berhasil ditampilkan
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
 *                   date:
 *                     type: string
 *                     format: date
 *                     example: 2025-10-24
 *                   time:
 *                     type: string
 *                     example: "10:00"
 *                   status:
 *                     type: string
 *                     example: "confirmed"
 *                   nama_pasien:
 *                     type: string
 *                     example: "Ranti"
 *                   doctor_id:
 *                     type: integer
 *                     example: 3
 *       500:
 *         description: Terjadi kesalahan pada server
 *
 *   post:
 *     summary: Menambahkan jadwal konsultasi baru
 *     tags: [Schedules]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - users_id
 *               - doctors_id
 *               - date
 *               - time
 *               - status
 *             properties:
 *               users_id:
 *                 type: integer
 *                 example: 1
 *               doctors_id:
 *                 type: integer
 *                 example: 3
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2025-10-24"
 *               time:
 *                 type: string
 *                 example: "10:30"
 *               status:
 *                 type: string
 *                 example: "pending"
 *     responses:
 *       201:
 *         description: Jadwal berhasil ditambahkan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 12
 *       500:
 *         description: Terjadi kesalahan pada server
 *
 *   put:
 *     summary: Mengubah data jadwal konsultasi
 *     tags: [Schedules]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - users_id
 *               - doctors_id
 *               - date
 *               - time
 *               - status
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 5
 *               users_id:
 *                 type: integer
 *                 example: 2
 *               doctors_id:
 *                 type: integer
 *                 example: 4
 *               date:
 *                 type: string
 *                 example: "2025-11-01"
 *               time:
 *                 type: string
 *                 example: "09:00"
 *               status:
 *                 type: string
 *                 example: "completed"
 *     responses:
 *       200:
 *         description: Jadwal berhasil diperbarui
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: schedules updated successfully
 *       500:
 *         description: Terjadi kesalahan pada server
 *
 *   delete:
 *     summary: Menghapus jadwal konsultasi berdasarkan ID
 *     tags: [Schedules]
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
 *                 example: 5
 *     responses:
 *       200:
 *         description: Jadwal berhasil dihapus
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: schedules deleted successfully
 *       500:
 *         description: Terjadi kesalahan pada server
 */
