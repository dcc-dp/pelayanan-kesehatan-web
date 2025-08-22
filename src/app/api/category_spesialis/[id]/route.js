import { NextResponse } from "next/server";
import pool from "@/libs/mysql";

export async function GET(request, { params }) {
  const category_spesialisId = params.id; // user id

  try {
    const db = await pool.getConnection();

    const query = "select * from category_spesialis where id = ?";
    const [rows] = await db.execute(query, [category_spesialisId]);
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
