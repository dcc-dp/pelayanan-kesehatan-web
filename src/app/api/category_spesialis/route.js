import { NextResponse } from "next/server";
import pool from "@/src/libs/mysql";

export async function GET() {
  try {
    const db = await pool.getConnection();
    const query = "select * from category_spesialis";
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
      "INSERT INTO  category_spesialis(specialis_name, description) VALUES (?, ?)";
    const [result] = await db.execute(query, [
      data.specialis_name,
      data.description,
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
    const category_spesialisId = data.id; // user id from the request parameters
    const db = await pool.getConnection();

    const query =
      "UPDATE category_spesialis SET specialis_name = ?, description = ? WHERE id = ?";
    await db.execute(query, [
      data.specialis_name,
      data.description,
      category_spesialisId,
    ]);
    db.release();

    return NextResponse.json({
      message: "category_spesialis updated successfully",
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
    const category_spesialisId = data.id; // user id from the request parameters
    const query = "DELETE FROM category_spesialis WHERE id = ?";
    await db.execute(query, [category_spesialisId]);
    db.release();

    return NextResponse.json({
      message: "category_spesialis deleted successfully",
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
