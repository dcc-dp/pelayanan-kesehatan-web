import { NextResponse } from "next/server";
import { prisma } from "@/src/libs/prisma";

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API untuk mengelola data pengguna (users)
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Mendapatkan semua data pengguna
 *     description: Mengambil seluruh data pengguna tanpa menampilkan password.
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Berhasil mengambil daftar pengguna
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
 *                   name:
 *                     type: string
 *                     example: "Ranti"
 *                   email:
 *                     type: string
 *                     example: "ranti@example.com"
 *                   gender:
 *                     type: string
 *                     example: "perempuan"
 *                   birth:
 *                     type: string
 *                     format: date
 *                     example: "2000-01-01"
 *                   address:
 *                     type: string
 *                     example: "Makassar"
 *                   whatsapp:
 *                     type: string
 *                     example: "08123456789"
 *                   image:
 *                     type: string
 *                     example: "/uploads/user.jpg"
 *                   role:
 *                     type: string
 *                     example: "user"
 *       500:
 *         description: Terjadi kesalahan pada server
 */
export async function GET() {
  try {
    const users = await prisma.users.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        gender: true,
        birth: true,
        address: true,
        whatsapp: true,
        image: true,
        role: true,
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Menambahkan pengguna baru
 *     description: Menyimpan data user baru ke dalam database.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Ranti"
 *               gender:
 *                 type: string
 *                 example: "perempuan"
 *               birth:
 *                 type: string
 *                 format: date
 *                 example: "2000-01-01"
 *               address:
 *                 type: string
 *                 example: "Makassar"
 *               whatsapp:
 *                 type: string
 *                 example: "08123456789"
 *               password:
 *                 type: string
 *                 example: "123456"
 *               email:
 *                 type: string
 *                 example: "ranti@example.com"
 *               image:
 *                 type: string
 *                 example: "/uploads/user.jpg"
 *               role:
 *                 type: string
 *                 example: "user"
 *     responses:
 *       201:
 *         description: Pengguna berhasil ditambahkan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 10
 *                 message:
 *                   type: string
 *                   example: "User berhasil ditambahkan"
 *       500:
 *         description: Terjadi kesalahan saat menambahkan pengguna
 */
export async function POST(request) {
  try {
    const body = await request.json();

    const user = await prisma.users.create({
      data: {
        name: body.name,
        gender: body.gender,
        birth: body.birth ? new Date(body.birth) : null,
        address: body.address,
        whatsapp: body.whatsapp,
        password: body.password,
        email: body.email,
        image: body.image,
        role: body.role || "user",
      },
    });

    return NextResponse.json(
      {
        message: "User berhasil ditambahkan",
        id: user.id,
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/users:
 *   put:
 *     summary: Memperbarui data pengguna
 *     description: Mengupdate seluruh data user berdasarkan ID.
 *     tags: [Users]
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
 *                 example: 1
 *               name:
 *                 type: string
 *                 example: "Ranti Updated"
 *               gender:
 *                 type: string
 *                 example: "perempuan"
 *               birth:
 *                 type: string
 *                 format: date
 *                 example: "2000-01-01"
 *               address:
 *                 type: string
 *                 example: "Makassar"
 *               whatsapp:
 *                 type: string
 *                 example: "08123456789"
 *               password:
 *                 type: string
 *                 example: "newpassword123"
 *               email:
 *                 type: string
 *                 example: "ranti_updated@example.com"
 *               image:
 *                 type: string
 *                 example: "/uploads/new.jpg"
 *               role:
 *                 type: string
 *                 example: "admin"
 *     responses:
 *       200:
 *         description: Pengguna berhasil diperbarui
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User updated successfully"
 *       404:
 *         description: User tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan saat memperbarui data pengguna
 */
export async function PUT(request) {
  try {
    const body = await request.json();

    const existing = await prisma.users.findUnique({
      where: { id: body.id },
    });

    if (!existing) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    await prisma.users.update({
      where: { id: body.id },
      data: {
        name: body.name,
        gender: body.gender,
        birth: body.birth ? new Date(body.birth) : null,
        address: body.address,
        whatsapp: body.whatsapp,
        password: body.password,
        email: body.email,
        image: body.image,
        role: body.role,
      },
    });

    return NextResponse.json({
      message: "User updated successfully",
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/users:
 *   delete:
 *     summary: Menghapus pengguna
 *     description: Menghapus data pengguna berdasarkan ID.
 *     tags: [Users]
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
 *         description: Pengguna berhasil dihapus
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User deleted successfully"
 *       404:
 *         description: User tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan saat menghapus pengguna
 */
export async function DELETE(request) {
  try {
    const body = await request.json();

    const existing = await prisma.users.findUnique({
      where: { id: body.id },
    });

    if (!existing) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    await prisma.users.delete({
      where: { id: body.id },
    });

    return NextResponse.json({
      message: "User deleted successfully",
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
