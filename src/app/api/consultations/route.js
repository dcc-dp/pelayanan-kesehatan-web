import { NextResponse } from "next/server";
import { prisma } from "@/src/libs/prisma";

/**
 * @swagger
 * tags:
 *   - name: Consultations
 *     description: API untuk mengelola data konsultasi antara pasien dan dokter
 */

/**
 * @swagger
 * /api/consultations:
 *   get:
 *     summary: Mendapatkan semua data konsultasi
 *     description: Mengambil seluruh data konsultasi, termasuk informasi pasien dan dokter terkait.
 *     tags: [Consultations]
 *     responses:
 *       200:
 *         description: Data konsultasi berhasil diambil
 *       500:
 *         description: Terjadi kesalahan pada server
 */
export async function GET() {
  try {
    const db = await pool.getConnection();
    const query = `
      SELECT 
        c.id,
        u1.name AS pasien,
        u1.gender,
        u1.email,
        u1.birth as tgl_lahir,
        u1.address as alamat,
        u1.whatsapp as nomor_wa,
        u1.image as foto,
        u1.role as role,
        u2.name AS dokter,
        d.description AS deskripsi,
        d.license AS lisensi,
        d.certificate AS sertifikat,
        c.created_at,
        c.updated_at
      FROM consultations c
      INNER JOIN users u1 ON c.users_id = u1.id
      INNER JOIN doctor d ON c.doctors_id = d.id
      INNER JOIN users u2 ON d.users_id = u2.id
    `;
    const [rows] = await db.execute(query);
    db.release();
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/consultations:
 *   post:
 *     summary: Menambahkan data konsultasi baru
 *     description: Menyimpan data konsultasi baru antara pasien dan dokter ke dalam database.
 *     tags: [Consultations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - users_id
 *               - doctors_id
 *             properties:
 *               users_id:
 *                 type: integer
 *                 example: 1
 *               doctors_id:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: Konsultasi berhasil ditambahkan
 *       400:
 *         description: Permintaan tidak valid
 *       500:
 *         description: Terjadi kesalahan pada server
 */
export async function POST(request) {
  try {
    const data = await request.json();

    if (!data.users_id || !data.doctors_id) {
      return NextResponse.json(
        { error: "users_id dan doctors_id wajib diisi" },
        { status: 400 },
      );
    }

    const newData = await prisma.consultations.create({
      data: {
        users: {
          connect: { id: data.users_id },
        },
        doctor: {
          connect: { id: data.doctors_id },
        },
      },
    });

    return NextResponse.json({ id: newData.id }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/consultations:
 *   put:
 *     summary: Memperbarui data konsultasi
 *     description: Mengubah data konsultasi berdasarkan ID.
 *     tags: [Consultations]
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
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 3
 *               users_id:
 *                 type: integer
 *                 example: 1
 *               doctors_id:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Data konsultasi berhasil diperbarui
 *       404:
 *         description: Data tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan pada server
 */
export async function PUT(request) {
  try {
    const data = await request.json();

    if (!data.id || !data.users_id || !data.doctors_id) {
      return NextResponse.json(
        { error: "id, users_id, dan doctors_id wajib diisi" },
        { status: 400 },
      );
    }

    const updated = await prisma.consultations.updateMany({
      where: { id: data.id },
      data: {
        users_id: data.users_id,
        doctors_id: data.doctors_id,
      },
    });

    if (updated.count === 0) {
      return NextResponse.json(
        { error: "Data tidak ditemukan" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: "consultations updated successfully",
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/consultations:
 *   delete:
 *     summary: Menghapus data konsultasi
 *     description: Menghapus data konsultasi berdasarkan ID.
 *     tags: [Consultations]
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
 *         description: Data konsultasi berhasil dihapus
 *       404:
 *         description: Data tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan pada server
 */
export async function DELETE(request) {
  try {
    const data = await request.json();

    if (!data.id) {
      return NextResponse.json({ error: "id wajib diisi" }, { status: 400 });
    }

    const deleted = await prisma.consultations.deleteMany({
      where: { id: data.id },
    });

    if (deleted.count === 0) {
      return NextResponse.json(
        { error: "Data tidak ditemukan" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: "consultations deleted successfully",
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
