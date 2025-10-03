import { NextResponse } from "next/server";
import pool from "@/src/libs/mysql";

export async function GET(request, { params }) {
  const consultations = params.id; // user id

  try {
    const db = await pool.getConnection();

    const query = `
  SELECT 
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
    d.certificate AS sertifikat
  FROM consultations c
  INNER JOIN users u1 ON c.users_id = u1.id
  INNER JOIN doctor d ON c.doctors_id = d.id
  INNER JOIN users u2 ON d.users_id = u2.id
  where c.id = ?
`;  
    const [rows] = await db.execute(query, [consultations]);
    db.release();

    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json(
      {
        error: error.message,
      },
      { status: 500 }
    );
  }
}
