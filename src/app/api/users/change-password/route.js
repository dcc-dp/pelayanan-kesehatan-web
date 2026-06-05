import { NextResponse } from "next/server";
import { prisma } from "@/src/libs/prisma";
import bcrypt from "bcryptjs";

/**
 * @swagger
 * /api/users/change-password:
 *   post:
 *     summary: Mengubah password pengguna
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               id:
 *                 type: integer
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password berhasil diubah
 *       400:
 *         description: Validasi gagal
 *       401:
 *         description: Password lama salah
 *       500:
 *         description: Terjadi kesalahan server
 */
export async function POST(request) {
  try {
    const { id, oldPassword, newPassword } = await request.json();

    if (!id || !oldPassword || !newPassword) {
      return NextResponse.json(
        { message: "Semua field wajib diisi" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { message: "Password baru minimal 6 karakter" },
        { status: 400 }
      );
    }

    const user = await prisma.users.findUnique({ where: { id } });

    if (!user) {
      return NextResponse.json(
        { message: "User tidak ditemukan" },
        { status: 404 }
      );
    }

    // Cek password lama (support plaintext & bcrypt)
    let isValid = false;
    if (
      !user.password.startsWith("$2a$") &&
      !user.password.startsWith("$2b$")
    ) {
      isValid = oldPassword === user.password;
    } else {
      isValid = await bcrypt.compare(oldPassword, user.password);
    }

    if (!isValid) {
      return NextResponse.json(
        { message: "Password lama salah" },
        { status: 401 }
      );
    }

    // Hash password baru & update
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.users.update({
      where: { id },
      data: { password: hashedPassword, updated_at: new Date() },
    });

    return NextResponse.json({ message: "Password berhasil diubah" });
  } catch (error) {
    return NextResponse.json(
      { message: "Terjadi kesalahan server", error: error.message },
      { status: 500 }
    );
  }
}
