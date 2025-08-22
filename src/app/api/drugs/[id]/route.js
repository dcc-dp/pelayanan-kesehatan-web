import { NextResponse } from "next/server";
import pool from "@/src/libs/mysql";

export async function GET(request, { params }) {
  const drugsId = params.id; // user id

  try {
    const db = await pool.getConnection();

    const query = "select * from drugs where id = ?";
    const [rows] = await db.execute(query, [drugsId]);
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
