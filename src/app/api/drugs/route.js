import { NextResponse } from "next/server";
import pool from "@/src/libs/mysql";

export async function GET() {
  try {
    const db = await pool.getConnection();
    const query = "select * from drugs";
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

    const query = "INSERT INTO drugs (name, type, price) VALUES (?, ?, ?)";
    const [result] = await db.execute(query, [
      data.name,
      data.type,
      data.price,
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
    const drugsId = data.id; // user id from the request parameters
    const db = await pool.getConnection();

    const query = "UPDATE drugs SET name = ?, type = ?, price = ? WHERE id = ?";
    await db.execute(query, [data.name, data.type, data.price, drugsId]);
    db.release();

    return NextResponse.json({ message: "drugs updated successfully" });
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
    const drugsId = data.id; // user id from the request parameters
    const query = "DELETE FROM drugs WHERE id = ?";
    await db.execute(query, [drugsId]);
    db.release();

    return NextResponse.json({ message: "drugs deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      {
        error: error.message,
      },
      { status: 500 }
    );
  }
}
