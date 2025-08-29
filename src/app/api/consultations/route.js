import { NextResponse } from "next/server";
import pool from "@/src/libs/mysql";

export async function GET() {
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
`;

    const [rows] = await db.execute(query);
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

export async function POST(request) {
  try {
    const data = await request.json();
    const db = await pool.getConnection();

    const query =
      "INSERT INTO  consultations(users_id, doctors_id) VALUES (?, ?)";
    const [result] = await db.execute(query, [
      data.users_id,
      data.doctors_id,
    ]);
    db.release();

    return NextResponse.json({ id: result.insertId }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const data = await request.json();
    const consultationsId = data.id; // user id from the request parameters
    const db = await pool.getConnection();

    const query =
      "UPDATE consultations SET users_id = ?, doctors_id = ? WHERE id = ?";
    await db.execute(query, [
      data.users_id,
      data.doctors_id,
      consultationsId,
    ]);
    db.release();

    return NextResponse.json({
      message: "consultations updated successfully",
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const db = await pool.getConnection();
    const data = await request.json();
    const consultationsId = data.id; // user id from the request parameters
    const query = "DELETE FROM consultations WHERE id = ?";
    await db.execute(query, [consultationsId]);
    db.release();

    return NextResponse.json({
      message: "consultations deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error.message,
      },
      { status: 500 }
    );
  }
}
