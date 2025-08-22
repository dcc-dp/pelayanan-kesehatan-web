import { NextResponse } from "next/server";
import pool from "@/src/libs/mysql";

export async function GET() {
  try {
    const db = await pool.getConnection();
    const query = "select * from users";
    const [rows] = await db.execute(query);
    db.release();

    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json(
      {
        error: error,
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const db = await pool.getConnection();

    const query = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
    const [result] = await db.execute(query, [
      data.name,
      data.email,
      data.password,
    ]);
    db.release();

    return NextResponse.json({ id: result.insertId }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error: error,
      },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  const userId = params.id; // user id from the request parameters

  try {
    const data = await request.json();
    const db = await pool.getConnection();

    const query =
      "UPDATE users SET name = ?, password = ?, email = ? WHERE id = ?";
    await db.execute(query, [data.name, data.email, userId]);
    db.release();

    return NextResponse.json({ message: "User updated successfully" });
  } catch (error) {
    return NextResponse.json(
      {
        error: error,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const userId = params.id; // user id from the request parameters

  try {
    const db = await pool.getConnection();

    const query = "DELETE FROM users WHERE id = ?";
    await db.execute(query, [userId]);
    db.release();

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      {
        error: error,
      },
      { status: 500 }
    );
  }
}
