import { NextResponse } from "next/server";
import { prisma } from "@/src/libs/prisma";

/**
 * @swagger
 * tags:
 *   name: Recipes
 *   description: API untuk mengelola data resep pasien dan dokter
 */

/**
 * @swagger
 * /api/recipes:
 *   get:
 *     summary: Mendapatkan semua data resep beserta informasi pasien dan dokter
 *     description: Mengambil seluruh data resep dari tabel `recipes` beserta relasi user (pasien) dan doctor.
 *     tags: [Recipes]
 *     responses:
 *       200:
 *         description: Data resep berhasil diambil
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
 *                   pasien:
 *                     type: string
 *                     example: "Ahmad Fauzi"
 *                   gender:
 *                     type: string
 *                     example: "Laki-laki"
 *                   email:
 *                     type: string
 *                     example: "ahmad@gmail.com"
 *                   tgl_lahir:
 *                     type: string
 *                     example: "1995-06-21"
 *                   alamat:
 *                     type: string
 *                     example: "Jl. Merpati No. 7"
 *                   nomor_wa:
 *                     type: string
 *                     example: "081234567890"
 *                   foto:
 *                     type: string
 *                     example: "/uploads/ahmad.jpg"
 *                   role:
 *                     type: string
 *                     example: "user"
 *                   dokter:
 *                     type: string
 *                     example: "dr. Sinta"
 *                   deskripsi:
 *                     type: string
 *                     example: "Dokter umum dengan pengalaman 5 tahun"
 *                   lisensi:
 *                     type: string
 *                     example: "12345/MED/2022"
 *                   sertifikat:
 *                     type: string
 *                     example: "/certs/sinta.pdf"
 *                   created_at:
 *                     type: string
 *                     example: "2026-01-01T10:00:00.000Z"
 *                   updated_at:
 *                     type: string
 *                     example: "2026-01-01T10:00:00.000Z"
 *       500:
 *         description: Terjadi kesalahan pada server
 */
export async function GET() {
  try {
    const data = await prisma.recipes.findMany({
      include: {
        users: true,
        doctor: {
          include: {
            users: true,
          },
        },
      },
    });

    const result = data.map((item) => ({
      id: item.id,
      pasien: item.users.name,
      gender: item.users.gender,
      email: item.users.email,
      tgl_lahir: item.users.birth,
      alamat: item.users.address,
      nomor_wa: item.users.whatsapp,
      foto: item.users.image,
      role: item.users.role,
      dokter: item.doctor.users.name,
      deskripsi: item.doctor.description,
      lisensi: item.doctor.license,
      sertifikat: item.doctor.certificate,
      created_at: item.created_at,
      updated_at: item.updated_at,
    }));

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/recipes:
 *   post:
 *     summary: Menambahkan data resep baru
 *     description: Menyimpan relasi baru antara pasien dan dokter ke tabel `recipes`.
 *     tags: [Recipes]
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
 *                 example: 3
 *               doctors_id:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: Resep berhasil ditambahkan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 12
 *       400:
 *         description: Data tidak valid
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

    const newData = await prisma.recipes.create({
      data: {
        users_id: Number(data.users_id),
        doctors_id: Number(data.doctors_id),
      },
    });

    return NextResponse.json({ id: newData.id }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/recipes:
 *   put:
 *     summary: Memperbarui data resep berdasarkan ID
 *     description: Mengupdate relasi pasien dan dokter dalam tabel `recipes`.
 *     tags: [Recipes]
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
 *                 example: 5
 *               users_id:
 *                 type: integer
 *                 example: 3
 *               doctors_id:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Data resep berhasil diperbarui
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "recipes updated successfully"
 *       404:
 *         description: Data tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan pada server
 */
export async function PUT(request) {
  try {
    const data = await request.json();

    const existing = await prisma.recipes.findUnique({
      where: { id: Number(data.id) },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Data tidak ditemukan" },
        { status: 404 },
      );
    }

    await prisma.recipes.update({
      where: { id: Number(data.id) },
      data: {
        users_id: Number(data.users_id),
        doctors_id: Number(data.doctors_id),
      },
    });

    return NextResponse.json({
      message: "recipes updated successfully",
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/recipes:
 *   delete:
 *     summary: Menghapus data resep berdasarkan ID
 *     description: Menghapus data dari tabel `recipes` berdasarkan ID.
 *     tags: [Recipes]
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
 *         description: Data resep berhasil dihapus
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "recipes deleted successfully"
 *       404:
 *         description: Data tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan pada server
 */
<<<<<<< HEAD
=======

export async function GET() {
  try {
    const db = await pool.getConnection();
    const query = `
  SELECT 
    c.id AS id,
    c.users_id,
    c.doctors_id,
    c.created_at,
    c.updated_at,
    u1.name AS pasien,
    u1.gender,
    u1.email,
    u1.birth AS tgl_lahir,
    u1.address AS alamat,
    u1.whatsapp AS nomor_wa,
    u1.image AS foto,
    u1.role AS role,
    u2.name AS dokter,
    d.description AS deskripsi,
    d.license AS lisensi,
    d.certificate AS sertifikat
  FROM recipes c
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

export async function POST(request) {
  try {
    const data = await request.json();
    const db = await pool.getConnection();
    const query = "INSERT INTO recipes(users_id, doctors_id) VALUES (?, ?)";
    const [result] = await db.execute(query, [data.users_id, data.doctors_id]);
    db.release();

    return NextResponse.json({ id: result.insertId }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const data = await request.json();
    const db = await pool.getConnection();
    const query =
      "UPDATE recipes SET users_id = ?, doctors_id = ? WHERE id = ?";
    await db.execute(query, [data.users_id, data.doctors_id, data.id]);
    db.release();

    return NextResponse.json({ message: "recipes updated successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

>>>>>>> 3296d7c76983a4448baeb199edd0ba18bec61877
export async function DELETE(request) {
  try {
    const data = await request.json();

    const existing = await prisma.recipes.findUnique({
      where: { id: Number(data.id) },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Data tidak ditemukan" },
        { status: 404 },
      );
    }

    await prisma.recipes.delete({
      where: { id: Number(data.id) },
    });

    return NextResponse.json({
      message: "recipes deleted successfully",
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
