import { NextResponse } from "next/server";
import pool from "@/src/libs/mysql"; 

export async function GET() {
  try {
    const db = await pool.getConnection();
    const query = "select * from schedules";
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

    const query = "INSERT INTO schedules(users_id, doctors_id, date, time, status) VALUES (?, ?, ?, ?, ?)";
    const [result] = await db.execute(query, [data.users_id, data.doctors_id, data.date, data.time, data.status]);
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
    const schedulesId = data.id; // user id from the request parameters
    const db = await pool.getConnection();

    const query = "UPDATE schedules SET users_id = ?, doctors_id = ?, date = ?, time = ?, status = ? WHERE id = ?";
    await db.execute(query, [data.users_id, data.doctors_id, data.date, data.time, data.status, schedulesId]);
    db.release();

    return NextResponse.json({
      message: "schedules updated successfully",
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
    const schedulesId = data.id; // user id from the request parameters
    const query = "DELETE FROM schedules WHERE id = ?";
    await db.execute(query, [schedulesId]);
    db.release();

    return NextResponse.json({
      message: "schedules deleted successfully",
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
