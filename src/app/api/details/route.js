import { NextResponse } from "next/server";
import pool from "@/src/libs/mysql"; 

export async function GET() {
  try {
    const db = await pool.getConnection();
    const query = `
    SELECT 
      d.id,
      d.jumlah_minum,
      d.jumlah_hari,
      d.waktu_minum,
      dr.name AS nama_drug,
      pasien.name as nm_pasien,
      dokter.name as nm_dokter
      FROM details AS d
      INNER JOIN drugs AS dr ON d.drugs_id = dr.id
      INNER JOIN recipes AS re ON d.recipes_id = re.id
      INNER JOIN users pasien ON re.users_id = pasien.id
      INNER JOIN doctor drs ON re.doctors_id = drs.id
      INNER JOIN users dokter ON drs.users_id = dokter.id
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
      "INSERT INTO  details(recipes_id, drugs_id, jumlah_minum, jumlah_hari, waktu_minum) VALUES (?, ?, ?, ?, ?)";
    const [result] = await db.execute(query, [
      data.recipes_id,
      data.drugs_id,
      data.jumlah_minum,
      data.jumlah_hari,
      data.waktu_minum,
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
    const detailsId = data.id; // user id from the request parameters
    const db = await pool.getConnection();

    const query =
     "UPDATE details SET recipes_id = ?, drugs_id = ?, jumlah_minum = ? ,jumlah_hari = ?, waktu_minum = ?, WHERE id = ?";
    await db.execute(query, [
     data.recipes_id,
      data.drugs_id,
      data.jumlah_minum,
      data.jumlah_hari,
      data.waktu_minum,
      detailsId,
    ]);
    db.release();

    return NextResponse.json({
      message: "details updated successfully",
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
    const detailsId = data.id; // user id from the request parameters
    const query = "DELETE FROM details WHERE id = ?";
    await db.execute(query, [detailsId]);
    db.release();

    return NextResponse.json({
      message: "details deleted successfully",
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
