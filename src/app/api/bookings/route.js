import { NextResponse } from "next/server";
import pool from "@/src/libs/mysql";

export async function GET() {
  try {
    const db = await pool.getConnection();
    const query = `
  SELECT 
  d.name AS obat, 
  d.price AS harga,
  dt.jumlah_minum, dt.jumlah_hari, dt.waktu_minum,
  pembeli.name as nm_pembeli,
  dokter.name as nm_dokter
FROM bookings b
INNER JOIN recipes r ON b.recipes_id = r.id
INNER JOIN details dt ON dt.recipes_id = r.id
INNER JOIN drugs d ON dt.drugs_id = d.id
INNER JOIN users pembeli ON r.users_id = pembeli.id
INNER JOIN doctor dr ON r.doctors_id = dr.id
INNER JOIN users dokter ON dr.users_id = dokter.id
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
      "INSERT INTO  bookings(recipes_id, total) VALUES (?, ?)";
    const [result] = await db.execute(query, [
      data.recipes_id,
      data.total,
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
    const bookingsId = data.id; // user id from the request parameters
    const db = await pool.getConnection();

    const query =
      "UPDATE bookings SET recipes_id = ?, total = ? WHERE id = ?";
    await db.execute(query, [
      data.recipes_id,
      data.total,
      bookingsId,
    ]);
    db.release();

    return NextResponse.json({
      message: "bookings updated successfully",
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
    const bookingsId = data.id; // user id from the request parameters
    const query = "DELETE FROM bookings WHERE id = ?";
    await db.execute(query, [bookingsId]);
    db.release();

    return NextResponse.json({
      message: "bookings deleted successfully",
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
