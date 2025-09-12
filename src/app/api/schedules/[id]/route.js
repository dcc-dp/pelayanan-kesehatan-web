import { NextResponse } from "next/server";
import pool from "@/libs/mysql";

export async function GET(request, { params }) {
  const schedulesId = params.id; // user id

  try {
    const db = await pool.getConnection();

    const query = `
    SELECT 
      s.id,
      s.date, 
      s.time, 
      s.status, 
      u.name AS nama_pasien, 
      drs.id 
      FROM schedules AS s 
      INNER JOIN users AS u ON s.users_id = u.id 
      INNER JOIN doctor AS drs ON s.doctors_id = drs.id
      WHERE s.id = ?
    `;
    const [rows] = await db.execute(query, [schedulesId]);
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
