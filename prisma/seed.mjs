import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import bcrypt from "bcryptjs";
import "dotenv/config";

const adapter = new PrismaMariaDb(process.env.DATABASE_URL);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Memulai seeder untuk Users & Doctor...");

  // Password yang sudah di-hash
  const password = await bcrypt.hash("password123", 10);

  // 1. Buat akun dengan role ADMIN
  const admin = await prisma.users.create({
    data: {
      name: "Administrator",
      email: "admin@medicare.com",
      password: password,
      role: "admin",
      gender: "laki_laki",
      whatsapp: "08111111111",
      address: "Jl. Pusat Admin No 1",
    },
  });
  console.log("✅ Berhasil membuat Admin:", admin.name);

  // 2. Buat akun dengan role USER (Pasien biasa)
  const patient = await prisma.users.create({
    data: {
      name: "Pasien Budi",
      email: "budi@medicare.com",
      password: password,
      role: "user",
      gender: "laki_laki",
      whatsapp: "08222222222",
      address: "Jl. Sehat Selalu No 2",
    },
  });
  console.log("✅ Berhasil membuat User/Pasien:", patient.name);

  // 3. Buat akun dengan role DOKTER dan relasinya di tabel doctor
  const dokterUser = await prisma.users.create({
    data: {
      name: "dr. Ranti",
      email: "ranti@medicare.com",
      password: password,
      role: "dokter",
      gender: "perempuan",
      whatsapp: "08333333333",
      address: "Jl. Kedokteran No 3",
    },
  });

  const doctorDetail = await prisma.doctor.create({
    data: {
      users_id: dokterUser.id,
      description: "Dokter Umum Profesional dengan dedikasi tinggi.",
      license: "LIC-987654321",
      certificate: "CERT-987654321",
    },
  });

  console.log(
    "✅ Berhasil membuat Dokter:",
    dokterUser.name,
    "(Doctor ID:",
    doctorDetail.id,
    ")"
  );

  console.log("🎉 Seeder selesai dijalankan!");
}

main()
  .catch((e) => {
    console.error("❌ Gagal menjalankan seeder:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
