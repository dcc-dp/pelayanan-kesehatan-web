import { NextResponse } from "next/server";
import pool from "@/src/libs/mysql";

export async function GET(request, { params }) {
  const userId = params.id; // user id

  try {
    const db = await pool.getConnection();

    const query = "select * from users where id = ?";
    const [rows] = await db.execute(query, [userId]);
    db.release();

    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json(
      {
        error: error. message,
      },
      { error: error.message, status: 500 }
    );
  }
}
