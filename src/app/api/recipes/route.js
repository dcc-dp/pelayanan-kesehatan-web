import { NextResponse } from "next/server";
import pool from "@/src/libs/mysql";

export async function GET() {
  try {
    const db = await pool.getConnection();
    const query = "select * from recipes";
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

    const query = "INSERT INTO recipes(users_id, doctors_id) VALUES (?, ?)";
    const [result] = await db.execute(query, [data.users_id, data.doctors_id]);
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
    const recipesId = data.id; // user id from the request parameters
    const db = await pool.getConnection();

    const query =
      "UPDATE recipes SET users_id = ?, doctors_id = ? WHERE id = ?";
    await db.execute(query, [data.users_id, data.doctors_id, recipesId]);
    db.release();

    return NextResponse.json({
      message: "recipes updated successfully",
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
    const recipesId = data.id; // user id from the request parameters
    const query = "DELETE FROM recipes WHERE id = ?";
    await db.execute(query, [recipesId]);
    db.release();

    return NextResponse.json({
      message: "recipes deleted successfully",
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
