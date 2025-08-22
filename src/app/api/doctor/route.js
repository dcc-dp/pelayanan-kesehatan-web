import { NextResponse } from "next/server";
import pool from "@/src/libs/mysql";

export async function GET() {
  try {
    const db = await pool.getConnection();
    const query = "select * from doctor";
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
      "INSERT INTO doctor (category, description, license, certificate) VALUES (?, ?, ?, ?)";
    const [result] = await db.execute(query, [
      data.category,
      data.description,
      data.license,
      data.certificate,
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
    const doctorId = data.id; // user id from the request parameters
    const db = await pool.getConnection();

    const query =
      "UPDATE doctor SET category = ?, description = ?, license = ?, certificate = ? WHERE id = ?";
    await db.execute(query, [
      data.category,
      data.description,
      data.license,
      data.certificate,
      doctorId,
    ]);
    db.release();

    return NextResponse.json({ message: "doctor updated successfully" });
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
    const doctorId = data.id; // user id from the request parameters
    const query = "DELETE FROM doctor WHERE id = ?";
    await db.execute(query, [doctorId]);
    db.release();

    return NextResponse.json({ message: "doctor deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      {
        error: error.message,
      },
      { status: 500 }
    );
  }
}
