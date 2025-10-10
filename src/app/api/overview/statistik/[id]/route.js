import { NextResponse } from "next/server";
import pool from "@/src/libs/mysql";

export async function GET(request, {params}) {
  const userId = params.id; // user id

  try {
    const db = await pool.getConnection();
    const query = `SELECT 
    (SELECT COUNT(*) FROM consultations WHERE users_id = ?) AS total_konsultasi,
    (SELECT COUNT(*) FROM schedules WHERE users_id = ?) AS total_jadwal,
    (SELECT COUNT(*) FROM recipes WHERE users_id = ?) AS total_resep
`;

const [rows] = await db.execute(query, [userId, userId, userId]);
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