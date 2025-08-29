import { NextResponse } from "next/server";
import pool from "@/src/libs/mysql";

export async function GET() {
  try {
    const db = await pool.getConnection();
    const query = "select * from reminder_schedule";
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

    const query = "INSERT INTO reminder_schedule(users_id) VALUES (?)";
    const [result] = await db.execute(query, [data.users_id]);
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
    const reminder_scheduleId = data.id; // user id from the request parameters
    const db = await pool.getConnection();

    const query = "UPDATE reminder_schedule SET users_id = ? WHERE id = ?";
    await db.execute(query, [data.user_id, reminder_scheduleId]);
    db.release();

    return NextResponse.json({
      message: "reminder_schedule updated successfully",
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
    const reminder_scheduleId = data.id; // user id from the request parameters
    const query = "DELETE FROM reminder_schedule WHERE id = ?";
    await db.execute(query, [reminder_scheduleId]);
    db.release();

    return NextResponse.json({
      message: "reminder_schedule deleted successfully",
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
